import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        sm: "2rem",
        lg: "3rem"
      },
      screens: {
        "2xl": "1320px"
      }
    },
    extend: {
      colors: {
        obsidian: "var(--color-obsidian)",
        ember: "var(--color-ember)",
        sunset: "var(--color-sunset)",
        dusk: "var(--color-dusk)",
        smoke: "var(--color-smoke)",
        ash: "var(--color-ash)",
        bone: "var(--color-bone)",
        gold: "var(--color-gold)",
        navy: "#1B2A4A",
        "red-gang": "#9B1C1C",
        "olive-gang": "#3B4A2F"
      },
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        accent: ["var(--font-playfair)", "serif"],
        body: ["var(--font-dm-sans)", "sans-serif"]
      },
      boxShadow: {
        ember: "0 22px 55px rgba(196, 92, 26, 0.16), 0 0 0 1px rgba(212, 168, 83, 0.18)",
        gold: "0 18px 48px rgba(10, 10, 10, 0.4), 0 0 0 1px rgba(212, 168, 83, 0.14)"
      },
      backgroundImage: {
        "obsidian-fade": "linear-gradient(180deg, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0) 100%)",
        "ember-strike": "linear-gradient(90deg, rgba(196, 92, 26, 1) 0%, rgba(232, 131, 58, 0.65) 50%, rgba(10, 10, 10, 0) 100%)"
      },
      animation: {
        "swatch-pulse": "swatchPulse 0.2s ease-out"
      },
      keyframes: {
        swatchPulse: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.18)" },
          "100%": { transform: "scale(1)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
