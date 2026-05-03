/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-main)",
        panel: "var(--bg-panel)",
        "text-main": "var(--text-primary)",
        "text-muted": "var(--text-secondary)",
        "border-color": "var(--border-subtle)",
        "bg-hover": "var(--bg-hover)",
        card: "var(--bg-card)",
      }
    },
  },
  plugins: [],
};
