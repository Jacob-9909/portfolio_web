"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/data";

interface SectionNavProps {
  activeSection: string;
  scrollRoot: React.RefObject<HTMLElement | null>;
}

export default function SectionNav({
  activeSection,
  scrollRoot,
}: SectionNavProps) {
  const { lang } = useLanguage();
  const t = translations[lang];

  const TABS = [
    { id: "home", label: "~" },
    { id: "career", label: t.SECTIONS.career },
    { id: "projects", label: t.SECTIONS.projects },
    { id: "skills", label: t.SECTIONS.skills },
    { id: "side-projects", label: t.SECTIONS.sideProjects },
    { id: "contact", label: t.SECTIONS.contact },
  ] as const;
  const scrollTo = (id: string) => {
    const container = scrollRoot?.current;
    const el = document.getElementById(id);
    if (!container || !el) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const target = container.scrollTop + (elRect.top - containerRect.top);

    container.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-30 bg-t-bg/90 backdrop-blur-sm border-b border-t-border shrink-0">
      <div className="flex items-center overflow-x-auto scrollbar-none px-4 md:px-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => scrollTo(tab.id)}
            className={`relative shrink-0 px-4 py-2.5 text-xs font-mono transition-colors duration-150 ${
              activeSection === tab.id
                ? "text-t-amber"
                : "text-t-muted hover:text-t-text"
            }`}
          >
            {activeSection === tab.id && (
              <motion.span
                layoutId="nav-indicator"
                className="absolute left-3 right-3 bottom-0 h-[2px] bg-t-amber"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
