const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './renderer/pages/**/*.{js,ts,jsx,tsx}',
    './renderer/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'mobile': '768px',
      'mini': '400px',
    },
    extend: {},
  },
  plugins: [],
}
