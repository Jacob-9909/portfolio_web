"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, BookOpen, FileDown, Code2 } from "lucide-react";
import { PROFILE } from "@/lib/data";

interface BootingHeroProps {
  onComplete?: () => void;
}

const INIT_CMD = "jacob --init";

const STATUS_LINES = [
  { text: "[2026.03] JACOB_AGENT_SYSTEM v2.0", type: "header" },
  { text: "[BOOT] Initializing modules...", type: "info" },
  { text: "[  OK  ] Python 3.13 \u00b7 LangGraph \u00b7 FastAPI", type: "ok" },
  { text: "[  OK  ] GCP Vertex AI \u00b7 Cloud Run", type: "ok" },
  { text: "[  OK  ] Multi-Agent System", type: "ok" },
  { text: "[  OK  ] RAG Engine: Online", type: "ok" },
  { text: "", type: "spacer" },
  { text: "[BOOT] All systems operational.", type: "success" },
] as const;

type StatusLine = (typeof STATUS_LINES)[number];

const READY_TEXT = "> READY";
type Phase = "init" | "status" | "ready" | "hero";

const lineClass: Record<string, string> = {
  header: "text-t-amber font-bold text-glow-amber",
  info: "text-t-text",
  ok: "text-t-green",
  success: "text-t-green font-bold text-glow-green",
  spacer: "h-2",
};

interface StatusState {
  completed: StatusLine[];
  lineIdx: number;
  charIdx: number;
  done: boolean;
}

