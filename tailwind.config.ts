import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* CSS 변수 기반 — globals.css의 :root(라이트) / html.dark(다크)에서 전환 */
        t: {
          bg: "rgb(var(--t-bg) / <alpha-value>)",
          text: "rgb(var(--t-text) / <alpha-value>)",
          muted: "rgb(var(--t-muted) / <alpha-value>)",
          border: "rgb(var(--t-border) / <alpha-value>)",
          code: "rgb(var(--t-code) / <alpha-value>)",
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
      },
    },
  },
  plugins: [],
};

export default config;
