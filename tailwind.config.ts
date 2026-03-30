import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        t: {
          bg: "#1A1B26",
          surface: "#1F2335",
          border: "#3B4261",
          amber: "#D4976C",
          blue: "#7AA2F7",
          green: "#9ECE6A",
          red: "#F7768E",
          text: "#C0CAF5",
          muted: "#565F89",
          dim: "#3B4261",
        },
      },
      fontFamily: {
        mono: [
          "var(--font-mono)",
          "JetBrains Mono",
          "Fira Code",
          "monospace",
        ],
      },
      animation: {
        "cursor-blink": "blink 1s step-end infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
