"use client";

import { Hero } from "@/components/Hero";
import { IconSprite } from "@/components/icons";
import { ProjectStage } from "@/components/ProjectStage";
import { translations } from "@/lib/data";
import { useLanguage } from "@/lib/LanguageContext";

/* 이후 작업에서 경력, 기술, 푸터, 인쇄용 블록을 붙인다 */
export default function Home() {
  const { lang } = useLanguage();
  const t = translations[lang];
  return (
    <main id="main">
      <IconSprite />
      <Hero t={t} lang={lang} />
      <ProjectStage t={t} lang={lang} />
    </main>
  );
}
