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
          light: '#E5D0FF', /* Lighter soft purple */
          dark: '#3E2479', /* Deep logo purple */
          surface: '#D1A3FF', /* The requested soft purple theme */
          text: '#2D2B33',
          accent: '#A855F7', /* Neon purple */
          beige: '#FAF9F6',
          primary: '#9333EA' /* Vibrant purple from logo */
        }
      },
      fontFamily: {
        sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'system-ui', 'sans-serif'],
        serif: ['Poppins', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
