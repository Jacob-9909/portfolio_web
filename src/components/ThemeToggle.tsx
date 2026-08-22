"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLight(document.documentElement.classList.contains("light"));
  }, []);

  const toggle = () => {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.theme = next ? "light" : "dark";
    } catch {
      /* private mode 등 — 무시 */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "dark mode" : "light mode"}
      className="fixed top-4 right-4 z-50 flex items-center justify-center w-9 h-9 bg-t-bg/80 backdrop-blur-sm border border-t-border rounded-md text-t-muted hover:text-t-amber hover:border-t-amber transition-colors"
    >
      {mounted ? (
        isLight ? (
          <Moon size={15} />
        ) : (
          <Sun size={15} />
        )
      ) : (
        <Sun size={15} className="opacity-0" />
      )}
    </button>
  );
}
