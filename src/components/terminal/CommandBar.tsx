"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";

interface CommandBarProps {
  onCommand: (command: string) => void;
}

export default function CommandBar({ onCommand }: CommandBarProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      const cmd = input.trim();
      setHistory((prev) => [...prev, cmd]);
      setHistoryIdx(-1);
      setInput("");
      onCommand(cmd);
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
