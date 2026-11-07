"use client";

/* 첫 화면의 앱 창. 네 프로젝트의 결과 화면을 샘플로 보여 준다.
   탭은 누를 때만 바뀐다 (자동 전환 없음). 누를 수 있는 것은 탭뿐이다.
   데스크톱에서는 네 패널을 같은 칸에 겹쳐 두고 안 보이는 것은 visibility 로 숨긴다.
   그래서 창 높이는 가장 긴 탭에 맞춰 고정되고, 탭을 바꿔도 아래 내용이 움직이지 않는다.
   선택한 탭은 언어와 무관한 상태라 언어를 바꿔도 유지된다. */

import { useRef, useState, type KeyboardEvent } from "react";
import type { T } from "@/lib/data";
import { SAMPLES, type RailRow } from "@/lib/samples";
import { Rich, SampleCardView } from "./SampleCards";

type Lang = "ko" | "en";

function Rail({ title, groups, lang }: { title: string; groups: RailRow[][]; lang: Lang }) {
  return (
    <div className="hidden border-l border-t-line bg-[#0b0c0e] px-[18px] py-5 text-[13.5px] lg:block">
      <div className="mb-3 text-[14.5px] font-semibold text-t-text">{title}</div>
      {groups.map((g, gi) => (
        <div key={gi} className="mb-2.5 rounded-[9px] border border-t-line bg-[#16171a] px-3 py-0.5">
          {g.map((row, ri) =>
            "err" in row ? (
              <div key={ri} className="mb-2 whitespace-pre-line rounded-md bg-role-agent/[0.07] px-2.5 py-2 font-mono text-xs leading-normal text-role-agent">
                {row.err}
              </div>
            ) : (
              <div key={ri} className="flex items-baseline justify-between gap-3 border-b border-t-line py-2 last:border-b-0">
                <span className="text-t-muted">{row.k[lang]}</span>
                <b
                  className={`text-right font-semibold ${
                    row.tone === "ok" ? "text-role-guard" : row.tone === "bad" ? "text-role-agent" : "text-t-text"
                  } ${row.tone === "big" ? "text-lg" : ""}`}
                >
                  {row.v[lang]}
                </b>
              </div>
            ),
          )}
        </div>
      ))}
    </div>
  );
}

export function AppWindow({ t, lang }: { t: T; lang: Lang }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number) => {
    const n = (i + SAMPLES.length) % SAMPLES.length;
    setActive(n);
    tabs.current[n]?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: SAMPLES.length - 1 };
    if (e.key in map) {
      e.preventDefault();
      select(map[e.key]);
    }
  };

  return (
    <div className="mx-auto mt-12 max-w-[80rem] px-6 lg:mt-16 lg:px-10 print:hidden">
      <div className="overflow-hidden rounded-[14px] border border-t-line bg-[#0e0f11] shadow-[0_-20px_80px_-20px_rgba(157,180,255,0.10)]">
        <div className="flex items-center gap-1 border-b border-t-line px-3 py-2.5 text-sm text-t-muted">
          <div role="tablist" aria-label={t.labels.sample} onKeyDown={onKey} className="flex min-w-0 gap-1 overflow-x-auto">
            {SAMPLES.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`app-tab-${s.id}`}
                role="tab"
                type="button"
                aria-selected={i === active}
                aria-controls={`app-panel-${s.id}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                className={`relative shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 transition-colors duration-150 ${
                  i === active ? "bg-[#1b1c1e] text-t-text after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-t-hi" : "hover:text-t-text"
                }`}
              >
                {s.tab[lang]} <span className="ml-1 text-xs text-t-dim">{s.tag}</span>
              </button>
            ))}
          </div>
          <span className="ml-auto hidden shrink-0 rounded-full border border-role-human/45 bg-role-human/[0.08] px-3 py-1 text-[12.5px] font-medium text-role-human sm:inline">
            {t.labels.sample}
          </span>
        </div>
        <p className="border-b border-t-line px-4 py-2 text-xs text-role-human sm:hidden">{t.labels.sample}</p>

        <div className="grid grid-cols-[minmax(0,1fr)]">
          {SAMPLES.map((s, i) => {
            const p = t.projects.find((x) => x.id === s.id)!;
            const on = i === active;
            return (
              <div
                key={s.id}
                id={`app-panel-${s.id}`}
                role="tabpanel"
                aria-labelledby={`app-tab-${s.id}`}
                aria-hidden={!on}
                className={`min-w-0 [grid-area:1/1] lg:grid lg:grid-cols-[200px_minmax(0,1fr)_270px] ${on ? "" : "invisible max-lg:hidden"}`}
              >
                <aside className="hidden border-r border-t-line bg-[#0b0c0e] px-4 py-[18px] lg:block">
                  <div className="mb-2 text-[11.5px] font-semibold tracking-wide text-t-dim">{t.labels.projectInfo}</div>
                  <div className="mb-4 text-base font-semibold leading-snug text-t-text">{p.title}</div>
                  {p.facts.map((f) => (
                    <div key={f.label} className="border-t border-[#1f2125] py-2.5">
                      <span className="block text-xs font-semibold text-t-dim">{f.label}</span>
                      <p className="mt-1 text-[13.5px] leading-normal text-t-body">{f.value}</p>
                    </div>
                  ))}
                  <div className="border-t border-[#1f2125] py-2.5">
                    <span className="block text-xs font-semibold text-t-dim">{p.metrics[0].label}</span>
                    <p className="mt-1 text-base font-bold text-t-hi">{p.metrics[0].value}</p>
                  </div>
                </aside>

                <div className="min-w-0 bg-[#101114] px-4 py-5 text-[15px] sm:px-6">
                  <p className="mb-3 text-[13px] text-t-muted lg:hidden">
                    {p.title} · <b className="font-semibold text-t-hi">{p.metrics[0].value}</b>
                  </p>
                  <div className="rounded-[10px] border border-role-human/30 bg-role-human/[0.07] px-3.5 py-3 text-[15.5px] text-t-body">
                    <span className="mr-2.5 inline-block rounded-full bg-role-human/15 px-2.5 py-0.5 align-[1px] text-xs font-bold text-role-human">
                      {s.ask.who[lang]}
                    </span>
                    <Rich s={s.ask.text[lang]} />
                  </div>
                  {s.cards.map((c, ci) => (
                    <SampleCardView key={ci} card={c} lang={lang} />
                  ))}
                </div>

                <Rail title={s.rail.title[lang]} groups={s.rail.groups} lang={lang} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Clients({ t }: { t: T }) {
  return (
    <div className="mx-auto max-w-[80rem] px-6 pb-16 pt-10 lg:px-10 print:hidden">
      <ul className="flex flex-wrap justify-between gap-x-8 gap-y-3 text-lg font-semibold tracking-tight text-t-body/85">
        {t.clients.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <p className="mt-4 text-center font-mono text-[11px] tracking-[0.08em] text-t-dim">{t.labels.clients}</p>
    </div>
  );
}
