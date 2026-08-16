import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core identity: deep field-green + turmeric marigold accent + soil brown.
        field: {
          50: "#f1f6ee",
          100: "#e0ecd9",
          200: "#c1d9b5",
          300: "#9cc088",
          400: "#74a35f",
          500: "#4f8340",
          600: "#3a6830",
          700: "#2d5227",
          800: "#25411f",
          900: "#1e341a",
          950: "#0f1c0d",
        },
        turmeric: {
          50: "#fdf6e8",
          100: "#faebc4",
          200: "#f4d488",
          300: "#edb94f",
          400: "#e8a33d",
          500: "#dc8c22",
          600: "#b96c19",
          700: "#93511a",
          800: "#78421c",
          900: "#65381d",
        },
        soil: {
          50: "#f7f4f1",
          100: "#ece4dc",
          200: "#d8c5b3",
          300: "#bd9e82",
          400: "#a37c5f",
          500: "#8a6448",
          600: "#71503b",
          700: "#5a4030",
          800: "#3f2c22",
          900: "#2a1d17",
        },
        paper: "#f7f3e9",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "field-lines": "repeating-linear-gradient(115deg, rgba(45,82,39,0.05) 0px, rgba(45,82,39,0.05) 2px, transparent 2px, transparent 14px)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(30,52,26,0.06), 0 6px 20px -8px rgba(30,52,26,0.18)",
      },
    },
  },
  plugins: [],
};
export default config;
