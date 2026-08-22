"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/data";
import Reveal from "@/components/motion/Reveal";

export default function CareerTimeline() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const { CAREER, EDUCATION } = t;

  return (
    <section id="career" className="px-6 md:px-12 lg:px-20 py-16">
      <div className="max-w-4xl">
        <div className="section-divider mb-10">{t.SECTIONS.career}</div>

        {/* Work Experience — 2열 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
          {CAREER.map((item, i) => (
            <Reveal key={item.company} delay={i * 0.08}>
            <article
              className={`card-surface p-5 relative ${
                item.active ? "border-t-amber/40" : ""
              }`}
            >
              {item.active && (
                <div className="absolute left-0 top-5 bottom-5 w-[2px] bg-t-amber/70" />
              )}

              <div className="flex items-center justify-between gap-2">
                <h4 className="text-t-text font-semibold text-base">
                  {item.company}
                  {item.active && (
                    <span className="font-mono text-[10px] text-t-amber ml-2 align-middle">
                      [current]
                    </span>
                  )}
                </h4>
                <span className="font-mono text-t-muted text-xs shrink-0">
                  {item.period}
                </span>
              </div>

              <p className="text-t-text/80 text-sm mt-1">{item.role}</p>
              <p className="text-t-muted text-xs mt-0.5">{item.description}</p>

              <ul className="space-y-1.5 mt-4">
                {item.tasks.map((task, j) => (
                  <li
                    key={j}
                    className="text-t-text/80 text-xs leading-relaxed flex items-start gap-2"
                  >
                    <span className="font-mono text-t-muted/70 mt-0.5 shrink-0 select-none">
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    {task}
                  </li>
                ))}
              </ul>

              <p className="font-mono text-[11px] text-t-muted leading-relaxed mt-4 pt-3 border-t border-t-border/50">
                {item.stack.join(" / ")}
              </p>
            </article>
            </Reveal>
          ))}
        </div>

        {/* Education — 컴팩트 박스 */}
        <h3 className="text-t-muted text-xs uppercase tracking-widest mt-12 mb-4">
          {t.SECTIONS.education}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
          {EDUCATION.map((item) => (
            <div key={item.school} className="card-surface px-4 py-3.5">
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="text-t-text font-medium text-sm">{item.school}</h4>
                <span className="font-mono text-t-muted text-[11px] shrink-0">
                  {item.period}
                </span>
              </div>
              {item.major && (
                <p className="text-t-muted text-xs mt-1">{item.major}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
