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
          surface: '#1E0542', /* Main grainy deep violet-purple canvas background */
          card: '#2E0B5E', /* Rich violet card container */
          header: '#23074D', /* Dark header background */
          primary: '#8A2BE2', /* Main theme color */
          accent: '#A855F7',
          pill: '#C8B6FF', /* Second shade of purple: Soft pastel lilac for pills/buttons */
          secondary: '#C8B6FF', /* Second shade of purple */
          textDark: '#1E0542', /* High contrast text on light lilac pills */
          textLight: '#F5EEFF'
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
