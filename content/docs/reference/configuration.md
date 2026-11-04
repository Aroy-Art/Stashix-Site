---
title: Configuration
description: Every environment variable Stashix reads, with defaults and what each one does.
weight: 10
---

Stashix is configured with environment variables. With Docker Compose they
live in the `.env` file next to `docker-compose.yml`. See
[Installation](/docs/get-started/installation/) for a first setup.

## Required {#required}

| Variable | Default | What it does |
|---|---|---|
| `SECRET_KEY_BASE` | none | Encrypts and signs sessions and cookies. Generate with `openssl rand -base64 48`. |
| `JWT_SECRET` | none | Signs login tokens. Use a different value from `SECRET_KEY_BASE`. |
| `STASHIX_ENCRYPTION_KEY` | none | Base64 32-byte key that encrypts stored metadata source credentials. Generate with `openssl rand -base64 32`. |
| `DATABASE_URL` | `postgresql://stashix:stashix@db/stashix` | PostgreSQL connection, as `ecto://user:password@host/database`. |
| `LIBRARY_PATH` | `./libraries` | Folder on the host that holds your comics and ebooks. Compose mounts it read-write at `/libraries` so metadata can be saved to your files; see [Metadata in your files](/docs/get-started/installation/#metadata-write-back). |

`docker compose up` refuses to start while `SECRET_KEY_BASE`, `JWT_SECRET` or
`STASHIX_ENCRYPTION_KEY` is empty. Stashix also refuses to start if
`STASHIX_ENCRYPTION_KEY` isn't valid base64 or doesn't decode to 32 bytes.

> [!WARNING]
> Don't change `STASHIX_ENCRYPTION_KEY` once it's set: credentials encrypted
> with the old key become unreadable.

### Adding the key to an older install {#encryption-key-upgrade}

Installs that started without `STASHIX_ENCRYPTION_KEY` encrypted their stored
credentials with a key derived from `JWT_SECRET`. To upgrade, generate a key,
add it to `.env` and restart. On that start Stashix re-encrypts the existing
credentials with the new key, and from then on they no longer depend on
`JWT_SECRET`.

Don't change `JWT_SECRET` in the same restart: Stashix needs the old value to
read the credentials it is re-encrypting. Rotate it on a later restart.

## Recommended {#recommended}

| Variable | Default | What it does |
|---|---|---|
| `PHX_HOST` | `localhost` | Public hostname, used when Stashix builds links. |
| `PUID` / `PGID` | `1000` / `1000` | User and group the server runs as. They must be able to read and write `LIBRARY_PATH`. The data volume is handed to them on start. |

## Database {#database}

These configure the bundled PostgreSQL container. Keep the user and password
in step with `DATABASE_URL`.

| Variable | Default | What it does |
|---|---|---|
| `POSTGRES_DB` | `stashix` | Database name. |
| `POSTGRES_USER` | `stashix` | Database user. |
| `POSTGRES_PASSWORD` | `stashix` | Database password. Change it. |
| `POOL_SIZE` | `10` | Database connections Stashix keeps open. |
| `ECTO_IPV6` | `false` | Set to `true` or `1` to reach the database over IPv6. |

## Storage {#storage}

| Variable | Default | What it does |
|---|---|---|
| `DATA_DIR` | `/data` in Docker | Base folder for everything Stashix generates. |
| `THUMBNAIL_DIR` | `DATA_DIR/thumbnails` | Cover thumbnails extracted from your files. |
| `IMAGE_CACHE_DIR` | `DATA_DIR/cache/images/resized` | Resized and WebP cover images. |
| `METADATA_IMAGE_DIR` | `DATA_DIR/cache/images/metadata` | Images from metadata sources. |

All of these are created on start. Covers are extracted again on the next
scan if the folders are lost, but keep them on a persistent volume to avoid
the rescan.

## Server {#server}

| Variable | Default | What it does |
|---|---|---|
| `PORT` | `4000` | HTTP port inside the container. To reach Stashix on another port, change the `ports` mapping in `docker-compose.yml` instead. |
| `DNS_CLUSTER_QUERY` | none | DNS query used to find other nodes when clustering. |

Prometheus metrics are served on a separate port, `9568`, at `/metrics`.

## Settings Compose doesn't pass through {#compose}

The Compose file forwards only the variables it uses, and it pins `PORT` to
`4000` and `DATA_DIR` to `/data`. To use `POOL_SIZE`, `ECTO_IPV6`,
`DNS_CLUSTER_QUERY` or the individual storage folders, add them to the
`environment` block of the `stashix` service:

```yaml
services:
  stashix:
    environment:
      POOL_SIZE: 20
```
