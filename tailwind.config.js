/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        black: "#11243E",
        primary: "#6142D4",
        secondary: "#F3ECFF",
        tertiary: "#F6F4FF",
        accent: "#13ABBA",
        zinc: "#18181B",
        highlight: "#FAFAFA",
        "hover-zinc": "#2F2F31",
        "accent-hover": "#008491",
        "chat-bg-gray": "#D9D9D9",
        "msg-gray": "#9B9B9B",
        "msg-header-gray": "#8F8F8F",
        "msg-purple": "#E0DDFC",
        "onboarding-yellow-bg": "#F6EFDE",
        ivory: "#FCFAF6",
      },
    },

  },
  plugins: [require("tailwindcss-animate"),require("@tailwindcss/typography"), require("@tailwindcss/forms")],
}