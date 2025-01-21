/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#4F46E5',
          600: '#4338CA',
        },
        secondary: {
          500: '#6366F1',
          600: '#4F46E5',
        },
      },
    },
  },
  plugins: [],
} 