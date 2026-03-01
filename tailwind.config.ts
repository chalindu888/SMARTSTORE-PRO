/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',   // 👈 VERY IMPORTANT
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}