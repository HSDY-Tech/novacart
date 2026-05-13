import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/ai/**/*.{ts,tsx}"
  ],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        primary: { DEFAULT: "#0f172a", foreground: "#ffffff" },
        accent: { DEFAULT: "#6366f1", foreground: "#ffffff" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" }
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-clash)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 2px 20px -4px rgb(0 0 0 / 0.12)",
        card: "0 4px 32px -8px rgb(0 0 0 / 0.16)",
        glow: "0 8px 32px -8px rgb(99 102 241 / 0.5)"
      },
      borderRadius: { "4xl": "2rem", "5xl": "2.5rem" },
      keyframes: {
        fadeUp: { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        pulse2: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".4" } }
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "pulse2": "pulse2 1.5s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
export default config;
