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
          surface: '#1E0542', /* Deepest vibrant violet-purple canvas background */
          card: '#2E0B5E', /* Rich violet card container */
          header: '#23074D', /* Dark header background */
          primary: '#8A2BE2', /* Main vibrant grainy violet-purple theme color */
          accent: '#A855F7', /* Vibrant violet accent */
          pill: '#E5D0FF', /* Soft light purple pill/button background */
          textDark: '#1E0542', /* High-contrast text on light buttons */
          textLight: '#F5EEFF' /* Crisp text on dark cards */
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
