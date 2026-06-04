# bithost.io

The marketing site for [bithost.io](https://bithost.io) — a Jekyll static site
deployed via GitHub Pages.

## Prerequisites

- **Ruby 3.x** (pinned to `3.4.5` in `.tool-versions`)
- [Bundler](https://bundler.io/)

If you use [mise](https://mise.jdx.dev/):

```bash
mise install      # installs the Ruby version from .tool-versions
```

## Setup

```bash
bundle install
```

This installs the [`github-pages`](https://github.com/github/pages-gem) gem,
which pins Jekyll and its plugins to the exact versions GitHub Pages uses — so
what you see locally matches production.

## Run locally

```bash
bundle exec jekyll serve
```

Then open **http://localhost:4000**. The site rebuilds automatically as you edit.

## Build

```bash
bundle exec jekyll build      # outputs the static site to _site/
```

## Project structure

```
_config.yml          Site config (kramdown, pretty/extensionless URLs)
_layouts/
  default.html       Base layout: <head>, nav, content, footer
  guide.html         Guide layout: header, on-this-page sidebar, body
_includes/
  head.html          <head> + per-page SEO (driven by front matter)
  nav.html           Top navigation (server-rendered)
  footer.html        Site footer
  promo-bar.html     Promo ticker (shown when a page sets `promo: true`)
  cta-band.html      Reusable "deploy a server" call-to-action
  cookie-consent.html
  jsonld/            Per-page structured data (JSON-LD)
index.html           Home
faq, prices, pay-with-crypto, terms, privacy, 404 …   Top-level pages
bithost-cli-api/     API & CLI docs
guides/
  index.html         Guides listing
  *.md               Individual guides (Markdown)
  _guide-template.md Copy this to start a new guide
assets/              CSS, JS, images, fonts
CNAME                Custom domain (bithost.io)
```

Each page sets its title, description, canonical URL, Open Graph tags, etc. in
its YAML **front matter**; `_includes/head.html` turns those into `<head>` tags.

## Add a guide

1. Copy the template:
   ```bash
   cp guides/_guide-template.md guides/my-topic.md
   ```
2. Fill in the front matter (title, description, `toc`, sidebar links) and write
   the body in Markdown.
3. The file's name becomes its URL: `guides/my-topic.md` → `/guides/my-topic`.
4. Add a card for it in `guides/index.html`.

## Deployment

GitHub Pages builds and serves the site automatically on every push:

- **Settings → Pages → Build and deployment → Source: _Deploy from a branch_**,
  branch `main`, folder `/ (root)`.
- The custom domain (`bithost.io`) is set via the `CNAME` file; enable
  **Enforce HTTPS** in the Pages settings.

No build step or CI is required — GitHub runs Jekyll server-side.
