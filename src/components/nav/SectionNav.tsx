"use client";

interface SectionNavProps {
  activeSection: string;
  scrollRoot: React.RefObject<HTMLElement | null>;
}

const TABS = [
  { id: "home", label: "~" },
  { id: "career", label: "Career" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "side-projects", label: "Side Projects" },
  { id: "contact", label: "Contact" },
] as const;

export default function SectionNav({
  activeSection,
  scrollRoot,
}: SectionNavProps) {
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
            className={`shrink-0 px-4 py-2.5 text-xs font-mono transition-colors duration-150 border-b-2 ${
              activeSection === tab.id
                ? "border-t-amber text-t-amber"
                : "border-transparent text-t-muted hover:text-t-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
