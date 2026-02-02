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
        "yellow-primary": "var(--yellow-primary)",
        "silver-fox": "var(--silver-fox)",
        "deep-matte-grey": "var(--deep-matte-grey)",
        "dark-slate": "var(--dark-slate)",
        "blue-popsicle": "var(--blue-popsicle)",
        redline: "var(--redline)",
        "purple-shadow": "var(--purple-shadow)",
        "grey-blue-leaf": "var(--grey-blue-leaf)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
