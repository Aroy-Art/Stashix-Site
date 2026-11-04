---
title: Installation
description: Install Stashix with Docker Compose, from an empty folder to your first library.
weight: 10
---

This guide runs Stashix and its PostgreSQL database with Docker Compose. Check
[what you need before installing](../#requirements) first.

## Install {#install}

1. ### Download the Compose files {#download}

   Make a folder for Stashix and fetch the Compose file and the example
   settings into it:

   ```bash
   mkdir stashix && cd stashix
   curl -fsSLO https://raw.githubusercontent.com/aroy-art/stashix/main/docker-compose.yml
   curl -fsSL -o .env https://raw.githubusercontent.com/aroy-art/stashix/main/.env.example
   ```

1. ### Generate secrets {#secrets}

   Stashix needs three random values. Run each command and keep the output for
   the next step:

   ```bash
   openssl rand -base64 48   # SECRET_KEY_BASE
   openssl rand -base64 48   # JWT_SECRET (a different value)
   openssl rand -base64 32   # STASHIX_ENCRYPTION_KEY
   ```

1. ### Edit `.env` {#configure}

   Open `.env` and set these values:

   | Setting | Set it to |
   |---|---|
   | `SECRET_KEY_BASE` | The first secret. |
   | `JWT_SECRET` | The second secret. |
   | `STASHIX_ENCRYPTION_KEY` | The third secret. |
   | `POSTGRES_PASSWORD` | A database password of your choice. |
   | `DATABASE_URL` | `ecto://stashix:<password>@db/stashix`, with the same password. |
   | `LIBRARY_PATH` | The folder on this machine that holds your comics and ebooks. |
   | `PHX_HOST` | The hostname you'll use to reach Stashix, such as `stashix.home.lan`. |
   | `PUID` / `PGID` | A user and group that can read `LIBRARY_PATH`. `id -u` and `id -g` print yours. |

   > [!WARNING]
   > Set `STASHIX_ENCRYPTION_KEY` only on a new install. Adding it to an
   > install that already has encrypted data makes that data unreadable.

1. ### Start Stashix {#start}

   ```bash
   docker compose up -d
   ```

   The first start pulls the images and creates the database, which can take a
   minute.

1. ### Finish setup in the browser {#setup}

   Open `http://<your-server>:4000`. A setup wizard asks you to create the
   admin account. Then add a library that points at a folder inside
   `/libraries`, which is where the container sees your `LIBRARY_PATH`.

   Stashix scans it straight away. Watch the progress under
   **Admin → Libraries**.
{.steps}

## Confirm it's running {#confirm}

```bash
docker compose ps
```

Both the `stashix` and `db` containers should be up, and `db` should report
`healthy`. If the page doesn't load, read the server log with
`docker compose logs stashix`.

## Where your data lives {#data}

| What | Where |
|---|---|
| Your comics and ebooks | `LIBRARY_PATH`, mounted read-only at `/libraries` |
| Covers, thumbnails and image caches | The `stashix_data` volume |
| Library, users and reading progress | The `postgres_data` volume |

Back up the `postgres_data` volume to keep users and reading progress. Covers
are extracted again on the next scan if `stashix_data` is lost.

## If something goes wrong {#troubleshooting}

**The library stays empty.** The container user can't read your files. Check
that `PUID` and `PGID` match an account with read access to `LIBRARY_PATH`,
then run `docker compose up -d` again.

**Some files are missing.** Only `.cbz`, `.cbr`, `.cb7`, `.pdf` and `.epub`
files are imported. See [How the scanner works](/docs/admin-guide/scanner/how-it-works/)
and [File structure](/docs/admin-guide/scanner/file-structure/).

**`docker compose up` refuses to start.** A required secret is empty. The
error names it, for example `set SECRET_KEY_BASE in .env`.
