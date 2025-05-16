/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brown: {
          DEFAULT: "var(--accent-brown)",
          light: "#a68776",
          dark: "#4a3b33",
        },
        gold: {
          DEFAULT: "var(--accent-gold)",
          light: "#d0c178",
          dark: "#8a7a3b",
        },
        beige: {
          DEFAULT: "var(--accent-beige)",
          light: "#f2eee6",
          dark: "#c7c0ac",
        },
      },
      fontFamily: {
        'tenor-sans': ['var(--font-tenor-sans)'],
        'barlow': ['var(--font-barlow)'],
      },
    },
  },
  plugins: [],
}; 