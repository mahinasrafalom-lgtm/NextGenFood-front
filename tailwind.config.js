/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: '#FBF9F6',
        brand: {
          light: '#FBF9F6',   // Page background
          section: '#FFF4EB', // Section alt background (light orange tint)
          primary: '#F9B37E', // Main brand accent (lighter orange)
          mid: '#F28522',     // The requested brand orange
          dark: '#B25D11',    // Darker shade for text
        },
      },
      fontFamily: {
        bengali: ['"Noto Sans Bengali"', 'sans-serif'],
        sans: ['Outfit', 'sans-serif'],
      },
      keyframes: {
        fadeSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        fadeSlideIn: 'fadeSlideIn 0.2s ease-out forwards',
      }
    },
  },
  plugins: [],
}
