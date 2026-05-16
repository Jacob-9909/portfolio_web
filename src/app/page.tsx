"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import SectionNav from "@/components/nav/SectionNav";
import AmbientBackground from "@/components/hero/AmbientBackground";
import BootingHero from "@/components/hero/BootingHero";
import CareerTimeline from "@/components/sections/CareerTimeline";
import ProjectGrid from "@/components/sections/ProjectGrid";
import SkillsSection from "@/components/sections/SkillsSection";
import SideProjects from "@/components/sections/SideProjects";
import ContactSection from "@/components/sections/ContactSection";
import CommandBar from "@/components/terminal/CommandBar";
import SidebarPanel from "@/components/sidebar/SidebarPanel";
import LanguageToggle from "@/components/LanguageToggle";
import { processCommand } from "@/lib/commands";

interface TerminalEntry {
  id: string;
  command: string;
  output: string;
  isError?: boolean;
}

const SECTION_IDS = [
  "home",
  "career",
  "projects",
  "skills",
  "side-projects",
  "contact",
];

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [showOutput, setShowOutput] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleBootComplete = useCallback(() => {
    setBootComplete(true);
  }, []);

  // IntersectionObserver — root is the scrollable main pane
  useEffect(() => {
    if (!bootComplete) return;

    // Small delay so section elements are in the DOM after boot transition
    const timeout = setTimeout(() => {
      const root = mainRef.current;
      if (!root) return;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          }
        },
        { root, rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );

      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });

      return () => observer.disconnect();
    }, 150);

    return () => clearTimeout(timeout);
  }, [bootComplete]);

  const handleCommand = useCallback((command: string) => {
    const cmd = command.trim().toLowerCase();

    if (cmd === "clear") {
      setEntries([]);
      setShowOutput(false);
      return;
    }

    const result = processCommand(command);
    setEntries((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        command,
        output: result.output,
        isError: result.isError,
      },
    ]);
    setShowOutput(true);
  }, []);

  // 새 커맨드 실행 시 출력 패널 맨 아래로 스크롤
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-t-bg">
      <AmbientBackground />

      {/* Sticky nav — appears after boot */}
      {bootComplete && (
        <>
          <LanguageToggle />
          <SectionNav activeSection={activeSection} scrollRoot={mainRef} />
        </>
      )}

      {/* Content area: left scroll + right sidebar */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Left: main scrollable pane */}
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          <BootingHero onComplete={handleBootComplete} />

          {bootComplete && (
            <>
              <CareerTimeline />
              <ProjectGrid />
              <SkillsSection />
              <SideProjects />
              <ContactSection />
            </>
          )}
        </main>

        {/* Right: sticky sidebar (lg+) */}
        {bootComplete && (
          <aside className="hidden lg:flex flex-col w-80 border-l border-t-border overflow-y-auto shrink-0 bg-t-surface/30">
            <SidebarPanel activeSection={activeSection} />
          </aside>
        )}
      </div>

      {/* Terminal output panel */}
      {showOutput && entries.length > 0 && (
        <div ref={outputRef} className="relative z-50 max-h-[40vh] overflow-y-auto bg-t-bg/95 backdrop-blur-sm border-t border-t-border px-4 md:px-8 py-3 space-y-3 shrink-0">
          {entries.map((entry) => (
            <div key={entry.id}>
              <div className="text-xs font-mono">
                <span className="text-t-amber">jacob@portfolio</span>
                <span className="text-t-blue">:</span>
                <span className="text-t-blue">~</span>
                <span className="text-t-text">$ </span>
                <span className="text-t-text">{entry.command}</span>
              </div>
              <pre
                className={`text-xs mt-1 whitespace-pre-wrap font-mono ${
                  entry.isError ? "text-t-red" : "text-t-text/80"
                }`}
              >
                {entry.output}
              </pre>
            </div>
          ))}
          <button
            onClick={() => {
              setEntries([]);
              setShowOutput(false);
            }}
            className="text-[10px] text-t-muted hover:text-t-amber transition-colors"
          >
            [clear]
          </button>
        </div>
      )}

      {/* Command bar */}
      <div className="relative z-50 shrink-0">
        <CommandBar onCommand={handleCommand} />
      </div>
    </div>
  );
}
