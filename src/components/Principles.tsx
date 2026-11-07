/* 01 일하는 방식. 큰 문장 하나와 카드 세 장. 카드는 유형마다 역할 색 띠와 등각 선 그림을 갖는다. */

import type { Kind, T } from "@/lib/data";
import { FIGS } from "@/lib/iso";
import { Rich } from "./SampleCards";

const KIND_RGB: Record<Kind, string> = { sql: "var(--r-agent)", rag: "var(--r-out)", rec: "var(--r-guard)" };
const ACCENT_RGB = { out: "var(--r-out)", hi: "var(--r-agent)", guard: "var(--r-guard)" } as const;

export function Principles({ t }: { t: T }) {
  return (
    <>
      <p className="max-w-[20em] text-[clamp(1.7rem,3vw,2.4rem)] font-semibold leading-[1.3] tracking-[-0.03em]">
        {t.statement.lead} <span className="text-t-dim">{t.statement.rest}</span>
      </p>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {t.principles.map((p) => {
          const rgb = KIND_RGB[p.kind];
          const kindLabel = t.projects.find((x) => x.kind === p.kind)!.kindLabel;
          return (
            <article
              key={p.no}
              className="flex flex-col rounded-xl border border-t-line border-t-[3px] bg-t-card px-5 pb-4 pt-[18px] break-inside-avoid"
              style={{ borderTopColor: `rgb(${rgb})` }}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ color: `rgb(${rgb})`, background: `rgb(${rgb} / 0.15)` }}>
                  {kindLabel}
                </span>
                <span className="font-mono text-[11px] text-t-dim">{p.no}</span>
              </div>
              <svg viewBox="0 0 300 220" className="my-1.5 h-[170px] w-full" aria-hidden="true">
                {FIGS[p.fig].map((f, i) =>
                  f.d.endsWith("Z") ? (
                    <path
                      key={i}
                      d={f.d}
                      fill={f.accent ? `rgb(${ACCENT_RGB[f.accent]} / 0.18)` : "#0b0c0e"}
                      stroke={f.accent ? `rgb(${ACCENT_RGB[f.accent]})` : "#5b5f68"}
                      strokeWidth="1"
                    />
                  ) : (
                    <path key={i} d={f.d} fill="none" stroke={`rgb(${ACCENT_RGB[f.accent ?? "out"]})`} strokeOpacity=".6" />
                  ),
                )}
              </svg>
              <h3 className="text-lg font-bold tracking-tight">{p.title}</h3>
              <p className="mt-2 flex-1 text-[14.5px] leading-[1.65] text-t-body">
                <Rich s={p.body} />
              </p>
              <div className="mt-4 border-t border-t-line pt-3 text-[12.5px] text-t-muted">{p.projects}</div>
            </article>
          );
        })}
      </div>
    </>
  );
}
