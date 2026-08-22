"use client";

import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/data";
import Reveal from "@/components/motion/Reveal";

export default function SideProjects() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const { SIDE_PROJECTS } = t;

  return (
    <section id="side-projects" className="px-6 md:px-12 lg:px-20 py-16">
      <div className="max-w-4xl">
        <div className="section-divider mb-10">{t.SECTIONS.sideProjects}</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SIDE_PROJECTS.map((project, i) => (
            <Reveal key={project.title} delay={(i % 2) * 0.06}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-surface p-4 flex items-start justify-between gap-3 group h-full"
              >
                <span className="flex flex-col gap-1 min-w-0">
                  <span className="text-t-text/90 text-sm leading-snug group-hover:text-t-amber transition-colors">
                    <span className="font-mono text-xs text-t-muted/70 mr-2 select-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {project.title}
                  </span>
                  <span className="font-mono text-[11px] text-t-muted leading-relaxed line-clamp-2">
                    {project.note}
                  </span>
                </span>
                <ExternalLink
                  size={13}
                  className="text-t-muted shrink-0 mt-1 group-hover:text-t-amber transition-colors"
                />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
