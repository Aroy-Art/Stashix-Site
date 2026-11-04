---
title: Introducing Stashix
description: A self-hosted library for your comics and ebooks, now with a home on the web.
date: 2026-11-04
tags: [announcement]
categories: [news]
---

Stashix is a self-hosted library for comics and ebooks. You point it at the
folders where your files already live, and it turns them into a shelf you can
browse, search and read from any browser on your network.

This site is its new home: documentation, guides and release notes in one
place.

## Why Stashix

Most collections start as a folder of `.cbz` files and grow into something
nobody can find their way around. Stashix keeps your files where they are and
builds a library on top of them:

- **Read in the browser.** The built-in reader for comics and manga saves
  your place on every page, per user, and has a long-strip mode for webtoons.
- **Folder watching.** Drop a file into a watched folder and it appears in the
  library a few seconds later.
- **Metadata from your files.** Series, issue numbers, creators and publishers
  come from `ComicInfo.xml`, `MetronInfo.xml`, sidecar files and filenames.
- **Series and issue matching.** Stashix identifies each series and issue
  against Metron, Comic Vine and the Grand Comics Database, and fills in
  credits, summaries, story arcs and more. Confident matches are applied on
  their own; anything unclear waits for you in a review queue.
- **Full-text search** across titles, series and publishers.
- **Accounts for the household.** Admin and user roles, per-library
  permissions and age-gates.
- **Installable on your phone** as a progressive web app.

Stashix reads `.cbz`, `.cbr`, `.cb7` and `.pdf` files, plus image-based
`.epub` files such as manga. Text ebooks can't be read yet. Metadata you
edit is saved back to your files, or kept only in the database if you'd rather
Stashix never touch them.

## Try it

Stashix runs with Docker Compose next to a PostgreSQL database:

```bash
cp .env.example .env   # set secrets and LIBRARIES_PATH
docker compose up -d   # then open http://localhost:4000
```

A setup wizard runs on first launch. The
[installation guide](/docs/get-started/installation/) walks through every
step, and the [file structure guide](/docs/admin-guide/scanner/file-structure/)
shows how to lay out your folders so series group correctly.

## What's next

Stashix is early: the first release,
[0.0.1](/blog/release/0.0.1/), is being prepared. On the roadmap are more
formats, more metadata sources and reading lists. Follow along, report bugs
or ask questions on [GitHub](https://github.com/aroy-art/stashix).
Stashix is free and open source under the AGPL-3.0.
