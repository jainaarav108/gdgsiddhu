import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["var(--font-outfit)", "sans-serif"],
        sans: ["var(--font-outfit)", "sans-serif"],
      },
      colors: {
        stadium: {
          black: "#050810",
          dark: "#0a0f1e",
          navy: "#0d1530",
          blue: "#1a2744",
        },
        neon: {
          yellow: "#FFD700",
          gold: "#FFA500",
          cyan: "#00FFFF",
          green: "#39FF14",
          red: "#FF073A",
          purple: "#BF5FFF",
        },
        ipl: {
          primary: "#1a56db",
          accent: "#FFD700",
          success: "#10b981",
          danger: "#ef4444",
          warning: "#f59e0b",
          muted: "#6b7280",
        },
      },
      backgroundImage: {
        "stadium-gradient":
          "radial-gradient(ellipse at center top, #1a2744 0%, #0a0f1e 40%, #050810 100%)",
        "neon-glow":
          "radial-gradient(ellipse at center, rgba(255,215,0,0.15) 0%, transparent 70%)",
        "card-glass":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        "hero-gradient":
          "linear-gradient(180deg, #0d1530 0%, #050810 100%)",
      },
      boxShadow: {
        "neon-yellow": "0 0 20px rgba(255,215,0,0.5), 0 0 60px rgba(255,215,0,0.2)",
        "neon-red": "0 0 20px rgba(255,7,58,0.5), 0 0 60px rgba(255,7,58,0.2)",
        "neon-green": "0 0 20px rgba(57,255,20,0.5), 0 0 60px rgba(57,255,20,0.2)",
        "neon-blue": "0 0 20px rgba(26,86,219,0.6), 0 0 40px rgba(26,86,219,0.3)",
        "card-glow": "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
        "avatar-glow": "0 0 60px rgba(255,215,0,0.3), 0 20px 60px rgba(0,0,0,0.8)",
      },
      keyframes: {
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255,215,0,0.3)" },
          "50%": { boxShadow: "0 0 50px rgba(255,215,0,0.8), 0 0 100px rgba(255,215,0,0.3)" },
        },
        "stadium-light": {
          "0%": { opacity: "0.3" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0.3" },
        },
        "ball-bounce": {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "40%": { transform: "translateY(-20px) scale(0.9)" },
          "60%": { transform: "translateY(-15px) scale(1.1)" },
        },
        "slide-in-up": {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "confetti-fall": {
          "0%": { transform: "translateY(-10px) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
        "typewriter": {
          "from": { width: "0" },
          "to": { width: "100%" },
        },
        "neon-flicker": {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: "0.4" },
        },
        "scale-in": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "80%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-8px)" },
          "40%, 80%": { transform: "translateX(8px)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "stadium-light": "stadium-light 4s ease-in-out infinite",
        "ball-bounce": "ball-bounce 0.6s ease-in-out",
        "slide-in-up": "slide-in-up 0.5s ease-out",
        wiggle: "wiggle 0.5s ease-in-out infinite",
        "confetti-fall": "confetti-fall 3s linear forwards",
        "neon-flicker": "neon-flicker 3s linear infinite",
        "scale-in": "scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        shake: "shake 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
