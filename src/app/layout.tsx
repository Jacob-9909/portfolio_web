import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

const TITLE = "정우혁 (Jacob)";
const DESCRIPTION =
  "디딤 AI Engineer 정우혁입니다. 은행 폐쇄망과 공장에서 Text-to-SQL 에이전트를 만들어 왔습니다.";

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
  themeColor: "#08090a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="break-keep bg-t-bg font-sans text-t-text antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
