"use client";

/* 첫 화면. 큰 문장 하나와 소개 한 줄. 밑줄 친 문구에 손을 대면 근거 메모가 뜬다.
   마우스는 올리면, 키보드는 포커스하면, 터치는 탭하면 열린다. */

import { useEffect, useState } from "react";
import { LINKS, type Seg, type T } from "@/lib/data";

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
                className="fixed z-30 block rounded-md border border-t-line bg-t-raise px-4 py-3 font-sans text-[13.5px] font-normal leading-relaxed tracking-normal text-t-body"
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

export function Hero({ t }: { t: T }) {
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
    <section className="mx-auto max-w-[80rem] px-6 pt-20 lg:px-10 lg:pt-28 print:pt-4">
      <h1 className="max-w-[15em] text-[clamp(2.4rem,4.6vw,3.6rem)] font-semibold leading-[1.15] tracking-[-0.035em]">
        <Phrases segs={t.hero.title} prefix="t" open={open} setOpen={setOpen} />
      </h1>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-[44em] text-[1.05rem] leading-[1.75] text-t-muted">
          <Phrases segs={t.hero.sub} prefix="s" open={open} setOpen={setOpen} />
        </p>
        <a
          href={LINKS.portfolio}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-sm text-t-body no-underline hover:text-t-text print:hidden"
        >
          {t.nav.portfolio} →
        </a>
      </div>
    </section>
  );
}