export default function BootingHero({ onComplete }: BootingHeroProps) {
  const [phase, setPhase] = useState<Phase>("init");
  const [typedInit, setTypedInit] = useState("");
  const [typedReady, setTypedReady] = useState("");

  // Phase 2 — character-by-character per line
  const [ss, setSs] = useState<StatusState>({
    completed: [],
    lineIdx: 0,
    charIdx: 0,
    done: false,
  });

  // ── Phase 1: type "jacob --init" ──────────────────────────────
  useEffect(() => {
    if (phase !== "init") return;
    if (typedInit.length < INIT_CMD.length) {
      const t = setTimeout(
        () => setTypedInit(INIT_CMD.slice(0, typedInit.length + 1)),
        45 + Math.random() * 45
      );
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase("status"), 300);
    return () => clearTimeout(t);
  }, [phase, typedInit]);

  // ── Phase 2: type each STATUS_LINE character-by-character ─────
  useEffect(() => {
    if (phase !== "status") return;

    // All lines finished → move on
    if (ss.done) {
      const t = setTimeout(() => setPhase("ready"), 200);
      return () => clearTimeout(t);
    }

    const { lineIdx, charIdx, completed } = ss;

    // Safety: past last line
    if (lineIdx >= STATUS_LINES.length) {
      setSs((s) => ({ ...s, done: true }));
      return;
    }

    const line = STATUS_LINES[lineIdx];

    // Spacer / empty — appear instantly, jump to next line
    if (!line.text) {
      const t = setTimeout(() => {
        setSs((s) => ({
          ...s,
          completed: [...s.completed, line],
          lineIdx: s.lineIdx + 1,
          charIdx: 0,
        }));
      }, 30);
      return () => clearTimeout(t);
    }

    // Still typing this line
    if (charIdx < line.text.length) {
      const delay = 10 + Math.random() * 8; // ~10-18 ms per char
      const t = setTimeout(() => {
        setSs((s) => ({ ...s, charIdx: s.charIdx + 1 }));
      }, delay);
      return () => clearTimeout(t);
    }

    // Line fully typed — commit and move to next
    const pause = line.type === "success" ? 80 : 40;
    const t = setTimeout(() => {
      setSs((s) => ({
        ...s,
        completed: [...completed, line],
        lineIdx: lineIdx + 1,
        charIdx: 0,
      }));
    }, pause);
    return () => clearTimeout(t);
  }, [phase, ss]);

  // ── Phase 3: type "> READY" ───────────────────────────────────
  useEffect(() => {
    if (phase !== "ready") return;
    if (typedReady.length < READY_TEXT.length) {
      const t = setTimeout(
        () => setTypedReady(READY_TEXT.slice(0, typedReady.length + 1)),
        30 + Math.random() * 30
      );
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setPhase("hero");
      onComplete?.();
    }, 400);
    return () => clearTimeout(t);
  }, [phase, typedReady, onComplete]);

  // Current (in-progress) line text
  const currentLine =
    phase === "status" && !ss.done && ss.lineIdx < STATUS_LINES.length
      ? STATUS_LINES[ss.lineIdx]
      : null;
  const currentTyped = currentLine?.text.slice(0, ss.charIdx) ?? "";

  return (
    <section
      id="home"
      className="min-h-[85vh] flex flex-col justify-center px-6 md:px-12 lg:px-20 py-16 relative z-10"
    >
      <div className="text-sm leading-relaxed max-w-2xl">

        {/* $ jacob --init */}
        <div className="mb-1">
          <span className="text-t-muted">$ </span>
          <span className="text-t-amber">{typedInit}</span>
          {phase === "init" && <Cursor />}
        </div>

        {/* Status lines */}
        {phase !== "init" && (
          <div className="mb-1">
            {/* Completed lines */}
            {ss.completed.map((line, i) => (
              <div key={i} className={lineClass[line.type] ?? "text-t-text"}>
                {line.text}
              </div>
            ))}

            {/* Line currently being typed */}
            {currentLine && currentLine.text && (
              <div
                className={lineClass[currentLine.type] ?? "text-t-text"}
              >
                {currentTyped}
                <Cursor />
              </div>
            )}
          </div>
        )}

        {/* > READY */}
        {(phase === "ready" || phase === "hero") && (
          <div className="mb-4 mt-1">
            <span className="text-t-green font-bold text-glow-green">
              {typedReady}
            </span>
            {phase === "ready" && <Cursor />}
          </div>
        )}
      </div>

      {/* Profile card */}
      <AnimatePresence>
        {phase === "hero" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-8 max-w-2xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-t-text tracking-tight leading-none"
            >
              {PROFILE.name}
              <span className="text-t-muted font-normal text-lg md:text-xl ml-3">
                ({PROFILE.alias})
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="text-base md:text-lg text-t-blue text-glow-blue mt-3"
            >
              {PROFILE.role}{" "}
              <span className="text-t-muted">@</span>{" "}
              <span className="text-t-amber">{PROFILE.company}</span>
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="h-px bg-gradient-to-r from-t-amber/50 via-t-border to-transparent max-w-md mt-5 origin-left"
            />

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              className="text-t-muted mt-5 text-sm md:text-base italic leading-relaxed whitespace-pre-line"
            >
              &ldquo;{PROFILE.narrative}&rdquo;
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              <QuickLink href={`mailto:${PROFILE.email}`} icon={<Mail size={14} />} label="Email" />
              <QuickLink href={PROFILE.github} icon={<Code2 size={14} />} label="GitHub" />
              <QuickLink href={PROFILE.blog} icon={<BookOpen size={14} />} label="Blog" />
              <QuickLink href={PROFILE.resume} icon={<FileDown size={14} />} label="Resume" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.4 }}
              className="mt-5 flex flex-wrap gap-2"
            >
              {PROFILE.coreStack.map((s) => (
                <span key={s} className="tag-pill">
                  {s}
                </span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Cursor() {
  return (
    <span className="inline-block w-[7px] h-[15px] bg-t-amber animate-cursor-blink ml-px align-middle translate-y-[1px]" />
  );
}

function QuickLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-t-border text-t-text hover:border-t-amber hover:text-t-amber transition-colors duration-200"
    >
      {icon}
      {label}
    </a>
  );
}
