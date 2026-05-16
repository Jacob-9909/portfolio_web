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
    <html lang="ko" className={`${jetbrainsMono.variable} h-full`}>
      <body className="h-full bg-t-bg text-t-text font-mono antialiased overflow-hidden">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
