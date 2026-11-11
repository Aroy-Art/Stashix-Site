---
title: Contributing
description: How to help with Stashix. Report bugs, suggest features, improve the documentation, work on the code, or report a security issue privately.
weight: 50
icon: fa-solid fa-handshake-angle
menus:
  main:
    identifier: docs-contributing
    parent: docs
    weight: 50
    params:
      icon: fa-solid fa-handshake-angle
---

Stashix is free software under the
[GNU AGPL v3 or later](https://github.com/aroy-art/stashix/blob/main/LICENSE),
and help of any size is welcome. You don't need to write code: at this early
stage, using Stashix and telling us where it falls short helps the most. For
a short overview, read [how you can help](/blog/post/how-to-help/).

## Ways to help {#ways}

| If you want to…                     | Go to                                   |
| ----------------------------------- | --------------------------------------- |
| Tell us something is broken         | [Report a bug](#issues)                 |
| Ask for something new               | [Suggest a feature](#features)          |
| Fix a typo or an unclear guide      | [Improve the documentation](#docs)      |
| Fix a bug or build a feature        | [Work on the code](#code)               |
| Report a vulnerability              | [Reporting security issues](security/)  |

## Report a bug {#issues}

Search the [existing issues](https://github.com/aroy-art/stashix/issues)
first; if your problem is already there, add what you know to it. Otherwise
open a [bug report](https://github.com/aroy-art/stashix/issues/new/choose) and
include:

- **Your Stashix version** and how you installed it (Docker Compose, from
  source).
- **What you did**, step by step, so someone else can do the same.
- **What you expected**, and **what happened instead**.
- **The server log** around the time of the problem:
  `docker compose logs stashix`. Remove anything private, such as hostnames or
  file paths you don't want to share.
- **For a problem with one file**, its format (`.cbz`, `.cbr`, `.pdf` …) and,
  if you can, how its folder is laid out. See
  [file structure](/docs/admin-guide/scanner/file-structure/).

Files that won't open, series that group wrongly and metadata that matches the
wrong issue are all worth reporting, even if you're not sure it's a bug.

> [!WARNING]
> Don't report security problems in a public issue. See
> [Reporting security issues](security/).

## Suggest a feature {#features}

Open a
[feature request](https://github.com/aroy-art/stashix/issues/new/choose).
Start with the problem you want solved and why it matters to you, then
describe what you'd like to happen. A use case is more useful than a finished
design.

Check the [roadmap](https://github.com/aroy-art/stashix#todo) first: it lists
what's already planned, such as more formats, more metadata sources, reading
lists, and translation and localization of the interface. If your idea is on
it, a comment on why you need it helps decide what comes first.

## Improve the documentation {#docs}

This site lives in its own
[repository](https://github.com/Aroy-Art/Stashix-Site). Every docs page has an
**Edit this page** link that opens its source on GitHub, where you can propose
a change as a pull request. That's enough for most fixes.

For bigger changes, run the site locally. You need Go and Hugo Extended; the
[site README](https://github.com/Aroy-Art/Stashix-Site#run-it-locally) lists
the exact versions.

```bash
git clone https://github.com/Aroy-Art/Stashix-Site.git
cd Stashix-Site
make serve   # http://localhost:1313/
```

Pages are Markdown under `content/docs/`. Keep sentences short, write for
someone running Stashix for the first time, and test any command you add.

## Work on the code {#code}

Stashix is written in Elixir with Phoenix LiveView, on PostgreSQL. To run it
from source, follow the
[development instructions](https://github.com/aroy-art/stashix#development) in
the README. You need Elixir, Erlang/OTP, PostgreSQL and a few system tools
(`vips`, `p7zip`, `unrar`, `pdfinfo`, `pdftoppm`).

For anything bigger than a small fix, open an issue first and describe what
you plan to do, so nobody spends time on a change that won't fit.

### Before you open a pull request {#checks}

CI checks formatting, compiler warnings and tests on every code change. Run
the same checks in `stashix_web/` first:

```bash
mix format --check-formatted
mix compile --warnings-as-errors
mix test
```

- **Add or update tests** for the behaviour you change.
- **Update the changelog.** Add a line under `## [Unreleased]` in
  `CHANGELOG.md` for anything a user would notice. It follows
  [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- **Keep pull requests focused**: one fix or feature each.

### Commits {#commits}

Write commit messages in the
[Conventional Commits](https://www.conventionalcommits.org/) style, with a
scope when it helps, for example `fix(parser): …` or `docs(readme): …`.

Sign off each commit to certify you wrote it or have the right to submit it
under the project's licence (the
[Developer Certificate of Origin](https://developercertificate.org/)):

```bash
git commit -s
```

By contributing, you agree that your work is released under the
[AGPL v3 or later](https://github.com/aroy-art/stashix/blob/main/LICENSE).

## Spread the word {#share}

Star the [repository](https://github.com/aroy-art/stashix) and tell people
who keep a comic or manga collection about Stashix.

- [Reporting security issues](security/): how to report a vulnerability privately.
{.cards}
