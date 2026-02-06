import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#3b82f6", // electric blue
          dark: "#1d4ed8",
        },
        secondary: {
          DEFAULT: "#8b5cf6", // purple
          dark: "#6d28d9",
        },
        accent: {
          DEFAULT: "#06b6d4", // cyan
          dark: "#0891b2",
        },
        card: {
          DEFAULT: "#1e293b", // charcoal/navy
          hover: "#334155",
        }
      },
    },
  },
  plugins: [],
};
export default config;
