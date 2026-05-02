/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          yellow: '#FFFF00',
        },
        dark: {
          bg: '#000000',
          card: '#1a1a1a',
          border: '#333333',
          text: '#ffffff',
          muted: '#666666',
        }
      },
      fontFamily: {
        heading: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
