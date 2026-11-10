---
title: Stashix compared with Komga and Kavita
linkTitle: Compared with others
seo_title: Stashix vs Komga vs Kavita – self-hosted comic servers compared
description: How Stashix differs from Komga and Kavita in formats, metadata, reading apps, database and licence, to help you pick a self-hosted comic server.
weight: 30
# DRAFT: not built in production. Before publishing, resolve every TODO below,
# recheck the Komga and Kavita columns against their current docs (checked
# 2026-11-10), and remove `draft: true`.
draft: true
---

Stashix, [Komga](https://komga.org) and [Kavita](https://www.kavitareader.com)
are all free, open-source servers that turn a folder of comics into a library
you read in the browser. This page lists where they differ, so you can choose
the one that fits your collection. If you already run one of the others, see
[switching to Stashix](#switching).

## At a glance

| | Stashix | Komga | Kavita |
|---|---|---|---|
| Licence | AGPL-3.0 | MIT | GPL-3.0 |
| Comic archives | CBZ, CBR, CB7 | CBZ, CBR | CBZ, CBR, CB7, ZIP, RAR |
| PDF | Pages shown as images | Yes | Yes |
| EPUB | Image-based only (manga, comics) | Yes | Yes, including text books |
| Embedded metadata | ComicInfo.xml, MetronInfo.xml | ComicInfo.xml | ComicInfo.xml |
| Online metadata matching | Metron, Comic Vine, GCD | No (TODO: confirm) | Through paid Kavita+ |
| OPDS feed | TODO | v1 and v2 | Yes |
| Users and age limits | Roles, per-library access, age ratings | Per-library access, age and label restrictions | Roles, age restrictions, OIDC |
| E-reader sync | TODO | KOReader, Kobo | TODO |
| Database | PostgreSQL | TODO: confirm (embedded) | SQLite |
| Install | Docker Compose | Docker, JAR | Docker, native |

## Where Stashix is different

**Metadata matching built in.** Stashix identifies each series and issue
against Metron, Comic Vine and GCD and fills in credits, summaries and story
arcs. Matches it is unsure of wait in a review queue. It reads ComicInfo.xml
and MetronInfo.xml, and by default saves what it matches back into your files
as MetronInfo.xml, so the metadata survives a database reset. See
[how the scanner works](/docs/admin-guide/scanner/how-it-works/).

**PostgreSQL instead of an embedded database.** Stashix runs with its own
PostgreSQL container. That is one more service to run, but it handles large
libraries and concurrent users well. TODO: replace with the actual reason you
chose PostgreSQL.

**CB7 support** (also in Kavita, not listed for Komga). 7-Zip archives
(`.cb7`) are read like `.cbz` and `.cbr`.

## Where the others are ahead

**Text ebooks.** Kavita reads EPUB novels as text. Stashix shows EPUBs and
PDFs as page images, so it suits comics and manga but not novels yet.

**Reading apps.** TODO: say whether Stashix serves OPDS or has another way to
read in third-party apps. Komga serves OPDS v1 and v2 and syncs with KOReader
and Kobo e-readers.

**Maturity.** Komga and Kavita have years of releases and large user bases.
Stashix is at version 0.0.1, and its database schema can change between
releases before 1.0.

## Switching to Stashix {#switching}

Stashix reads your existing folders and does not need them reorganised; see
[file structure](/docs/admin-guide/scanner/file-structure/). ComicInfo.xml
files already in your archives are read on the first scan.

TODO: state whether reading progress, read lists or users can be imported from
Komga or Kavita. If they can't, say so.
