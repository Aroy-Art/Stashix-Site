---
title: Get Started
description: What Stashix does, what it needs to run, and how to install it.
weight: 20
icon: fa-solid fa-rocket
menus:
  main:
    identifier: docs-get-started
    parent: docs
    weight: 20
    params:
      icon: fa-solid fa-rocket
---

Stashix is a self-hosted library for comics and ebooks. You point it at the
folders where your files already live, and it builds a browsable, searchable
shelf you can read from any browser on your network.

## What you get {#features}

- **Readers in the browser.** Open a comic or ebook and start reading. Your
  place is saved per user, so you can pick up on another device.
- **A library that keeps itself up to date.** Stashix
  [watches your folders](/docs/admin-guide/scanner/how-it-works/#folder-watching)
  and imports new files a few seconds after they land.
- **Metadata from your files.** Series, issue numbers, creators and publishers
  come from `ComicInfo.xml`, `MetronInfo.xml`, sidecar files and filenames.
  See [how to organise your folders](/docs/admin-guide/scanner/file-structure/).
- **Full-text search** across titles, series and publishers.
- **Accounts for the household.** Admin and user roles, per-library
  permissions and age-gates for younger readers.
- **Installable on your phone** as a progressive web app on Android.

Stashix reads `.cbz`, `.cbr`, `.cb7`, `.pdf` and `.epub` files. Anything else
in a library folder is ignored.

## How it fits together {#overview}

Stashix runs as two containers: the Stashix server and a PostgreSQL database.
The default Compose file mounts your library folder **read-only**. Covers,
thumbnails and caches go into a separate data volume.

```text
your library folder ──(read-only)──▶ stashix ◀──▶ postgres
                                        │
                                        ▼
                              browser · :4000
```

## Before you install {#requirements}

| You need | Details |
|---|---|
| Docker with Compose | Any host that runs Linux containers: a home server, a NAS or a VPS. |
| Your library on disk | One folder (or a parent of several) that holds your comics and ebooks. |
| A user ID that can read it | Stashix runs as `PUID`/`PGID` (default `1000`) and must be able to read the library folder. |
| Three random secrets | Generated with `openssl` during setup. See [Installation](installation/#secrets). |
| A modern browser | Any current desktop or mobile browser. |

PostgreSQL ships in the Compose file, so you don't need to install a database
yourself.

## Choose how to install {#install}

{{< cards >}}
{{< card title="Docker Compose" link="installation/" icon="fa-brands fa-docker" badge="Recommended" >}}
Copy `.env.example`, set your secrets and library path, then run
`docker compose up -d`. A setup wizard opens on first launch.
{{< /card >}}
{{< card title="From source" link="https://github.com/aroy-art/stashix#development" icon="fa-solid fa-code" >}}
For development. Needs Elixir 1.18+, Erlang/OTP 27+, PostgreSQL and a few
system tools (`vips`, `p7zip`, `unrar`, `pdfinfo`, `pdftoppm`).
{{< /card >}}
{{< /cards >}}

Once Stashix is running, open `http://<your-server>:4000`, create the admin
account, and add your first library.
