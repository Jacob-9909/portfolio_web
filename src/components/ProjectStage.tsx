"use client";

/* 프로젝트 목록과 고정 무대. 데스크톱은 왼쪽 목록에서 고르고 오른쪽 무대에서 단계를 넘긴다.
   스크롤로는 단계가 넘어가지 않는다. 화살표 키는 이 영역에 포커스가 있을 때만 먹는다.
   lg 미만에서는 목록을 펼치는 방식으로 바뀐다. 상태는 언어와 무관하다. */

import { useReducer, useRef, useState, type KeyboardEvent } from "react";
import type { T } from "@/lib/data";
import { FLOWS } from "@/lib/flows";
import { isAccordionOpen, stageReducer, type StageAction, type StageState } from "@/lib/stage";
import { FlowDiagram } from "./FlowDiagram";

type Lang = "ko" | "en";

/* 끝 단계에서도 disabled 를 쓰지 않는다: disabled 가 되면 포커스가 body 로 빠져 ← → 가 끊긴다.
   리듀서가 범위를 잡아 주므로 눌러도 아무 일이 없다 */
function StepControls({
  t,
  step,
  count,
  dispatch,
}: {
  t: T;
  step: number;
  count: number;
  dispatch: (a: StageAction) => void;
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-t-muted">
      <div className="flex gap-1.5">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${t.labels.step} ${i + 1}`}
            aria-current={i === step ? "step" : undefined}
            onClick={() => dispatch({ type: "goto", step: i })}
            className="flex h-6 items-center"
          >
            <span className={`block h-[3px] w-6 transition-colors duration-150 ${i <= step ? "bg-t-hi" : "bg-t-line"}`} />
          </button>
        ))}
      </div>
      <span className="tabular-nums">
        {step + 1} / {count}
      </span>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => dispatch({ type: "prev" })}
          aria-disabled={step === 0}
          className="py-1 hover:text-t-text aria-disabled:opacity-40 aria-disabled:hover:text-t-muted"
        >
          ← {t.labels.prev}
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "next" })}
          aria-disabled={step === count - 1}
          className="py-1 hover:text-t-text aria-disabled:opacity-40 aria-disabled:hover:text-t-muted"
        >
          {t.labels.next} →
        </button>
      </div>
    </div>
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

  const select = (i: number) => {
    const next = (i + counts.length) % counts.length;
    dispatch({ type: "selectProject", project: next });
    tabs.current[next]?.focus();
  };

  // 목록 안에서만: ↑ ↓ 로 프로젝트를 고른다
  const onListKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      select(state.project + (e.key === "ArrowDown" ? 1 : -1));
    }
  };

  // 무대 영역 안 어디서든: ← → 로 단계를 넘긴다
  const onStageKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      dispatch({ type: e.key === "ArrowRight" ? "next" : "prev" });
    }
  };

  return (
    <section
      id="projects"
      className="mx-auto max-w-[72rem] px-6 py-16 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:px-10 lg:py-10 print:hidden"
    >
      <h2 className="font-serif text-2xl font-normal">{t.nav.projects}</h2>

      {/* 데스크톱: 목록 + 고정 무대 */}
      <div className="mt-8 hidden gap-12 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]" onKeyDown={onStageKey}>
        <div role="tablist" aria-orientation="vertical" aria-label={t.nav.projects} onKeyDown={onListKey}>
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
                onClick={() => dispatch({ type: "selectProject", project: i })}
                className={`block w-full border-l-2 py-3 pl-4 text-left transition-colors duration-150 ${
                  selected ? "border-t-hi text-t-text" : "border-t-line text-t-muted hover:text-t-text"
                }`}
              >
                <span className="block text-[15px] leading-snug">{p.title}</span>
                <span className={`mt-1 block text-[13px] ${selected ? "text-t-hi" : "text-t-muted"}`}>{p.number}</span>
              </button>
            );
          })}
        </div>

        <div id="stage-panel" role="tabpanel" aria-labelledby={`tab-${project.id}`} tabIndex={0} className="min-w-0">
          <p className="text-sm text-t-muted">{project.meta}</p>
          <h3 className="mt-2 font-serif text-[1.6rem] font-normal leading-snug">{project.headline}</h3>
          <p className="mt-2 text-[13px] text-t-muted">{project.stack}</p>
          <div className="mt-6 max-w-[42rem]">
            <FlowDiagram flow={flow} step={state.step} lang={lang} title={project.title} />
          </div>
          <p aria-live="polite" className="mt-5 min-h-[5.5rem] max-w-[40em] text-[1.02rem] leading-[1.75] text-t-body">
            {flow.steps[state.step][lang]}
          </p>
          <StepControls t={t} step={state.step} count={flow.steps.length} dispatch={dispatch} />
        </div>
      </div>

      {/* 모바일: 목록을 펼친다 */}
      <ul className="mt-6 border-t border-t-line lg:hidden">
        {t.projects.map((p, i) => {
          const open = isAccordionOpen(mobileOpen, state, i);
          const f = FLOWS[p.id];
          return (
            <li key={p.id} className="border-b border-t-line">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => {
                  if (open) return setMobileOpen(null);
                  setMobileOpen(i);
                  dispatch({ type: "selectProject", project: i });
                }}
                className="flex w-full items-baseline justify-between gap-4 py-4 text-left"
              >
                <span className="text-[15px] leading-snug text-t-text">{p.title}</span>
                <span className="shrink-0 text-[13px] text-t-hi">{p.number}</span>
              </button>
              {open && (
                <div className="pb-6">
                  <p className="text-sm text-t-muted">{p.meta}</p>
                  <h3 className="mt-2 font-serif text-xl font-normal leading-snug">{p.headline}</h3>
                  <p className="mt-2 text-[13px] text-t-muted">{p.stack}</p>
                  <div className="-mx-6 mt-5 overflow-x-auto px-6">
                    <div className="min-w-[36rem]">
                      <FlowDiagram flow={f} step={state.step} lang={lang} title={p.title} />
                    </div>
                  </div>
                  <p aria-live="polite" className="mt-4 text-[15px] leading-[1.75] text-t-body">
                    {f.steps[state.step][lang]}
                  </p>
                  <StepControls t={t} step={state.step} count={f.steps.length} dispatch={dispatch} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
