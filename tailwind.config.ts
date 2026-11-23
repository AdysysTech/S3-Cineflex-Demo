import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stage: "#040406",
        brand: {
          bg: "#09090C",
          surface1: "#121217",
          surface2: "#1A1A22",
          surfaceElevated: "#23232D",
          red: "#E1252C",
          redBright: "#FF5259",
          redDeep: "#9E1117",
          redDim: "rgba(225, 37, 44, 0.16)",
          emerald: "#38B884",
          emeraldBright: "#4ADE80",
          emeraldDim: "rgba(56, 184, 132, 0.14)",
          whatsapp: "#25D366",
          borderSubtle: "rgba(255, 255, 255, 0.10)",
          borderRed: "rgba(225, 37, 44, 0.48)",
          textPrimary: "#F7F5F5",
          textSecondary: "#B6B2B8",
          textMuted: "#827D85",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "Manrope", "sans-serif"],
        display: ["var(--font-manrope)", "Manrope", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        cinema: "0 20px 50px rgba(0, 0, 0, 0.75)",
        "red-glow": "0 0 25px rgba(225, 37, 44, 0.45)",
        "emerald-glow": "0 0 25px rgba(56, 184, 132, 0.40)",
      },
    },
  },
  plugins: [],
};

export default config;
