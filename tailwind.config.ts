/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        deep: {
          space: "#0a0a0f",
          night: "#0f0f1a",
          void: "#050508",
        },
        star: {
          white: "#f8f8ff",
          glow: "#ffffff",
          dust: "#1a1a2e",
        },
        // Individual girl accent colors
        alyok: {
          primary: "#ff6b9d",
          secondary: "#c44569",
          neon: "#ff006e",
        },
        sabinina: {
          primary: "#00d9ff",
          secondary: "#0077b6",
          neon: "#00f5ff",
        },
        nazken: {
          primary: "#ffd700",
          secondary: "#b8860b",
          neon: "#ffec8b",
        },
        molya: {
          primary: "#a855f7",
          secondary: "#7c3aed",
          neon: "#d8b4fe",
        },
        zhansiko: {
          primary: "#dc2626",
          secondary: "#991b1b",
          neon: "#fca5a5",
        },
        oliyash: {
          primary: "#f472b6",
          secondary: "#ec4899",
          neon: "#fbcfe8",
        },
        ardashon: {
          primary: "#f59e0b",
          secondary: "#d97706",
          neon: "#fcd34d",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "Times", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "twinkle": "twinkle 3s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "spin-slow": "spin 12s linear infinite",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 255, 255, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};
