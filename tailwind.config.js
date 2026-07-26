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
          light: '#3E2479', /* Swapped: Was light, now deep purple */
          dark: '#E5D0FF', /* Swapped: Was dark, now soft light purple */
          surface: '#18082D', /* Swapped: Deep dark background canvas */
          text: '#F5EEFF', /* Swapped: Light crisp text */
          accent: '#A855F7',
          beige: '#2B124C',
          primary: '#C084FC' /* Vibrant light violet */
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
