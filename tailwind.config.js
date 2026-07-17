/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        itoura: {
          light: '#EBE5FC', /* Soft lilac background */
          dark: '#3E2479', /* Deep logo purple */
          surface: '#F8F6FC', /* Very light purple/white */
          text: '#2D2B33',
          accent: '#A855F7', /* Neon purple */
          beige: '#FAF9F6',
          primary: '#9333EA' /* Vibrant purple from logo */
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'system-ui', 'sans-serif'],
        serif: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
