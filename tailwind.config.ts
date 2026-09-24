import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#090a0f",
        surface: "#12141c",
        "surface-card": "#181b26",
        "surface-border": "#272c3d",
        jev: {
          light: "#c084fc",
          DEFAULT: "#8b5cf6",
          dark: "#6d28d9",
          glow: "rgba(139, 92, 246, 0.15)",
        },
        laya: {
          light: "#2dd4bf",
          DEFAULT: "#0d9488",
          dark: "#0f766e",
          glow: "rgba(13, 148, 136, 0.15)",
        },
        accent: {
          success: "#10b981",
          danger: "#f43f5e",
          warning: "#f59e0b",
        },
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "Menlo", "Monaco", "Consolas", "monospace"],
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
