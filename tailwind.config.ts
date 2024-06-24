// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sofia: ['"Sofia Sans"', 'sans-serif'], // Adding Sofia Sans
        poppins: ['Poppins', 'sans-serif'], // Adding Poppins
      },
    },
  },
  plugins: [],
}
