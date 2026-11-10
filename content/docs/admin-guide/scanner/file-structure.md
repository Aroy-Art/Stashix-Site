---
title: File Structure
seo_title: Comic library folder structure for Stashix
description: How to organise your library folders so Stashix groups books into series correctly.
weight: 20
---

The scanner uses **folder structure** as its primary grouping signal — a subfolder becomes a series, the files inside become its issues. Metadata embedded in the files or their names enriches that grouping but does not override it.

---

## The two patterns

### Series in a subfolder (recommended)

Place all issues of a series in one folder named after the series. The folder name becomes the series name.

```
/comics/
└── Batman (1940-2011)/
    ├── Batman 001 (1940).cbz
    ├── Batman 002 (1940).cbz
    └── Batman 500 (1993).cbz
```

Stashix strips common year and date suffixes from the folder name and stores them as `start_year` / `end_year` on the series record. Supported patterns:

| Folder name | Series name | Start | End | Ongoing |
|-------------|-------------|-------|-----|---------|
| `Batman (1940-2011)` | Batman | 1940 | 2011 | No |
| `The Disavowed (2025-)` | The Disavowed | 2025 | — | Yes |
| `AD Police (1994)` | AD Police | 1994 | — | No |
| `Saga` | Saga | — | — | No |

### Standalone books at the library root

A file placed **directly in the library root** (not inside any subfolder) is imported as a standalone book with no series.

```
/books/
├── The Complete Persepolis.cbz   ← standalone
└── Watchmen.cbz                  ← standalone
```

### Standalone folders

You can also designate a folder as a **standalone container** — every file inside is treated as a standalone book. Configure additional folder names in **Admin → Libraries → Standalone folders**. The built-in defaults are:

- `one-shot`
- `one shot`
- `oneshot`

```
/comics/
└── one-shot/
    ├── Batman Noel.cbz      ← standalone
    └── Superman Smashes.cbz ← standalone
```

---

## Optional: publisher folder

If your library has a **three-level hierarchy** (publisher → series → issues), Stashix infers the publisher from the grandparent folder for new books:

```
/comics/
└── DC Comics/           ← inferred publisher
    └── Batman (1940)/
        ├── Batman 001.cbz
        └── Batman 002.cbz
```

The publisher is only inferred at import time for new books. Renaming the folder later does not automatically update existing books.

---

## Full example

A library that combines all of the above: publisher folders, ongoing and finished series, one-shots, and cover images.

```
/comics/                                         ← library root
├── Massive Publishing/                          ← publisher
│   └── The Disavowed (2025-)/                   ← series, started 2025, ongoing
│       ├── The Disavowed 001 (2025) (digital).cbz   ← issue 1, 2025
│       ├── The Disavowed 002 (2025) (digital).cbz
│       └── The Disavowed 003 (2026) (digital).cbz
├── TOKYOPOP/                                    ← publisher
│   └── One-Shot/                                ← standalone folder
│       └── NOiSE (2007).cbz                     ← standalone book, 2007
└── Viz Graphic Novels/                          ← publisher
    ├── AD Police (1994)/                        ← series, 1994
    │   ├── cover.jpg                            ← series cover
    │   ├── AD Police (1994) - Chapter 1.cbz
    │   ├── AD Police (1994) - Chapter 1.jpg     ← cover for chapter 1
    │   └── AD Police (1994) - Chapter 2.cbz
    ├── Ashen Victor (1997)/                     ← series, 1997
    │   ├── cover.jpg                            ← series cover
    │   ├── Ashen Victor (1997) v01 c1.cbz
    │   └── Ashen Victor (1997) v01 c2.cbz
    └── Battle Angel Alita (1994-1998)/          ← series, 1994 to 1998, finished
        ├── Issue 1 - Rusty Angel (1994).cbz     ← issue 1, title "Rusty Angel"
        ├── Issue 1 - Rusty Angel (1994).jpg     ← cover for issue 1
        ├── Issue 2 - Tears of an Angel (1994).cbz
        └── Issue 2 - Tears of an Angel (1994).jpg
```

**Cover images** are optional. A `cover.jpg` (or `.jpeg`, `.png`, `.webp`) in a series folder is used as the series cover. An image with the same name as a book file, such as `Issue 1 - Rusty Angel (1994).jpg`, is used as that book's cover instead of one generated from the file. Other images in the folder are ignored.

---

## Metadata precedence

Within a single file, Stashix merges metadata from multiple sources. The order of precedence, highest first:

1. **Sidecar XML** — `<filename>.xml` next to the file (MetronInfo or ComicInfo format)
2. **Embedded MetronInfo.xml** — inside the archive
3. **Embedded ComicInfo.xml** — inside the archive (or the PDF info-dict for `.pdf`)
4. **Filename parsing** — series name, issue number, volume, year

Later sources fill in gaps; earlier sources win on any field they provide. Exception: `ComicInfo.Year` beats a year derived from MetronInfo's cover-date fields.

---

## Filename patterns

When no embedded metadata is present, Stashix extracts the series name, issue number, volume, and year from the filename. The parser tries the following patterns in order and stops at the first match:

| Pattern | Example filename | Extracted |
|---------|-----------------|-----------|
| `Series NN (YEAR)` | `Batman 001 (1940)` | series=Batman, issue=1, year=1940 |
| `Series Vol. NN (YEAR)` | `Pariah Vol. 01 (2014)` | series=Pariah, volume=1, year=2014 |
| `Series NN - Title (YEAR)` | `The Bank 01 - The Waterloo Insider (Cinebook 2025)` | series=The Bank, issue=1, title=The Waterloo Insider, year=2025 |
| `Series - cNN Title (YEAR)` | `Amulet - c01 The Stonekeeper (2008)` | series=Amulet, issue=1, title=The Stonekeeper, year=2008 |
| `Series - cNN - Title` | `AKIRA - c001 - The Highway` | series=AKIRA, issue=1, title=The Highway |
| `Issue N - Title (YEAR)` | `Issue 6 - Angel of Death (1996)` | issue=6, title=Angel of Death, year=1996 |
| `Series (YEAR) - Issue N` | `Ghost in the Shell (1991) - Issue 02` | series=Ghost in the Shell, year=1991, issue=2 |

Noise tags — `(Digital)`, `(HQ)`, `(Webrip)`, `(c2c)`, `(Retail)`, `(FIXED)`, `(v2)`, etc. — are stripped before parsing. The `(of N)` suffix is also removed.

---

## Tips and common mistakes

**Do** keep each series in its own folder, named consistently. The scanner detects folder renames by comparing file hashes, so your reading progress survives renaming a series folder.

**Do not** mix multiple series in one folder. Stashix uses one folder = one series, so all files in the same directory end up in the same series.

**Do not** nest series inside each other more than one level below the library root unless you use the publisher pattern. Deep nesting is supported by the recursive walker but only one folder level above the file becomes the series.

**Do** use a sidecar XML (`Batman 001.xml`) when you want reliable metadata that overrides filename guesses. The `ComicInfo.xml` or `MetronInfo.xml` format is both accepted.
