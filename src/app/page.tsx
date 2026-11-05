"use client";

import { Hero } from "@/components/Hero";
import { translations } from "@/lib/data";
import { useLanguage } from "@/lib/LanguageContext";

/* 이후 작업에서 ProjectStage, 경력, 기술을 붙인다 */
export default function Home() {
  const { lang } = useLanguage();
  const t = translations[lang];
  return (
    <main id="main">
      <Hero t={t} lang={lang} />
    </main>
  );
}
