import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

const TITLE = "정우혁 (Jacob)";
const DESCRIPTION =
  "디딤 AI Engineer 정우혁입니다. 금융과 제조 현업이 직접 쓰는 Text-to-SQL, RAG 에이전트를 만듭니다.";

export const metadata: Metadata = {
  // GitHub Pages 주소. 링크를 공유했을 때 미리보기에 쓰인다
  metadataBase: new URL("https://jacob-9909.github.io"),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/portfolio_web/" },
  openGraph: {
    type: "profile",
    url: "/portfolio_web/",
    title: TITLE,
    description: DESCRIPTION,
    locale: "ko_KR",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#16171a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/* 첫 페인트 전 테마 적용 (플래시 방지). 저장값이 없으면 시스템 설정을 따른다 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.theme;if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className="break-keep bg-t-bg font-sans text-t-text antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
