<h1 align="center">
  <img src="assets/icons/logo.svg" alt="" height="96">
  <br>
  <img src="assets/icons/wordmark.svg" alt="Stashix" height="64">
</h1>

Source for [stashix.net](https://stashix.net/): the documentation, guides and
release notes for [Stashix](https://github.com/aroy-art/stashix), a self-hosted
comic book and ebook library.

The site is built with [Hugo](https://gohugo.io/) and the
[OINK](https://oink.pgsty.com/) theme, and deployed to Cloudflare Pages.

## Run it locally

You need Git, Go 1.27.3 or newer, and Hugo Extended 0.168.0. No Node.js or
external Sass compiler is required.

```bash
git clone https://github.com/Aroy-Art/Stashix-Site.git
cd Stashix-Site
make serve
```

Open <http://localhost:1313/>. The first run downloads the pinned OINK Hugo
Module (`v1.4.0`).

`make build` writes a production build to `public/`. Hugo prints a LibSass
deprecation warning from the theme; it is expected.

## Where things live

```text
content/
├── blog/
│   ├── post/          news and write-ups
│   └── release/       generated from the app's CHANGELOG.md
└── docs/
    ├── get-started/   overview and installation
    ├── admin-guide/   running a Stashix server
    └── reference/     configuration
data/home/en.yaml      home page sections
layouts/               overrides of OINK partials
assets/css/stashix.css Stashix colours and component styles
static/images/         screenshots
```

Release pages are not written by hand. `content/blog/release/_content.gotmpl`
downloads the app's `CHANGELOG.md` at build time and makes one page per
version. Downloads are cached for an hour (see `caches` in `hugo.yaml`).

## Deployment

`.github/workflows/cloudflare-pages.yaml` builds and deploys on every push to
`main`. It needs these repository settings:

| Kind | Name | Value |
|---|---|---|
| Variable | `CLOUDFLARE_PAGES_ENABLED` | `true` |
| Variable | `CLOUDFLARE_PROJECT_NAME` | `stashix-site` |
| Variable | `CLOUDFLARE_SITE_URL` | `https://stashix.net/` |
| Secret | `CLOUDFLARE_API_TOKEN` | Pages edit token |
| Secret | `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

## Contributing

Corrections and new pages are welcome. Commits must be signed off
(`git commit -s`) under the
[Developer Certificate of Origin](https://developercertificate.org/).

## License

The site source and content are released under the [MIT License](LICENSE).
Stashix itself is licensed under the AGPL-3.0.
