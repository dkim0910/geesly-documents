# CLAUDE.md

Guidance for working in this repository.

## What this is

Marketing + legal site for **Geesly**, a dating app, plus one Firebase-backed
**admin tool** (`admin.html`). Plain HTML pages styled with Tailwind (loaded from
CDN). No build step, no framework, no bundler.

- Hosted on **GitHub Pages** from the `main` branch.
- Custom domain **apex `geesly.net`** (see `CNAME`) is the only URL that serves
  content directly — `https://dkim0910.github.io/geesly-documents/` and the
  `www` host `https://www.geesly.net/` both **301-redirect** to it (flipped from
  www-canonical to apex-canonical 2026-07-24). This is why the Android App Links
  filter in the app repo must use `geesly.net` only — App Links and iOS Universal
  Links do **not** follow the `www`→apex redirect, so the app's Android intent
  filter and iOS `Associated Domains` entitlement must target `geesly.net`.
- Jekyll is effectively disabled (`.nojekyll`), except `_config.yml` only exists
  to include the `.well-known` directory in the published output.

## Pages

Each page is a standalone `.html` file with its own `<head>`. Editing shared
markup (nav, footer, analytics, meta) means **changing every file** — there are
no partials or includes.

- `index.html` — home page (largest)
- `about.html`, `safety.html`, `guides.html`
- `terms.html`, `privacy.html`, `deletion.html` (account/data deletion)
- `admin.html` — **internal admin tool** (not marketing). See below; `noindex`,
  excluded from `sitemap.xml`.

## Conventions

- **Styling:** Tailwind via `<script src="https://cdn.tailwindcss.com">` (the
  v3 Play CDN — migrating to Tailwind 4's browser build is a real migration,
  not a URL swap, because of the next point). Dark theme, brand background
  `#0d0618`. **Every public page** carries its own inline `tailwind.config`
  block (and `index.html` extra `<style>`), so config changes mean editing all
  of them.
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
- `.well-known/apple-app-site-association` — iOS Universal Links (AASA; added
  2026-07-20, appID `YU66583SCF.com.geesly.blm`, paths `/profile*` `/chat*`
  `/premium*`). No file extension — GitHub Pages serves it as
  `application/octet-stream`, which Apple's CDN accepts. Keep both deep-link
  files next to each other.
- `app-ads.txt`, `ads.txt` — ad network authorization.
- `manifest.json`, `browserconfig.xml`, `opensearch.xml` — PWA / browser metadata.
- `robots.txt`, `sitemap.xml` — update `sitemap.xml` when adding/removing pages.
- `google236158bb56ebb239.html` — Google Search Console verification (don't delete).

## Admin page (`admin.html`)

A standalone, auth-gated admin tool for the app's owner — the one page here that
is **not** static marketing. Added 2026-06-13.

- **Firebase web SDK** (compat, via CDN; 12.16.0 as of 2026-07-21 — bumped from
  10.12.2, needs a sign-in + moderation-queue click-through before full trust)
  + **Chart.js** (CDN, 4.5.1). Connects to the canonical Firebase project
  **`geesly-20251018643`** (the app's live data).
- **Auth:** Google sign-in, gated by a hardcoded **admin UID allowlist**
  (`ADMIN_UIDS` in the page). This mirrors `isAdmin()` in the app repo's
  `firestore.rules` and `storage.rules` **and `ADMIN_UIDS` in the app repo's
  `functions/index.js`** — **keep all four in sync.** The page gate is UX only;
  real enforcement is the rules/functions.
- **Growth tab:** reads `admin/stats` + `admin/stats/history` snapshots (written
  by the `dailyGenderRatioStats` Cloud Function), shows totals with 7d/30d deltas,
  a Week/Month/Year trend line chart, and current age-group + gender breakdowns.
- **Image moderation tab:** lists users with photos (gender filter, infinite
  scroll, 50/page); actions: Mark reviewed (`imagesReviewed`), Blacklist
  (`isBlacklisted`), Delete (re-onboard), Skip (hides the card, changes
  nothing), and per-photo delete — deletes the Storage file too (needs the admin
  override in `storage.rules`).
- **Never merge-`set()` a user doc from this page** (2026-08-26): the rules give
  admins `update` on `/users/{uid}` but **not** `create`, and a merge-set on a
  doc that no longer exists is evaluated as a *create*. Cards outlive their
  profiles (the person deletes their account, a cleanup pass runs), so that used
  to fail with "Missing or insufficient permissions" and jam the queue on one
  user. Every write path now uses `update()` and, when it fails, re-reads the
  doc and flags the card as gone instead of looping. Deleted accounts — scrubbed
  to an email-only doc — are filtered out of the queue.
- **Users tab:** every user doc — email, UID, whether each `profileImageUrls`
  entry actually loads — plus a per-row **Delete** (same `adminDeleteUser` call
  as the moderation tab). A profile doc only stores the email the sign-in
  provider gave the client at sign-up, so rows with a blank one fill in from
  Firebase Auth via the **`adminLookupEmails`** callable (app repo,
  `functions/index.js`; needs `./deploy-functions.sh`) and are tagged `(auth)`.
  Without that function deployed the row just reads "(no email on profile)".
- **Caching:** Firestore IndexedDB persistence is on
  (`db.enablePersistence({synchronizeTabs:true})`, called right after
  `firebase.firestore()` — it must run before any read). Reads go through
  `cachedGet()`, which serves from the local cache while that tab's data is
  younger than its TTL (`CACHE_TTL`: growth 6h, moderation/users 10min; stamps
  live in `localStorage.geeslyAdminCache`) and otherwise hits the server. Each
  tab has a **Refresh** button that forces a server read for the whole load
  cycle (`modForce` / `usrForce` stay set until the next reset). Paged list
  queries pass `expectSize`, so a half-cached page isn't mistaken for the end of
  the list. `count()` is an aggregate query and can't read from cache, so its
  last value is kept in `localStorage` too.
- **Security posture** (reviewed 2026-08-26): this repo is **public** and
  `admin.html` is served publicly — deliberately. The page's `ADMIN_UIDS` gate
  is UX only; the real boundary is server-side (`isAdmin()` in `firestore.rules`
  and `storage.rules`, plus the `ADMIN_UIDS` check in every `admin*` callable) —
  all four verified consistent. Nothing secret ships in the page: the Firebase
  **web** apiKey is a public identifier, and the admin UID is an identifier, not
  a credential (history scanned — no keys have ever been committed). Two known
  gaps, both independent of the page being public: `/users/{uid}` is readable by
  **any signed-in user**, so someone who edits out the client gate can *read*
  the lists (never write); and **App Check is not enabled** anywhere. Keep
  `admin.html`'s `noindex` meta and out of `sitemap.xml` — do **not** add it to
  `robots.txt`, which would advertise the path and stop crawlers reading the
  noindex.
- **Config to fill if regenerating:** the Firebase **web** `firebaseConfig`
  (apiKey/appId from a Web app registered in the console) and `ADMIN_UIDS`. For
  Google sign-in to work, `geesly.net` / `dkim0910.github.io` must be in Firebase
  **Auth → authorized domains** (and `localhost` works by default — use
  `localhost`, not `127.0.0.1`).

## Local preview

```bash
npm run dev   # npx live-server --host=localhost .  (use localhost for Firebase auth)
```

## Deploying

Push to `main`; GitHub Pages publishes automatically. No build or CI step.
(The admin page's backend — Firestore/Storage rules and the stats function —
lives in the app repo `geesly`, deployed via the Firebase CLI.)
