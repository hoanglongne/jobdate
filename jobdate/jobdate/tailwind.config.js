const { link } = require('fs');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FBDFFF",
        foreground: "#FFF3EA",
        btn: {
          background: "hsl(var(--btn-background))",
          1: "#F8D6B4"
        },
        card: "#47475B",
      },
      fontFamily: {
        kanit: ['var(--kanit-font)', "sans-serif"],
        bebasNeue: ['var(--bebas-neue-font)', "sans-serif"],
        lilitaOne: ['var(--lilita-one-font)', "sans-serif"],
      }
    },
  },
  plugins: [],
};
