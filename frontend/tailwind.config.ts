import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        bg: "#0a0a0f",
        surface: "#111118",
        border: "#1e1e2e",
        accent: "#00ff88",
        "accent-dim": "#00cc6a",
        muted: "#4a4a6a",
        text: "#e2e2f0",
        "text-dim": "#8888aa",
        danger: "#ff4466",
        warning: "#ffaa00",
        info: "#4488ff",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
        "pulse-accent": "pulseAccent 2s ease-in-out infinite",
        scan: "scan 2s linear infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        pulseAccent: { "0%,100%": { boxShadow: "0 0 0 0 rgba(0,255,136,0.3)" }, "50%": { boxShadow: "0 0 0 8px rgba(0,255,136,0)" } },
        scan: { from: { transform: "translateY(-100%)" }, to: { transform: "translateY(400%)" } },
      },
    },
  },
  plugins: [],
};

export default config;