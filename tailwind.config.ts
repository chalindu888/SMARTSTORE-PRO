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
        // Map indigo to a premium violet/amethyst palette
        indigo: colors.violet,
        // Map gray to a sleeker zinc surface tone
        gray: colors.zinc,
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}