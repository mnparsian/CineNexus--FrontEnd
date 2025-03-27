/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "movie-backdrop": "url('https://image.tmdb.org/t/p/w1280')"
      },
      fontFamily: {
        boldonse: ['"Boldonse Trial"', "sans-serif"]
      },
      colors: {
        background: "hsl(var(--color-bg) / <alpha-value>)",
        card: "hsl(var(--color-card) / <alpha-value>)",
        foreground: "hsl(var(--color-text) / <alpha-value>)",
        border: "hsl(var(--color-border) / <alpha-value>)",
        muted: "hsl(var(--color-muted) / <alpha-value>)",
        primary: "hsl(var(--color-primary) / <alpha-value>)"
      }
    }
  },
  plugins: [require("tailwind-scrollbar-hide")()]
};
