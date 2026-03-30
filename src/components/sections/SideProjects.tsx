"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { SIDE_PROJECTS } from "@/lib/data";

export default function SideProjects() {
  return (
    <section id="side-projects" className="px-4 md:px-6 lg:px-8 py-16">
      <div className="section-divider mb-10">Side Projects</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
        {SIDE_PROJECTS.map((project, i) => (
          <motion.a
            key={project.title}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: (i % 3) * 0.06, duration: 0.3 }}
            className="card-surface p-4 flex items-start justify-between gap-2 group"
          >
            <span className="text-t-text/80 text-xs leading-relaxed group-hover:text-t-amber transition-colors">
              {project.title}
            </span>
            <ExternalLink
              size={12}
              className="text-t-muted shrink-0 mt-0.5 group-hover:text-t-amber transition-colors"
            />
          </motion.a>
        ))}
      </div>
    </section>
  );
}
