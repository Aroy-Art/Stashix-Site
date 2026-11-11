---
title: Stashix is early. Here's how you can help
linkTitle: How you can help
description: Stashix is early software. What that means if you run it today, and how you can help by testing, reporting bugs, improving the docs or contributing code.
date: 2026-11-11
tags: [announcement, contributing]
categories: [news]
---

Stashix [0.0.1](/blog/release/0.0.1/) is out, and it's usable: you can point
it at your comics, read them in the browser and have metadata matched for you.
But it's early software, and you should know what that means before you rely
on it.

## What "early" means {#early}

- **Expect bugs.** Stashix has been tested on a handful of libraries, not
  thousands. Unusual files, folder layouts and setups will turn up problems.
- **Things will change.** Until 1.0.0, the database schema and the API can
  change between any two releases.
- **Back up before you upgrade.** Back up the database before every upgrade,
  so you can go back if a release doesn't work for you.
- **Decide whether Stashix may touch your files.** Edited metadata can be
  written back into your files. If you'd rather Stashix never change them,
  keep edits in the database only, and keep a backup of your library either
  way.

## How you can help {#help}

You don't need to write code to make a difference. The most useful thing right
now is people using Stashix and telling us where it falls short.

### Try it and report what breaks {#report}

[Install Stashix](/docs/get-started/installation/), point it at your library
and use it. When something goes wrong, open an issue on
[GitHub](https://github.com/aroy-art/stashix/issues/new/choose) with your
Stashix version, how you installed it, what you did and what happened instead.
The server log (`docker compose logs stashix`) usually helps.

Files that won't open, series that group wrongly and metadata that matches
the wrong issue are all worth reporting, even if you're not sure it's a bug.

### Suggest features {#features}

Tell us what's missing. The [roadmap](https://github.com/aroy-art/stashix#todo)
lists what's planned, including more formats, more metadata sources, reading
lists and translation of the interface. Feature requests help decide what
comes first.

### Improve the documentation {#docs}

If a guide was unclear or a step was missing, fix it. Every docs page has an
**Edit this page** link that opens its source on GitHub, where you can propose
a change as a pull request.

### Work on the code {#code}

Stashix is written in Elixir with Phoenix LiveView. The
[development instructions](https://github.com/aroy-art/stashix#development)
cover running it from source. Sign off each commit (`git commit -s`) to
certify you wrote it or have the right to submit it under the project's
licence.

### Spread the word {#share}

Star the [repository](https://github.com/aroy-art/stashix) and tell people
who keep a comic or manga collection about it.

## Found a security issue? {#security}

Please don't open a public issue. See
[Reporting security issues](/docs/contributing/security/) for how to report it
privately.

For more detail on every way to contribute, see the
[contributing guide](/docs/contributing/).
