# CLAUDE.md

Guidance for working in this repository.

## What this is

Static marketing + legal site for **Geesly**, a dating app. Plain HTML pages
styled with Tailwind (loaded from CDN). No build step, no framework, no bundler.

- Hosted on **GitHub Pages** from the `main` branch.
- Custom domain `www.geesly.net` (see `CNAME`); also live at
  `https://dkim0910.github.io/geesly-documents/` and `https://geesly.net/`.
- Jekyll is effectively disabled (`.nojekyll`), except `_config.yml` only exists
  to include the `.well-known` directory in the published output.

## Pages

Each page is a standalone `.html` file with its own `<head>`. Editing shared
markup (nav, footer, analytics, meta) means **changing every file** — there are
no partials or includes.

- `index.html` — home page (largest; has inline `tailwind.config` and `<style>`)
- `about.html`, `safety.html`, `blog.html`
- `terms.html`, `privacy.html`, `deletion.html` (account/data deletion)

## Conventions

- **Styling:** Tailwind via `<script src="https://cdn.tailwindcss.com">`. Dark
  theme, brand background `#0d0618`. Index page defines extra config/styles
  inline; other pages use utility classes directly.
- **SEO:** pages include `<meta>` tags and JSON-LD (`application/ld+json`)
  structured data. Keep these in sync when changing titles/descriptions.
- **Indentation:** 4 spaces inside `<head>`.

## Site-wide tags (present on every page, keep consistent)

- **Google Analytics (GA4):** `G-4FW6NKFV3N` — gtag.js snippet near top of
  `<head>`, right after the charset meta.
- **Google AdSense:** `ca-pub-7400069037778721` (adsbygoogle.js).

## Assets & metadata files

- `lib/images/` — image assets.
- `.well-known/assetlinks.json` — Android App Links verification.
- `app-ads.txt`, `ads.txt` — ad network authorization.
- `manifest.json`, `browserconfig.xml`, `opensearch.xml` — PWA / browser metadata.
- `robots.txt`, `sitemap.xml` — update `sitemap.xml` when adding/removing pages.
- `google236158bb56ebb239.html` — Google Search Console verification (don't delete).

## Local preview

```bash
npm run dev   # npx live-server .
```

## Deploying

Push to `main`; GitHub Pages publishes automatically. No build or CI step.
