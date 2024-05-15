/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FDF0FF",
        foreground: "#FFF3EA",
        btn: {
          background: "hsl(var(--btn-backgrounds))",
          1: "#F8D6B4"
        },
        card: "#47475B",
        sidebar: "#272741",
        profile: "#6E8C77"
      },
      boxShadow: {
        profileBox: '2.5px 2.5px 0px 0px rgba(71, 71, 91, 1)',
      },
      fontFamily: {
        bebasNeue: ['var(--bebas-neue-font)', "sans-serif"],
        kanit: ['var(--kanit-font)', "sans-serif"],
        lilitaOne: ['var(--lilita-one-font)', "sans-serif"],
      }
    },
  },
  plugins: [],
};
