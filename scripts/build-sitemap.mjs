#!/usr/bin/env node
/**
 * Regenerate sitemap.xml with <lastmod> values read from git.
 *
 * Why not just hand-edit the dates: every URL used to claim lastmod
 * 2026-08-26, including pages that had not changed on that date. Google only
 * honours lastmod when it is "consistently and verifiably accurate" — a date
 * that contradicts the Last-Modified header is trivially falsifiable, and the
 * signal then gets discarded for the whole site rather than merely ignored.
 *
 * Why not `new Date()`: that makes all seven URLs claim they changed on every
 * build, which is the same falsifiable pattern and never self-corrects.
 *
 *   npm run build:sitemap        (run it AFTER committing — see the warning below)
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const ORIGIN = 'https://geesly.net';

// Each indexable route, paired with the file whose last commit date IS that
// page's last-modified date. admin.html is absent on purpose: it is
// noindex/nofollow and must stay out of the sitemap.
const ROUTES = [
  { loc: '/',              source: 'index.html',
    images: [1, 2, 3, 4, 5, 6].map((n) => `${ORIGIN}/lib/images/${n}.webp`) },
  { loc: '/about.html',    source: 'about.html' },
  { loc: '/safety.html',   source: 'safety.html' },
  { loc: '/guides.html',   source: 'guides.html' },
  { loc: '/privacy.html',  source: 'privacy.html' },
  { loc: '/terms.html',    source: 'terms.html' },
  { loc: '/deletion.html', source: 'deletion.html' },
];

const git = (args) =>
  execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

let dirty = [];
for (const r of ROUTES) {
  // A file edited but not committed would get its PREVIOUS commit's date,
  // silently publishing a lastmod older than the content. Say so loudly.
  if (git(['status', '--porcelain', '--', r.source])) dirty.push(r.source);
  const iso = git(['log', '-1', '--format=%cI', '--', r.source]);
  if (!iso) throw new Error(`no git history for ${r.source} — run this in a full clone`);
  r.lastmod = iso.slice(0, 10);
}

const body = ROUTES.map((r) => {
  const imgs = (r.images ?? [])
    .map((u) => `\n    <image:image><image:loc>${u}</image:loc></image:image>`)
    .join('');
  return `  <url>\n    <loc>${ORIGIN}${r.loc}</loc>\n    <lastmod>${r.lastmod}</lastmod>${imgs}\n  </url>`;
}).join('\n\n');

writeFileSync('sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
  `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n` +
  `${body}\n\n</urlset>\n`);

for (const r of ROUTES) console.log(`  ${r.lastmod}  ${r.loc}`);
if (dirty.length) {
  console.warn(`\nWARNING: uncommitted changes in ${dirty.join(', ')} — their <lastmod> ` +
    `reflects the last COMMIT, not your working tree. Commit, then re-run.`);
  process.exitCode = 1;
}
