# geesly-documents

Marketing + legal site for **Geesly** (a dating app), plus an internal admin tool.
Static HTML styled with Tailwind (via CDN) — no build step, hosted on GitHub Pages.

- Live: https://geesly.net/ (and https://dkim0910.github.io/geesly-documents/)

## Pages

- `index.html` — home page
- `about.html`, `safety.html`, `blog.html`
- `terms.html`, `privacy.html`, `deletion.html` — legal / data deletion
- `admin.html` — internal, auth-gated admin tool (growth stats + image moderation);
  `noindex` and not in the sitemap. Uses the Firebase web SDK + Chart.js.

## Local preview

```bash
npm run dev   # serves at http://localhost:8080 (use localhost, not 127.0.0.1, for Firebase auth)
```

## Deploying

Push to `main` — GitHub Pages publishes automatically. No build step.

See [CLAUDE.md](CLAUDE.md) for conventions and admin-page details. The admin
page's backend (Firestore/Storage rules, stats function) lives in the `geesly` app repo.
