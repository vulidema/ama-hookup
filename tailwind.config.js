/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf8f6",
          100: "#f5e6e0",
          200: "#e8c4b5",
          300: "#dba28a",
          400: "#ce805f",
          500: "#c15e34",
          600: "#a84b28",
          700: "#8f3d21",
          800: "#762f1a",
          900: "#5d2413",
        },
        secondary: {
          50: "#fffbf0",
          100: "#fef3da",
          200: "#fce4ad",
          300: "#fad580",
          400: "#f7c650",
          500: "#f5b720",
          600: "#d89b1a",
          700: "#bb7f14",
          800: "#9e6510",
          900: "#814b0c",
        },
        clay: {
          50: "#faf7f3",
          100: "#f0e8e1",
          200: "#dcc9ba",
          300: "#c7aa93",
          400: "#b38b6c",
          500: "#9f6c45",
          600: "#8b5a38",
          700: "#77482b",
          800: "#63361e",
          900: "#4f2411",
        },
      },
      backgroundColor: {
        cream: "#fffaf6",
      },
      borderRadius: {
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        "soft-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
}
