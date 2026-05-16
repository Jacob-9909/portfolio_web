"use client";

import { useState, useEffect } from "react";
import { Mail, BookOpen, FileDown, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import ToothlessPixel from "./ToothlessPixel";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/data";

interface SidebarPanelProps {
  activeSection: string;
}

const SECTION_LABELS: Record<string, string> = {
  home: "~/home",
  career: "~/career",
  projects: "~/projects",
  skills: "~/skills",
  "side-projects": "~/side-projects",
  contact: "~/contact",
};

function Divider() {
  return <div className="w-full h-px bg-t-border/70" />;
}

export default function SidebarPanel({ activeSection }: SidebarPanelProps) {
  const { lang } = useLanguage();
  const t = translations[lang];
  const { PROFILE } = t;

  const QUICK_LINKS = [
    { href: `mailto:${PROFILE.email}`, icon: <Mail size={14} />, label: "Mail" },
    { href: PROFILE.github, icon: <Code2 size={14} />, label: "GitHub" },
    { href: PROFILE.blog, icon: <BookOpen size={14} />, label: "Blog" },
    { href: PROFILE.resume, icon: <FileDown size={14} />, label: "Resume" },
  ];

  const [uptime, setUptime] = useState(0);
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const tick = () => {
      setUptime((s) => s + 1);
      setTimeStr(
        new Date().toLocaleTimeString("ko-KR", { timeZone: "Asia/Seoul" })
      );
    };
    setTimeStr(
      new Date().toLocaleTimeString("ko-KR", { timeZone: "Asia/Seoul" })
    );
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col h-full py-2"
    >
      {/* Pixel art character */}
      <div className="px-5 py-4">
        <ToothlessPixel />
      </div>

      <Divider />

      {/* Profile */}
      <div className="px-5 py-4 space-y-1">
        <p className="text-t-text font-bold text-base leading-snug">
          {PROFILE.name}
          <span className="text-t-muted font-normal text-sm ml-2">
            ({PROFILE.alias})
          </span>
        </p>
        <p className="text-sm">
          <span className="text-t-blue">{PROFILE.role}</span>
          <span className="text-t-muted"> @ </span>
          <span className="text-t-amber font-medium">{PROFILE.company}</span>
        </p>
      </div>

      <Divider />

      {/* Current section */}
      <div className="px-5 py-3">
        <p className="text-xs text-t-muted uppercase tracking-widest mb-1.5">
          Viewing
        </p>
        <p className="text-sm font-mono">
          <span className="text-t-muted">&gt; </span>
          <motion.span
            key={activeSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-t-green"
          >
            {SECTION_LABELS[activeSection] ?? `~/${activeSection}`}
          </motion.span>
        </p>
      </div>

      <Divider />

      {/* Core stack */}
      <div className="px-5 py-3">
        <p className="text-xs text-t-muted uppercase tracking-widest mb-2">
          Stack
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PROFILE.coreStack.map((s) => (
            <span key={s} className="text-xs px-2 py-0.5 rounded bg-t-border/50 text-t-text/90">
              {s}
            </span>
          ))}
        </div>
      </div>

      <Divider />

      {/* Quick links */}
      <div className="px-5 py-3">
        <p className="text-xs text-t-muted uppercase tracking-widest mb-2">
          Links
        </p>
        <div className="flex items-center gap-2">
          {QUICK_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={link.label}
              className="flex items-center justify-center w-9 h-9 rounded border border-t-border text-t-muted hover:text-t-amber hover:border-t-amber transition-colors duration-150"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>

      <Divider />

      {/* System status */}
      <div className="px-5 py-3 font-mono space-y-2">
        <p className="text-xs text-t-muted uppercase tracking-widest mb-3">
          System
        </p>

        {/* Runtime info */}
        <div className="space-y-1.5 pb-2.5 border-b border-t-border/50">
          <Row label="status"  value="● online"        cls="text-t-green" />
          <Row label="uptime"  value={formatUptime(uptime)} cls="text-t-text" />
          <Row label="time"    value={timeStr || "--:--:--"} cls="text-t-text" />
        </div>

        {/* Environment info */}
        <div className="space-y-1.5 pt-1 pb-2.5 border-b border-t-border/50">
          <Row label="region"  value="Seoul, KR"       cls="text-t-blue" />
          <Row label="tool"    value="Claude Code"    cls="text-t-text" />
        </div>

        {/* CI / Deploy */}
        <div className="space-y-1.5 pt-1">
          <Row label="ci/cd"   value="GH Actions"      cls="text-t-text" />
          <Row label="deploy"  value="✓ stable"        cls="text-t-green" />
          <Row label="build"   value="✓ passed"        cls="text-t-green" />
        </div>
      </div>
    </motion.div>
  );
}

function Row({ label, value, cls }: { label: string; value: string; cls: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-t-muted">{label}</span>
      <span className={cls}>{value}</span>
    </div>
  );
}
