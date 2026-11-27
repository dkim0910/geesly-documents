# Geesly

**Geesly** is a dating app — meet new people, match, and chat. This is the
official website and help center.

👉 **Visit us at [geesly.net](https://geesly.net/)**

## What you'll find here

- **[Home](https://geesly.net/)** — what Geesly is and how to get the app
- **[About](https://geesly.net/about.html)** — our story and what we're about
- **[Safety Tips](https://geesly.net/safety.html)** — how to stay safe while dating
- **[Guides](https://geesly.net/guides.html)** — tips for making the most of Geesly
- **[Privacy Policy](https://geesly.net/privacy.html)** — how we handle your data
- **[Terms of Service](https://geesly.net/terms.html)** — the rules for using Geesly
- **[Delete Your Account](https://geesly.net/deletion.html)** — remove your account and data

## Need help?

Reach us anytime at **hello+geeslyhelp@nelera.net** and we'll get back to you.

## For developers

Plain HTML pages styled with Tailwind — no framework, no bundler. The public
pages link a prebuilt stylesheet (`lib/tailwind.css`), so regenerate it after
changing any class in the HTML or anything in `tailwind.config.js`.
`admin.html` is the exception: it loads Tailwind from the CDN.

```bash
npm install             # once: the Tailwind CLI and typography plugin
npm run dev             # serve the site locally at http://localhost:8080
npm run build:css       # regenerate lib/tailwind.css
npm run build:sitemap   # regenerate sitemap.xml (lastmod from git — run after committing)
npm run build           # both of the above
```

Pushing to `main` publishes to [geesly.net](https://geesly.net/) via GitHub
Pages; there is no CI step. Each page is standalone, so shared markup (nav,
footer, analytics, meta) has to be changed in every file.

---

<sub>This site is hosted on GitHub Pages.</sub>
