import type { Config } from "tailwindcss";

const token = (name: string) => `rgb(var(--t-${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /* 값은 globals.css 의 :root. 다크 한 벌만 쓴다 */
        t: {
          bg: token("bg"),
          panel: token("panel"),
          text: token("text"),
          body: token("body"),
          muted: token("muted"),
          dim: token("dim"),
          line: token("line"),
          hi: token("hi"),
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
        serif: ["Hahmlet", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
