"use client";

import { motion } from "framer-motion";
import { CAREER, EDUCATION } from "@/lib/data";

export default function CareerTimeline() {
  return (
    <section id="career" className="px-6 md:px-12 lg:px-20 py-16">
      <div className="section-divider mb-10">Career</div>

      {/* Work Experience */}
      <div className="max-w-3xl">
        <h3 className="text-t-muted text-xs uppercase tracking-widest mb-6">
          Work Experience
        </h3>
        <div className="relative border-l border-t-border pl-6 space-y-10">
          {CAREER.map((item, i) => (
            <motion.div
              key={item.company}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div
                className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 ${
                  item.active
                    ? "bg-t-amber border-t-amber"
                    : "bg-t-bg border-t-muted"
                }`}
              />

              <div className="card-surface p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <h4 className="text-t-text font-semibold text-base">
                    {item.company}
                  </h4>
                  <span className="text-t-muted text-xs font-mono">
                    {item.period}
                  </span>
                </div>

                <p className="text-t-blue text-sm mb-1">{item.role}</p>
                <p className="text-t-muted text-xs mb-3">{item.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {item.stack.map((s) => (
                    <span key={s} className="tag-pill">
                      {s}
                    </span>
                  ))}
                </div>

                <ul className="space-y-1">
                  {item.tasks.map((task, j) => (
                    <li
                      key={j}
                      className="text-t-text/80 text-sm flex items-start gap-2"
                    >
                      <span className="text-t-amber mt-0.5 shrink-0">
                        &bull;
                      </span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Education */}
        <h3 className="text-t-muted text-xs uppercase tracking-widest mt-12 mb-6">
          Education
        </h3>
        <div className="relative border-l border-t-border pl-6 space-y-6">
          {EDUCATION.map((item, i) => (
            <motion.div
              key={item.school}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="relative"
            >
              <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 bg-t-bg border-t-muted" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                  <h4 className="text-t-text font-medium text-sm">
                    {item.school}
                  </h4>
                  {item.major && (
                    <p className="text-t-muted text-xs">{item.major}</p>
                  )}
                </div>
                <span className="text-t-muted text-xs font-mono">
                  {item.period}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
