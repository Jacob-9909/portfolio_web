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
          band: token("band"),
          card: token("card"),
          raise: token("raise"),
          text: token("text"),
          body: token("body"),
          muted: token("muted"),
          dim: token("dim"),
          line: token("line"),
          edge: token("edge"),
          hi: token("hi"),
        },
        /* 다이어그램과 카드의 역할 색 */
        role: {
          human: "rgb(var(--r-human) / <alpha-value>)",
          agent: "rgb(var(--r-agent) / <alpha-value>)",
          guard: "rgb(var(--r-guard) / <alpha-value>)",
          out: "rgb(var(--r-out) / <alpha-value>)",
          res: "rgb(var(--r-res) / <alpha-value>)",
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
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
