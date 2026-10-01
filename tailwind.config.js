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
 */
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
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        brand: {
          50: '#fdf4ff',
          100: '#fae8ff',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.7s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  // privacy.html and terms.html render their long-form text with `prose`
  // classes; they loaded the CDN as `?plugins=typography` for exactly this.
  // Without the plugin here, the built CSS drops every prose rule and both
  // pages lose all their body styling.
  plugins: [require('@tailwindcss/typography')],
};
