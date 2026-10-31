---
title: How the Scanner Works
description: File discovery, metadata parsing, thumbnail generation, and folder watching.
weight: 10
---

## Supported formats

Stashix reads the following file types:

| Format | Extension | Notes |
|--------|-----------|-------|
| Comic Book ZIP | `.cbz` | Most common; ZIP archive of images |
| Comic Book RAR | `.cbr` | RAR archive of images |
| Comic Book 7-Zip | `.cb7` | 7-Zip archive of images |
| EPUB | `.epub` | Ebooks and manga |
| PDF | `.pdf` | Comics and ebooks scanned to PDF |

All other extensions are silently ignored. Files are matched case-insensitively (`.CBZ` and `.cbz` are equivalent).

---

## Scan phases

A full library scan runs through four sequential phases. You can watch progress in **Admin → Libraries**.

### 1. Collecting

Stashix walks the library root recursively and lists every file whose extension is in the supported set. The walk is parallelised so even very large libraries (tens of thousands of files) collect quickly.

### 2. Parsing

Each new or modified file is parsed concurrently (up to 16 at a time). Parsing extracts:

- Embedded `MetronInfo.xml` or `ComicInfo.xml` from ZIP/RAR/7z archives
- A sidecar `<filename>.xml` placed next to the file (takes highest precedence)
- PDF info-dict fields (title, author, creation date) for `.pdf` files
- Filename heuristics for anything not covered by embedded metadata

Files whose path and modification time have not changed since the last scan are skipped entirely.

### 3. Importing

Parsed files are upserted into the database:

- A new file that shares a hash with an existing record is treated as a **move** — the book record is preserved and its path updated.
- A file at a known path whose modification time has advanced is **updated in place**.
- A file at an unknown path with an unknown hash creates a **new book**.

### 4. Thumbnails

After all books are imported, cover thumbnails are generated (up to 4 at a time). The scanner looks for a sidecar image first:

```
Batman 001.cbz
Batman 001.jpg   ← used as cover if present
```

Supported sidecar extensions: `.jpg`, `.jpeg`, `.png`, `.webp`.

If no sidecar exists, the first image inside the archive becomes the cover. Thumbnails are stored as JPEG in the configured thumbnail directory and a [BlurHash](https://blurha.sh/) is computed for smooth loading placeholders.

---

## Orphan detection

After importing, Stashix compares the files found on disk with the database. Any book whose file no longer exists is **soft-deleted** (marked with a deletion timestamp). It is hidden from all library views but its metadata and reading progress are retained. Re-adding the file restores it.

Series with no remaining books are also soft-deleted.

---

## Folder watching

Stashix watches your library folders for filesystem events using the OS native API (inotify on Linux, FSEvents on macOS). When a supported file or its sidecar is created, modified, or moved into a watched folder, the scanner queues a single-file scan after a **5-second debounce** — rapid saves (e.g. a download in progress) do not trigger repeated scans.

Events for files Stashix itself just wrote (metadata write-back) are suppressed for 30 seconds to avoid re-importing its own output.

---

## Forcing a rescan

A normal scan skips files whose path and modification time are unchanged. To re-parse everything regardless:

1. Go to **Admin → Libraries**
2. Click the **⋯** menu next to a library
3. Choose **Force rescan**

You can also trigger a rescan on a single series from the series detail page.
