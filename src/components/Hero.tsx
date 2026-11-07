"use client";

/* 첫 화면. 큰 문장 하나와 소개 한 줄. 밑줄 친 문구에 손을 대면 근거 메모가 뜬다.
   마우스는 올리면, 키보드는 포커스하면, 터치는 탭하면 열린다. */

import { useEffect, useState } from "react";
import { LINKS, type Seg, type T } from "@/lib/data";
import { useLanguage } from "@/lib/LanguageContext";

type Lang = "ko" | "en";
type Open = { key: string; left: number; top: number } | null;

const NOTE_W = 272;

function Phrases({ segs, prefix, open, setOpen }: { segs: Seg[]; prefix: string; open: Open; setOpen: (o: Open) => void }) {
  const show = (key: string, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setOpen({ key, left: Math.max(12, Math.min(r.left, innerWidth - NOTE_W - 12)), top: r.bottom + 12 });
  };
  const hoverable = () => matchMedia("(hover: hover)").matches;

  return (
    <>
      {segs.map((seg, i) => {
        if (typeof seg === "string") return <span key={i}>{seg}</span>;
        const key = `${prefix}${i}`;
        const isOpen = open?.key === key;
        return (
          <span key={i}>
            <button
              type="button"
              className="ph"
              aria-expanded={isOpen}
              aria-controls={`note-${key}`}
              onMouseEnter={(e) => hoverable() && show(key, e.currentTarget)}
              onMouseLeave={() => hoverable() && setOpen(null)}
              onFocus={(e) => e.currentTarget.matches(":focus-visible") && show(key, e.currentTarget)}
              onBlur={() => setOpen(null)}
              onClick={(e) => (isOpen && !hoverable() ? setOpen(null) : show(key, e.currentTarget))}
            >
              {seg.text}
            </button>
            {isOpen && open && (
              <span
                id={`note-${key}`}
                role="note"
                className="fixed z-30 block rounded-md border border-t-line bg-t-panel px-4 py-3 font-sans text-[13.5px] font-normal leading-relaxed tracking-normal text-t-body"
                style={{ left: open.left, top: open.top, width: NOTE_W }}
              >
                {seg.note}
                <span className="mt-1.5 block text-xs text-t-muted">{seg.src}</span>
              </span>
            )}
          </span>
        );
      })}
    </>
  );
}

export function Hero({ t, lang }: { t: T; lang: Lang }) {
  const { setLang } = useLanguage();
  const [open, setOpen] = useState<Open>(null);

  // 스크롤하거나 Esc 를 누르면 메모를 닫는다 (fixed 위치가 문구에서 떨어지지 않게)
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    addEventListener("scroll", close, { passive: true });
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("scroll", close);
      removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section className="relative mx-auto flex min-h-[92vh] max-w-[72rem] flex-col justify-center px-6 lg:px-10 print:min-h-0 print:pb-6 print:pt-4">
      <nav className="absolute inset-x-6 top-7 flex items-center justify-between text-sm text-t-muted lg:inset-x-10 print:hidden">
        <span className="font-semibold text-t-text">{t.name}</span>
        <div className="flex items-center gap-5">
          <a href="#projects" className="hidden no-underline hover:text-t-text sm:inline">{t.nav.projects}</a>
          <a href="#career" className="hidden no-underline hover:text-t-text sm:inline">{t.nav.career}</a>
          <a href="#skills" className="hidden no-underline hover:text-t-text sm:inline">{t.nav.skills}</a>
          <a href={LINKS.blog} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-t-text">
            {t.nav.blog}
          </a>
          <div role="group" aria-label={t.nav.language} className="flex gap-1">
            {(["ko", "en"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`px-1 py-2 ${lang === code ? "text-t-text" : "hover:text-t-text"}`}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <h1 className="max-w-[15em] font-serif text-[clamp(2.4rem,5.4vw,4.6rem)] font-light leading-[1.22] tracking-[-0.025em]">
        <Phrases segs={t.hero.title} prefix="t" open={open} setOpen={setOpen} />
      </h1>
      <p className="mt-8 max-w-[34em] text-[1.2rem] leading-[1.75] text-t-body">
        <Phrases segs={t.hero.sub} prefix="s" open={open} setOpen={setOpen} />
      </p>
    </section>
  );
}
