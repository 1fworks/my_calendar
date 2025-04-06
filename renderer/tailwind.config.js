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
    extend: {
      animation: {
        "climb100-animation": "climb100-kf 300ms ease forwards",
      },
      keyframes: {
        "climb100-kf": {
          from: {
            transform: "translateY(-2.5rem);",
            opacity: "0%;",
          },
          to: {
            transform: "translateY(0);",
            opacity: "100%;",
          }
        },
      },
    },
  },
  plugins: [],
}
