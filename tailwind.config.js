/**
 * Tailwind theme for geesly.net.
 *
 * This file exists because the site used to load https://cdn.tailwindcss.com,
 * which compiles CSS in the browser at runtime. That meant every style on the
 * site depended on a ~400 KB script: a slow or blocked CDN rendered the pages
 * completely unstyled, and first paint was always unstyled-then-reflowed,
 * which is a direct CLS and LCP cost on every page view.
 *
 * The public pages now link a prebuilt stylesheet instead (lib/tailwind.css).
 * Regenerate it after changing any class in the HTML or anything here:
 *
 *     npm run build:css
 *
 * admin.html deliberately still uses the CDN: it builds class names
 * dynamically in JS (`class="... ${ok ? 'border-green-500' : ...}"`), which a
 * content-scanning build cannot see, and it is noindex/single-user so its
 * performance does not matter.
 *
 * Design: the site follows the app's flat 2026-11 look — one purple accent,
 * flat surfaces, pill buttons, no gradients, Plus Jakarta Sans. The colours
 * are CSS variables defined in tailwind.input.css (dark by default, light
 * under prefers-color-scheme: light); the names below map onto the app's
 * tokens (geesly/lib/design/colors.dart):
 *
 *   page / page-alt          background / backgroundSecondary
 *   surface / surface-variant  cards, grouped rows / wells, inputs
 *   primary / primary-dark   button fills / their hover
 *   on-primary               text on a primary fill
 *   primary-text             accent text, links, icons on the page
 *   primary-soft             tinted chip / icon-tile / selected-card fill
 *   fg / fg-muted / fg-subtle  textPrimary / textSecondary / textTertiary
 *   line / line-soft         border / borderLight (hairlines)
 *   accent, corn, success, danger, warning
 *
 * Use these, not Tailwind's stock greys/white/purple: a hard-coded colour
 * only looks right in one of the two palettes.
 */

// A token stored as "R G B" channels, so opacity modifiers (bg-page/90) work.
const channels = (name) => `rgb(var(${name}) / <alpha-value>)`;
// The same token as a plain colour value, for the typography plugin.
const solid = (name) => `rgb(var(${name}))`;

module.exports = {
  content: [
    './index.html',
    './about.html',
    './safety.html',
    './guides.html',
    './privacy.html',
    './terms.html',
    './deletion.html',
    './404.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        page: { DEFAULT: channels('--c-page'), alt: channels('--c-page-alt') },
        surface: {
          DEFAULT: channels('--c-surface'),
          variant: channels('--c-surface-variant'),
        },
        primary: {
          DEFAULT: channels('--c-primary'),
          dark: channels('--c-primary-dark'),
          text: channels('--c-primary-text'),
          soft: 'var(--c-primary-soft)',
        },
        'on-primary': channels('--c-on-primary'),
        fg: {
          DEFAULT: channels('--c-fg'),
          muted: channels('--c-fg-muted'),
          subtle: channels('--c-fg-subtle'),
        },
        line: { DEFAULT: 'var(--c-line)', soft: 'var(--c-line-soft)' },
        accent: channels('--c-accent'),
        corn: channels('--c-corn'),
        success: channels('--c-success'),
        danger: channels('--c-danger'),
        warning: channels('--c-warning'),
        // Tile behind the logo (icon-192.png is a white swan on transparent,
        // invisible on the light page). The app's launcher icon colour; a
        // logo doesn't change with the theme, so this one is fixed.
        logo: '#9D7EDA',
      },
      // The app's type scale (lib/design/typography.dart): weight 800 with
      // tight negative tracking. display-lg / display-xl are web-only
      // sizes for hero headings, at the same em-ratio of tracking.
      fontSize: {
        'display-xl': ['72px', { lineHeight: '1.04', letterSpacing: '-2.4px', fontWeight: '800' }],
        'display-lg': ['60px', { lineHeight: '1.05', letterSpacing: '-2px', fontWeight: '800' }],
        display: ['44px', { lineHeight: '1.05', letterSpacing: '-1.5px', fontWeight: '800' }],
        'display-sm': ['36px', { lineHeight: '1.1', letterSpacing: '-1px', fontWeight: '800' }],
        headline: ['32px', { lineHeight: '1.15', letterSpacing: '-1px', fontWeight: '800' }],
        'headline-md': ['28px', { lineHeight: '1.2', letterSpacing: '-0.6px', fontWeight: '800' }],
        'headline-sm': ['24px', { lineHeight: '1.25', letterSpacing: '-0.5px', fontWeight: '800' }],
        title: ['20px', { lineHeight: '1.3', letterSpacing: '-0.3px', fontWeight: '800' }],
      },
      // Cards are 18px (large 22px), as AppSurfaces.cardRadius.
      borderRadius: {
        card: '18px',
        'card-lg': '22px',
      },
      // `prose-geesly`: the long-form legal pages in the palette. Use it
      // instead of prose-invert — the variables already follow the theme.
      typography: {
        geesly: {
          css: {
            '--tw-prose-body': solid('--c-fg-muted'),
            '--tw-prose-headings': solid('--c-fg'),
            '--tw-prose-lead': solid('--c-fg'),
            '--tw-prose-links': solid('--c-primary-text'),
            '--tw-prose-bold': solid('--c-fg'),
            '--tw-prose-counters': solid('--c-fg-subtle'),
            '--tw-prose-bullets': solid('--c-primary-text'),
            '--tw-prose-hr': 'var(--c-line-soft)',
            '--tw-prose-quotes': solid('--c-fg'),
            '--tw-prose-quote-borders': 'var(--c-line)',
            '--tw-prose-captions': solid('--c-fg-subtle'),
            '--tw-prose-code': solid('--c-fg'),
            '--tw-prose-pre-code': solid('--c-fg'),
            '--tw-prose-pre-bg': solid('--c-surface-variant'),
            '--tw-prose-th-borders': 'var(--c-line)',
            '--tw-prose-td-borders': 'var(--c-line-soft)',
            'h2, h3': { fontWeight: '800' },
            h2: { letterSpacing: '-0.6px' },
            h3: { letterSpacing: '-0.3px' },
          },
        },
      },
    },
  },
  // privacy.html, terms.html and deletion.html render their long-form text
  // with `prose` classes; they loaded the CDN as `?plugins=typography` for
  // exactly this. Without the plugin here, the built CSS drops every prose
  // rule and those pages lose all their body styling.
  plugins: [require('@tailwindcss/typography')],
};
