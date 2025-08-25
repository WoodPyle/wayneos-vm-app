/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wayneos: {
          primary: '#1a1a2e',
          secondary: '#0f4c75',
          accent: '#3282b8',
          terminal: '#0d1117',
        }
      }
    },
  },
  plugins: [],
}