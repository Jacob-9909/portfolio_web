"use client";

import { motion } from "framer-motion";
import { SKILLS, CERTIFICATIONS } from "@/lib/data";

export default function SkillsSection() {
  return (
    <section id="skills" className="px-4 md:px-6 lg:px-8 py-16">
      {/* ── Tech Stack ── */}
      <div className="section-divider mb-10">Tech Stack</div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="space-y-4 mb-16"
      >
        {SKILLS.map((group) => (
          <div key={group.category} className="flex items-center gap-0">
            {/* Category label with right-border accent */}
            <span className="w-28 shrink-0 text-right text-xs font-mono text-t-blue pr-4 border-r border-t-blue/30">
              {group.category}
            </span>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-2 pl-4">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="text-sm px-3 py-1 rounded border border-t-border bg-t-surface/80 text-t-text/90 font-mono leading-none"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Certifications ── */}
      <div className="section-divider mb-10">Certifications</div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-3"
      >
        {CERTIFICATIONS.map((cert, i) => (
          <div
            key={cert}
            className="card-surface px-5 py-5 flex flex-col gap-2"
          >
            <span className="text-t-muted text-xs font-mono">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-t-text text-sm font-medium leading-snug">
              {cert}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
