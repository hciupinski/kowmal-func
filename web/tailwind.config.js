/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add ts and tsx files
  ],
  theme: {
    extend: {
      backgroundImage: {
        'main-page': "url('/public/images/background.png')"
      },
      fontFamily: {
        agdasima: ['Agdasima', 'sans-serif'],
        pirata: ['Pirata One', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.7s ease-in-out forwards',
      },
    },
  },
  plugins: [],
}