/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/layout.tsx',
    './src/app/page.tsx',
    './src/app/**/page.tsx',
  ],
  theme: {
    extend: {
      colors: {
        'page-bg': '#f3f2ef',
        'text-primary': '#171717',
        'text-secondary': 'rgba(0, 0, 0, 0.7)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [],
}