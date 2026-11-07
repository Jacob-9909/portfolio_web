"use client";

/* 02 프로젝트 · 어떻게 돌아가나. 첫 화면 앱 창이 "무엇이 나오나"라면 여기는 "구조"다.
   데스크톱: 위에 프로젝트 알약 탭, 아래 왼쪽은 한 줄 소개·숫자 카드·정보, 오른쪽은 다이어그램 카드와 단계 카드.
   ← → 는 탭 줄에서는 프로젝트를, 다이어그램 카드 안에서는 단계를 옮긴다 (서로 섞이지 않는다).
   lg 미만에서는 목록을 펼치는 방식이다. 상태는 언어와 무관하다. */

import { useReducer, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { Project, T } from "@/lib/data";
import { FLOWS, type Flow } from "@/lib/flows";
import { isAccordionOpen, stageReducer, stepTitle, type StageAction, type StageState } from "@/lib/stage";
import { FlowDiagram } from "./FlowDiagram";

type Lang = "ko" | "en";
const ROLES = ["human", "agent", "guard", "out", "res"] as const;

function Metrics({ p }: { p: Project }) {
  return (
    <div className="grid gap-2.5">
      {p.metrics.map((m, i) => (
        <div key={m.label} className="flex items-baseline justify-between gap-3 rounded-[10px] border border-t-line bg-[#141518] px-3.5 py-3">
          <b className={`text-xl font-bold tracking-tight ${i === 0 ? "text-t-hi" : "text-t-text"}`}>{m.value}</b>
          <span className="text-right text-[13px] text-t-muted">{m.label}</span>
        </div>
      ))}
    </div>
  );
}

/* 단계 버튼 줄(번호 + 짧은 제목)과 지금 단계의 설명 카드. 설명은 문장이 길어서 한 칸에 크게 보여 준다 */
function Steps({
  flow,
  step,
  lang,
  t,
  dispatch,
}: {
  flow: Flow;
  step: number;
  lang: Lang;
  t: T;
  dispatch: (a: StageAction) => void;
}) {
  return (
    <>
      <ol className="mt-1.5 grid gap-2 sm:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]" style={{ "--n": flow.steps.length } as CSSProperties}>
        {flow.steps.map((_, i) => {
          const on = i === step;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => dispatch({ type: "goto", step: i })}
                aria-current={on ? "step" : undefined}
                aria-label={`${t.labels.step} ${i + 1}`}
                className={`flex h-full w-full items-center gap-2 rounded-[10px] border px-3 py-2.5 text-left transition-colors duration-150 ${
                  on ? "border-role-guard/50 bg-[#121b19]" : "border-t-line bg-[#18191d] hover:border-t-edge"
                }`}
              >
                <span
                  className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full text-xs font-bold ${
                    on ? "bg-role-guard text-t-bg" : i < step ? "bg-role-guard/20 text-role-guard" : "bg-[#26282d] text-t-text"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`truncate text-[13.5px] font-semibold ${on ? "text-t-text" : "text-t-muted"}`}>
                  {stepTitle(flow, i, lang, t.labels.result)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p aria-live="polite" className="mt-2.5 min-h-[4.6rem] rounded-[10px] border border-t-line bg-[#18191d] px-4 py-3.5 text-[15px] leading-[1.7] text-t-body">
        {flow.steps[step][lang]}
      </p>
    </>
  );
}

export function ProjectStage({ t, lang }: { t: T; lang: Lang }) {
  const counts = t.projects.map((p) => FLOWS[p.id].steps.length);
  const [state, dispatch] = useReducer(
    (s: StageState, a: StageAction) => stageReducer(s, a, counts),
    { project: 0, step: 0 },
  );
  const [mobileOpen, setMobileOpen] = useState<number | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const project = t.projects[state.project];
  const flow = FLOWS[project.id];

  /* 이미 고른 프로젝트를 다시 눌러도 단계를 처음으로 돌리지 않는다 */
  const choose = (i: number) => i !== state.project && dispatch({ type: "selectProject", project: i });

  const onTabKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowRight: state.project + 1,
      ArrowLeft: state.project - 1,
      Home: 0,
      End: counts.length - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = (map[e.key] + counts.length) % counts.length;
    choose(next);
    tabs.current[next]?.focus();
  };

  const onStageKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      dispatch({ type: e.key === "ArrowRight" ? "next" : "prev" });
    }
  };

  return (
    <div className="print:hidden">
      {/* 데스크톱 */}
      <div className="hidden lg:block">
        <div role="tablist" aria-orientation="horizontal" aria-label={t.nav.projects} onKeyDown={onTabKey} className="mb-9 flex flex-wrap gap-2">
          {t.projects.map((p, i) => {
            const selected = i === state.project;
            return (
              <button
                key={p.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`tab-${p.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls="stage-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => choose(i)}
                className={`rounded-full border px-3.5 py-2 text-[13.5px] transition-colors duration-150 ${
                  selected ? "border-t-text bg-t-text text-t-bg" : "border-t-line text-t-muted hover:text-t-text"
                }`}
              >
                {p.title.replace(` ${p.kindLabel}`, "")}
                <span className={`ml-1.5 text-xs ${selected ? "text-[#555]" : "text-t-dim"}`}>{p.kindLabel}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-[330px_minmax(0,1fr)] items-start gap-7">
          <div>
            <h3 className="text-[26px] font-bold leading-[1.35] tracking-tight">{project.headline}</h3>
            <div className="mt-6">
              <Metrics p={project} />
            </div>
            <dl className="mt-5 text-[13.5px] text-t-body">
              {project.facts.slice(1).map((f) => (
                <div key={f.label} className="flex gap-3 border-t border-[#1f2125] py-2.5">
                  <dt className="w-11 shrink-0 text-[12.5px] font-semibold text-t-dim">{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div
            id="stage-panel"
            role="tabpanel"
            aria-labelledby={`tab-${project.id}`}
            tabIndex={0}
            onKeyDown={onStageKey}
            className="min-w-0 rounded-[14px] border border-[#2a2c31] bg-[#121316] px-[22px] pb-[22px] pt-5"
          >
            <div className="flex items-center justify-between text-[14.5px]">
              <b className="font-bold">{t.labels.howItWorks}</b>
              <span className="flex items-center gap-3 text-[12.5px] text-t-muted">
                {ROLES.map((r) => (
                  <span key={r} className="flex items-center gap-1.5">
                    <i className="inline-block h-[9px] w-[9px] rounded-[3px]" style={{ background: `rgb(var(--r-${r}))` }} />
                    {t.labels.roles[r]}
                  </span>
                ))}
              </span>
            </div>
            <div className="my-3">
              <FlowDiagram flow={flow} step={state.step} lang={lang} title={project.title} />
            </div>
            <Steps flow={flow} step={state.step} lang={lang} t={t} dispatch={dispatch} />
          </div>
        </div>
      </div>

      {/* 모바일: 목록을 펼친다 */}
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 lg:hidden">
        {t.projects.map((p, i) => {
          const open = isAccordionOpen(mobileOpen, state, i);
          const f = FLOWS[p.id];
          return (
            <li key={p.id} className="rounded-xl border border-t-line bg-t-card">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => {
                  if (open) return setMobileOpen(null);
                  setMobileOpen(i);
                  dispatch({ type: "selectProject", project: i });
                }}
                className="flex w-full items-baseline justify-between gap-4 px-4 py-4 text-left"
              >
                <span className="text-[15px] font-semibold leading-snug text-t-text">
                  {p.title}
                  <span className="mt-0.5 block text-xs font-normal text-t-dim">{p.kindLabel}</span>
                </span>
                <span className="shrink-0 text-[13px] font-semibold text-t-hi">{p.metrics[0].value}</span>
              </button>
              {open && (
                <div className="px-4 pb-5">
                  <h3 className="text-lg font-bold leading-snug tracking-tight">{p.headline}</h3>
                  <div className="mt-4">
                    <Metrics p={p} />
                  </div>
                  <div className="-mx-4 mt-5 overflow-x-auto px-4">
                    <div className="min-w-[36rem]">
                      <FlowDiagram flow={f} step={state.step} lang={lang} title={p.title} />
                    </div>
                  </div>
                  <Steps flow={f} step={state.step} lang={lang} t={t} dispatch={dispatch} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
