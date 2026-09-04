/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.handlebars"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0f766e", // base primary
          700: "#0d635c", // hover
          800: "#0b4f4a", // dark primary
          900: "#083330",
          950: "#04201e",
        },
        secondary: {
          50: "#f0fdf9",
          100: "#ccfbf0",
          200: "#99f6e0",
          300: "#5eeac5",
          400: "#2dd4a7",
          500: "#1f8f84",
          600: "#177269",
          700: "#125650",
          800: "#0e3f3b",
          900: "#0a2b28",
        },
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
        },
        dark: {
          DEFAULT: "#0f172a",
          surface: "#121e1d",
          elevated: "#182827",
          border: "rgba(15, 118, 110, 0.25)",
        },
      },
      fontFamily: {
        sans: ["'IBM Plex Sans'", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        heading: ["'Sora'", "'IBM Plex Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        'sm': '6px',
        DEFAULT: '8px',
        'lg': '14px',
        'xl': '18px',
        '2xl': '24px',
      },
      boxShadow: {
        'sm': '0 2px 4px rgba(0, 0, 0, 0.04)',
        DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'md': '0 10px 15px -3px rgba(15, 118, 110, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'lg': '0 20px 25px -5px rgba(15, 118, 110, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'dropdown': '0 12px 30px rgba(15, 42, 42, 0.14), 0 4px 10px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 25px rgba(15, 118, 110, 0.25)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
