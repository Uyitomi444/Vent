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
          light: '#160432', /* Deepest midnight indigo-purple */
          dark: '#E5D0FF',  /* Soft light lavender for pills/buttons */
          surface: '#160432', /* Main canvas background */
          card: '#220A50', /* Rich indigo-purple card background from uploaded palette */
          header: '#1A053C', /* Dark header background */
          text: '#F5EEFF',
          accent: '#7C3AED', /* Electric violet accent */
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
