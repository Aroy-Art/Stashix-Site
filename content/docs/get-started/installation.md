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

1. ### Fill in the secrets {#secrets}

   Stashix needs three random secrets and a database password. Paste these
   lines into your terminal, in the `stashix` folder, to generate them and
   write them into `.env`:

   ```bash
   set_env() { sed -i "s|^$1=.*|$1=$2|" .env; }
   DB_PASSWORD=$(openssl rand -hex 24)
   set_env SECRET_KEY_BASE "$(openssl rand -base64 48)"
   set_env JWT_SECRET "$(openssl rand -base64 48)"
   set_env STASHIX_ENCRYPTION_KEY "$(openssl rand -base64 32)"
   set_env POSTGRES_PASSWORD "$DB_PASSWORD"
   set_env DATABASE_URL "ecto://stashix:$DB_PASSWORD@db/stashix"
   ```

   Run them once, before the first start. On macOS, change `sed -i` to
   `sed -i ''` in the first line.

   > [!WARNING]
   > Back up `.env`. If `STASHIX_ENCRYPTION_KEY` is lost or changed, the
   > metadata source credentials Stashix has stored can't be read anymore.
   > Upgrading an install that ran without this key? See
   > [Adding the key to an older install](/docs/reference/configuration/#encryption-key-upgrade).

   {{< details summary="Prefer to fill them in by hand?" >}}
   Open `.env` and set each value to the output of its command:

   | Setting | Command |
   |---|---|
   | `SECRET_KEY_BASE` | `openssl rand -base64 48` |
   | `JWT_SECRET` | `openssl rand -base64 48` (run it again for a different value) |
   | `STASHIX_ENCRYPTION_KEY` | `openssl rand -base64 32` |
   | `POSTGRES_PASSWORD` | Any password made of letters and numbers |
   | `DATABASE_URL` | `ecto://stashix:<password>@db/stashix`, with the same password |
   {{< /details >}}

1. ### Point Stashix at your library {#configure}

   Open `.env` and set the values only you know:

   | Setting | Set it to |
   |---|---|
   | `LIBRARY_PATH` | The folder on this machine that holds your comics, such as `/srv/comics`. |
   | `PHX_HOST` | The hostname you'll use to reach Stashix, such as `stashix.home.lan`. |
   | `PUID` / `PGID` | A user and group that can read and write `LIBRARY_PATH`. `id -u` and `id -g` print yours. |

1. ### Start Stashix {#start}

   ```bash
   docker compose up -d
   ```

   The first start pulls the images and creates the database, which can take a
   minute. The Stashix image comes from the GitHub Container Registry as
   `ghcr.io/aroy-art/stashix`.

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
| Your comics and ebooks | `LIBRARY_PATH`, mounted at `/libraries` |
| Covers, thumbnails and image caches | The `stashix_data` volume |
| Library, users and reading progress | The `postgres_data` volume |

Back up the `postgres_data` volume to keep users and reading progress. Covers
are extracted again on the next scan if `stashix_data` is lost.

### Metadata in your files {#metadata-write-back}

By default Stashix saves metadata you edit or match back to your files: CBZ
files get a `MetronInfo.xml` inside the archive, and other formats get a
`<book name>.xml` file next to them. Your edits then travel with the files and
survive a database reset.

To keep your library untouched, mount it read-only:

1. In Stashix, open **Admin → Metadata** and turn off **Write metadata to
   files**. Metadata is then kept only in the database.
2. In `docker-compose.yml`, add `:ro` to the library mount:
   `${LIBRARY_PATH:-./libraries}:/libraries:ro`.
3. Run `docker compose up -d`.

Turn the setting off first: with a read-only mount and the setting on, every
metadata change still saves to the database, but each attempt to write the
file fails and is logged as an error.

## If something goes wrong {#troubleshooting}

**The library stays empty.** The container user can't read your files. Check
that `PUID` and `PGID` match an account with read access to `LIBRARY_PATH`,
then run `docker compose up -d` again.

**Metadata changes don't show up in the files.** Check that `PUID` and `PGID`
can write to `LIBRARY_PATH` and that the library isn't mounted with `:ro`. See
[Metadata in your files](#metadata-write-back).

**Some files are missing.** Only `.cbz`, `.cbr`, `.cb7`, `.pdf` and `.epub`
files are imported. See [How the scanner works](/docs/admin-guide/scanner/how-it-works/)
and [File structure](/docs/admin-guide/scanner/file-structure/).

**`docker compose up` refuses to start.** A required secret is empty. The
error names it, for example `set STASHIX_ENCRYPTION_KEY in .env`.

**Stashix exits saying `STASHIX_ENCRYPTION_KEY` is not valid base64 or must
decode to 32 bytes.** The key was mistyped or generated with the wrong length.
Generate it with `openssl rand -base64 32` and paste the whole output.
