import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /* CSS 변수 기반 — globals.css의 :root(다크) / html.light(라이트)에서 전환.
           <alpha-value> 지원을 위해 RGB 트리플렛 형식 유지 */
        t: {
          bg: "rgb(var(--t-bg) / <alpha-value>)",
          surface: "rgb(var(--t-surface) / <alpha-value>)",
          border: "rgb(var(--t-border) / <alpha-value>)",
          amber: "rgb(var(--t-amber) / <alpha-value>)",
          blue: "rgb(var(--t-blue) / <alpha-value>)",
          green: "rgb(var(--t-green) / <alpha-value>)",
          red: "rgb(var(--t-red) / <alpha-value>)",
          text: "rgb(var(--t-text) / <alpha-value>)",
          muted: "rgb(var(--t-muted) / <alpha-value>)",
          dim: "rgb(var(--t-dim) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "JetBrains Mono",
          "Fira Code",
          "ui-monospace",
          "monospace",
        ],
      },
      animation: {
        "cursor-blink": "blink 1s step-end infinite",
        marquee: "marquee 40s linear infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
