---
title: Monitoring
description: Prometheus metrics, Grafana queries, and the log lines that point at slow pages or proxy problems.
weight: 20
---

Stashix serves [Prometheus](https://prometheus.io/) metrics on a separate port, apart from the web interface.

## Endpoint

```
GET http://<host>:9568/metrics
```

The endpoint returns metrics in the Prometheus text format. It runs on its own listener, independent of port `4000`, and **has no authentication**.

The default `docker-compose.yml` does not publish port `9568`, so the endpoint can only be reached from inside the Compose network. Two ways to scrape it:

- **Run Prometheus in the same Compose project** and scrape `stashix:9568`. Nothing leaves the Docker network.
- **Publish the port** by adding it to the `ports` list of the `stashix` service. Bind it to localhost or a private interface, not to the internet:

  ```yaml
  ports:
    - "4000:4000"
    - "127.0.0.1:9568:9568"
  ```

The port and bind address can't be changed through environment variables. Use the Compose port mapping to control who can reach the endpoint.

## Prometheus scrape config

```yaml
scrape_configs:
  - job_name: stashix
    static_configs:
      - targets: ["stashix:9568"]  # or "<host>:9568" if you published the port
    metrics_path: /metrics
```

## Available metrics

Metric names carry no unit suffix. All durations are in milliseconds; `vm_memory_total` is in kilobytes.

### HTTP and sockets

| Metric | Type | Labels | Description |
| ------ | ---- | ------ | ----------- |
| `phoenix_endpoint_stop_duration` | Histogram | — | HTTP request duration |
| `phoenix_router_dispatch_stop_duration` | Histogram | `route` | Request duration per route |
| `phoenix_router_dispatch_exception_duration` | Histogram | `route` | Duration of requests that raised, per route |
| `phoenix_socket_connected_duration` | Histogram | — | Socket connection handshake duration |
| `phoenix_socket_connected_count` | Counter | `transport` | Socket connections by transport |
| `phoenix_socket_drain_count` | Counter | — | Drained sockets |
| `phoenix_channel_joined_duration` | Histogram | — | Channel join duration |
| `phoenix_channel_handled_in_duration` | Histogram | `event` | Channel event handler duration |

The `transport` label is `websocket` or `longpoll`. A rising `longpoll` count means browsers can't open a WebSocket. See [Long-poll fallback](#long-poll-fallback).

### Pages

| Metric | Type | Labels | Description |
| ------ | ---- | ------ | ----------- |
| `stashix_live_view_callback_duration` | Histogram | `phase`, `view` | Time spent building or updating a page |
| `stashix_live_view_callback_db_time` | Histogram | `phase`, `view` | Database time inside that work |
| `stashix_live_view_callback_queries` | Histogram | `phase`, `view` | Number of database queries inside that work |

`phase` is `mount`, `handle_params`, `handle_event`, `render`, `component_update` or `component_handle_event`. `view` names the page (or component). A page load is `mount` + `handle_params` + the first `render`. `mount` runs twice on a full page load: once for the first HTML response and once when the live connection opens.

### Database

| Metric | Type | Description |
| ------ | ---- | ----------- |
| `stashix_repo_query_total_time` | Histogram | Total query time |
| `stashix_repo_query_query_time` | Histogram | Time running the query |
| `stashix_repo_query_queue_time` | Histogram | Time waiting for a free database connection |
| `stashix_repo_query_decode_time` | Histogram | Time decoding the result |
| `stashix_repo_query_idle_time` | Histogram | Time the connection sat idle before use |

High `queue_time` means the connection pool is too small for the load. Raise `POOL_SIZE` (see [Configuration](/docs/reference/configuration/#compose)).

### Runtime

| Metric | Type | Description |
| ------ | ---- | ----------- |
| `vm_memory_total` | Gauge | Total memory used by the server (kB) |
| `vm_total_run_queue_lengths_total` | Gauge | Work waiting for a scheduler |
| `vm_total_run_queue_lengths_cpu` | Gauge | Work waiting for a CPU scheduler |
| `vm_total_run_queue_lengths_io` | Gauge | Work waiting for an IO scheduler |

## Grafana queries

Add Prometheus as a data source, then start from these:

```promql
# Long-poll fallbacks (clients that couldn't open a WebSocket)
increase(phoenix_socket_connected_count{transport="longpoll"}[5m])

# 95th-percentile request latency
histogram_quantile(0.95, rate(phoenix_router_dispatch_stop_duration_bucket[5m]))

# Slowest pages to load (p95 per page)
histogram_quantile(0.95, sum by (le, view) (rate(stashix_live_view_callback_duration_bucket{phase="mount"}[5m])))

# Average queries per page load
sum by (view) (rate(stashix_live_view_callback_queries_sum{phase="mount"}[5m]))
  / sum by (view) (rate(stashix_live_view_callback_queries_count{phase="mount"}[5m]))

# Waiting for a database connection (p99)
histogram_quantile(0.99, rate(stashix_repo_query_queue_time_bucket[5m]))

# Memory in MB
vm_memory_total / 1024
```

## Logs

Read the server log with `docker compose logs stashix`.

### Page timings

Every page load is logged with its duration and database share:

```
[info] [timing] mount StashixWeb.BookLive connected=true 80.0ms db=42.0ms queries=2
```

Clicks, renders and other updates are logged only when they take longer than 200 ms, at `[warning]` level.

### Long-poll fallback

Stashix logs a warning each time a browser connects with long polling instead of a WebSocket:

```
[warning] LiveView client fell back to long polling user_socket=StashixWeb.UserSocket result=:ok
```

It fires once per connection, not per request. The app still works, but every update takes a full HTTP round trip. Common causes:

- A reverse proxy that doesn't forward the `Connection: Upgrade` and `Upgrade: websocket` headers
- A load balancer with WebSocket support turned off
- A firewall blocking `ws://` or `wss://`
