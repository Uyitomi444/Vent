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
          light: '#3E2479',
          dark: '#E5D0FF',
          surface: '#18082D',
          text: '#F5EEFF',
          accent: '#A855F7',
          beige: '#2B124C',
          primary: '#C084FC'
        }
      },
      fontFamily: {
        sans: ['Paperlogy', 'Poppins', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        serif: ['Paperlogy', 'Poppins', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
