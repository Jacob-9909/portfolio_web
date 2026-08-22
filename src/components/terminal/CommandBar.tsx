"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { COMMAND_SPECS, argCandidates, SECTIONS } from "@/lib/commands";

interface CommandBarProps {
  onCommand: (command: string) => void;
  /** TAB 후보가 여러 개일 때 터미널에 표시 */
  onSuggest?: (line: string) => void;
}

const ALL_NAMES = COMMAND_SPECS.flatMap((s) => [s.name, ...(s.aliases ?? [])]);

function commonPrefix(items: string[]): string {
  let prefix = items[0];
  for (const item of items.slice(1)) {
    while (!item.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

export default function CommandBar({ onCommand, onSuggest }: CommandBarProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 모바일에서 진입 시 키보드가 강제로 열리는 것 방지
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      inputRef.current?.focus();
    }
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      const cmd = input.trim();
      setHistory((prev) => [...prev, cmd]);
      setHistoryIdx(-1);
      setInput("");
      onCommand(cmd);
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const value = input;
      const endsWithSpace = /\s$/.test(value);
      const parts = value.split(/\s+/).filter(Boolean);
      const completingArg = parts.length > 0 && (endsWithSpace || parts.length > 1);

      /* ── 명령어 이름 완성 ── */
      if (!completingArg) {
        const matches = ALL_NAMES.filter((n) =>
          n.startsWith(value.toLowerCase())
        );
        if (matches.length === 0) return;
        if (matches.length === 1) {
          const spec = COMMAND_SPECS.find(
            (s) => s.name === matches[0] || s.aliases?.includes(matches[0])
          );
          setInput(matches[0] + (spec?.args ? " " : ""));
        } else {
          setInput(commonPrefix(matches));
          onSuggest?.(`${value}\t${matches.join("   ")}`);
        }
        return;
      }

      /* ── 인자 완성 (cd / open / flags) ── */
      const cmdName = parts[0].toLowerCase();
      let pool: string[] = argCandidates(cmdName);
      // cd는 섹션 목록에서도 완성
      if (cmdName === "cd") pool = [...pool, ...SECTIONS.map((s) => `${s}/`)];

      const last = endsWithSpace ? "" : parts[parts.length - 1];
      if (pool.length === 0) return;

      const matches = last
        ? pool.filter((c) => c.startsWith(last.toLowerCase()))
        : pool;
      if (matches.length === 0) return;

      const typed = `${cmdName} ${last}`;
      if (matches.length === 1) {
        setInput(`${cmdName} ${matches[0]}${matches[0].endsWith("/") ? "" : " "}`);
      } else {
        setInput(`${cmdName} ${commonPrefix(matches)}`);
        onSuggest?.(`${typed}\t${matches.join("   ")}`);
      }
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const idx =
        historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(idx);
      setInput(history[idx]);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const idx = historyIdx + 1;
      if (idx >= history.length) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(idx);
        setInput(history[idx]);
      }
    }
  };

  return (
    <div
      className="flex items-center px-4 md:px-8 lg:px-16 py-2.5 bg-t-bg border-t border-t-border cursor-text shrink-0"
      onClick={() => inputRef.current?.focus()}
    >
      <span className="text-t-amber text-sm shrink-0 font-mono">
        jacob@portfolio
      </span>
      <span className="text-t-blue text-sm shrink-0">:</span>
      <span className="text-t-blue text-sm shrink-0">~</span>
      <span className="text-t-text text-sm mr-2 shrink-0">$</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent text-t-text text-sm outline-none caret-t-amber placeholder:text-t-muted/40 font-mono"
        placeholder="type help for commands..."
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  );
}
