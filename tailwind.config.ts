import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',   // 👈 VERY IMPORTANT
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map indigo to a warm amber/gold palette for friendlier accents
        indigo: colors.amber,
        // Map gray to a sleeker zinc surface tone
        gray: colors.zinc,
      },
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}