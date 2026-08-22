"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/data";
import Reveal from "@/components/motion/Reveal";

export default function SkillsSection() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const { SKILLS, CERTIFICATIONS } = t;

  return (
    <section id="skills" className="px-6 md:px-12 lg:px-20 py-16">
      <div className="max-w-4xl">
        {/* ── Tech Stack — 2열 카테고리 박스 ── */}
        <div className="section-divider mb-10">{t.SECTIONS.skills}</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-14">
          {SKILLS.map((group, i) => (
            <Reveal key={group.category} delay={(i % 2) * 0.06}>
              <div className="card-surface p-4 h-full">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-xs text-t-text font-medium">
                    {group.category}
                  </span>
                  <span className="font-mono text-[10px] text-t-muted/60 select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {group.items.map((item) => (
                    <span key={item} className="tag-pill">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── Certifications ── */}
        <div className="section-divider mb-6">{t.SECTIONS.certifications}</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 max-w-xl">
          {CERTIFICATIONS.map((cert, i) => (
            <div
              key={cert}
              className="flex items-baseline gap-3 py-2.5 border-b border-t-border/50"
            >
              <span className="font-mono text-xs text-t-muted/70 select-none shrink-0 w-5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-t-text/90 text-sm">{cert}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
