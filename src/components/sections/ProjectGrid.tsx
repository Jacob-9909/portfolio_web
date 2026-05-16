"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/data";

export default function ProjectGrid() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const { PROJECTS } = t;

  return (
    <section id="projects" className="px-4 md:px-6 lg:px-8 py-16">
      <div className="section-divider mb-10">{t.SECTIONS.projects}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {PROJECTS.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (i % 4) * 0.08, duration: 0.35 }}
            className="card-surface p-5 flex flex-col"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="text-t-text font-semibold text-sm leading-snug">
                {project.title}
              </h4>
              {project.links && project.links.length > 0 && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {project.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-t-muted hover:text-t-amber transition-colors"
                      title={link.label}
                    >
                      <ExternalLink size={13} />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <p className="text-t-muted text-xs mb-2">
              {project.org}
              <span className="mx-1.5 text-t-dim">&middot;</span>
              <span className="font-mono">{project.period}</span>
            </p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.stack.map((s) => (
                <span key={s} className="tag-pill">
                  {s}
                </span>
              ))}
            </div>

            <p className="text-t-text/70 text-xs leading-relaxed mt-auto">
              {project.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
