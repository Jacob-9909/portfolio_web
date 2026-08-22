"use client";

import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { translations, type ProjectItem } from "@/lib/data";
import Reveal from "@/components/motion/Reveal";

export default function ProjectGrid() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [featured, ...rest] = t.PROJECTS;

  return (
    <section id="projects" className="px-6 md:px-12 lg:px-20 py-16">
      <div className="max-w-4xl">
        <div className="section-divider mb-10">{t.SECTIONS.projects}</div>

        {/* Featured — 대표 프로젝트 */}
        <FeaturedCard project={featured} />

        {/* 나머지 — 2열 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
          {rest.map((project, i) => (
            <Reveal key={project.title} delay={(i % 2) * 0.06} className="h-full">
              <ProjectCard project={project} index={i + 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectLinks({ project }: { project: ProjectItem }) {
  if (!project.links || project.links.length === 0) return null;
  return (
    <div className="flex items-center gap-2 shrink-0">
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
  );
}

function Meta({ project }: { project: ProjectItem }) {
  return (
    <p className="font-mono text-[11px] text-t-muted mt-1">
      {project.org}
      <span className="mx-1.5 text-t-dim">&middot;</span>
      {project.period}
    </p>
  );
}

function StatusBadge({ status }: { status?: "running" | "complete" }) {
  if (status === "running") {
    return (
      <span className="font-mono text-[10px] text-t-amber shrink-0 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-t-amber animate-pulse" />
        running
      </span>
    );
  }
  return (
    <span className="font-mono text-[10px] text-t-green/80 shrink-0">
      ✓ complete
    </span>
  );
}

function Pipeline({ nodes }: { nodes: string[] }) {
  return (
    <div className="flex items-center gap-1.5 mt-5 overflow-x-auto pb-1">
      {nodes.map((node, i) => (
        <span key={i} className="flex items-center gap-1.5 shrink-0">
          <span
            className={`font-mono text-[11px] px-2 py-1 rounded border ${
              i % 2 === 0
                ? "bg-t-bg border-t-border text-t-muted"
                : "border-t-amber/40 text-t-amber bg-t-amber/5"
            }`}
          >
            {node}
          </span>
          {i < nodes.length - 1 && (
            <span className="font-mono text-[10px] text-t-dim select-none">-&gt;</span>
          )}
        </span>
      ))}
    </div>
  );
}

function FeaturedCard({ project }: { project: ProjectItem }) {
  return (
    <article className="card-surface relative p-6 md:p-8">
      <div className="absolute left-0 top-6 bottom-6 w-[2px] bg-t-amber/70" />

      <div className="flex items-start justify-between gap-3">
        <h3 className="text-t-text font-semibold text-lg md:text-xl leading-snug">
          {project.title}
        </h3>
        <div className="flex items-center gap-3 pt-1">
          <StatusBadge status={project.status} />
          <ProjectLinks project={project} />
        </div>
      </div>

      <Meta project={project} />

      {project.pipeline && <Pipeline nodes={project.pipeline} />}

      <p className="text-t-text/80 text-sm leading-relaxed mt-4">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mt-5">
        {project.stack.map((s) => (
          <span key={s} className="tag-pill">
            {s}
          </span>
        ))}
      </div>
    </article>
  );
}

function ProjectCard({ project, index }: { project: ProjectItem; index: number }) {
  return (
    <article className="card-surface p-5 flex flex-col group h-full">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-t-text/90 text-sm font-medium leading-snug min-w-0">
          <span className="font-mono text-xs text-t-muted/70 mr-2 select-none">
            {String(index).padStart(2, "0")}
          </span>
          {project.title}
        </h4>
        <div className="flex items-center gap-2 pt-0.5 shrink-0">
          <StatusBadge status={project.status} />
          <ProjectLinks project={project} />
        </div>
      </div>

      <Meta project={project} />

      <p className="text-t-muted text-xs leading-relaxed mt-3 line-clamp-3">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-x-2 gap-y-1 mt-auto pt-3">
        {project.stack.map((s, si) => (
          <span key={s} className="font-mono text-[11px] text-t-muted/80">
            {si > 0 && <span className="mr-2 text-t-dim">/</span>}
            {s}
          </span>
        ))}
      </div>
    </article>
  );
}
