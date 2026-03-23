// Mobile-first Tailwind theme powered by the existing design tokens.
// We import tokens from the mobile app to keep UI consistent.
const tokens = require('../App/constants/tokens.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}', '../App/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        ...tokens.palette,
        semantic: tokens.semantic,
      },
      spacing: Object.fromEntries(
        Object.entries(tokens.spacing)
          .filter(([k, v]) => typeof v === 'number' && /^\d+$/.test(k))
          .map(([k, v]) => [k, `${v}px`])
      ),
      borderRadius: {
        ...Object.fromEntries(Object.entries(tokens.borderRadius).map(([k, v]) => [k, `${v}px`])),
      },
      fontSize: Object.fromEntries(Object.entries(tokens.fontSize).map(([k, v]) => [k, `${v}px`])),
      boxShadow: {
        // Approximations for web (RN shadow tokens aren't directly usable)
        sm: '0 1px 2px rgba(0,0,0,0.06)',
        md: '0 6px 12px rgba(0,0,0,0.10)',
        lg: '0 14px 30px rgba(0,0,0,0.14)',
        primary: `0 10px 24px ${tokens.semantic.light.primary}33`,
      },
    },
  },
  plugins: [],
};

