"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center bg-t-bg/80 backdrop-blur-sm border border-t-border rounded-md overflow-hidden text-xs font-mono">
      <button
        onClick={() => setLang("ko")}
        className={`px-3 py-1.5 transition-colors ${
          lang === "ko"
            ? "bg-t-amber/10 text-t-amber"
            : "text-t-muted hover:text-t-text"
        }`}
      >
        KOR
      </button>
      <div className="w-px h-4 bg-t-border" />
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 transition-colors ${
          lang === "en"
            ? "bg-t-amber/10 text-t-amber"
            : "text-t-muted hover:text-t-text"
        }`}
      >
        ENG
      </button>
    </div>
  );
}
