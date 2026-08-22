import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jacob | AI Engineer & Agent Architect",
  description:
    "Portfolio of Woohyuck Jeong (Jacob) — AI Engineer at Didim specializing in Multi-Agent Systems, RAG, and LLM Applications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${jetbrainsMono.variable} h-full`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/* 첫 페인트 전 테마 적용 (플래시 방지). 기본값은 다크 — 사이트 정체성 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.theme==="light")document.documentElement.classList.add("light")}catch(e){}`,
          }}
        />
      </head>
      <body className="h-full bg-t-bg text-t-text font-sans antialiased overflow-hidden">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
