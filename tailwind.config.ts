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
        background: "#FFF9E6",
        card: "#FFF3C4",
        primary: "#F6C453",
        accent: "#D4A017",
        secondary: "#F0E6C8",
        foreground: "#2C2C2C",
        "dark-accent": "#1F1F1F",
        success: "#7DAA68",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "float-slow": "float 5s ease-in-out infinite",
        twinkle: "twinkle 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "bounce-gentle": "bounceGentle 2s ease-in-out infinite",
        "heart-beat": "heartBeat 1.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.3", transform: "scale(0.7)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        heartBeat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
        },
      },
      boxShadow: {
        soft: "0 4px 24px rgba(212, 160, 23, 0.18)",
        "soft-lg": "0 8px 40px rgba(212, 160, 23, 0.22)",
        card: "0 2px 16px rgba(44, 44, 44, 0.07)",
        "card-hover": "0 8px 32px rgba(44, 44, 44, 0.12)",
        golden: "0 0 20px rgba(246, 196, 83, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
