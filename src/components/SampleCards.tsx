/* 앱 창 가운데 칸의 카드들. 카드는 왼쪽 3px 역할 색 띠와 "배지 + 굵은 제목 + 회색 설명" 머리줄을 갖는다.
   역할 색은 다이어그램과 같다: 에이전트 코랄, 검증 청록, 응답 파랑, 사람 베이지. */

import type { CSSProperties, ReactNode } from "react";
import { rich } from "@/lib/rich";
import type { CardRole, SampleCard, Tone } from "@/lib/samples";
import { highlightSql } from "@/lib/sql";
import { RiceBag } from "./RiceBag";

type Lang = "ko" | "en";

const ROLE_RGB: Record<CardRole, string> = {
  agent: "var(--r-agent)",
  guard: "var(--r-guard)",
  out: "var(--r-out)",
  human: "var(--r-human)",
  cite: "125 139 181",
};

export function Rich({ s }: { s: string }) {
  return (
    <>
      {rich(s).map((p, i) =>
        typeof p === "string" ? <span key={i}>{p}</span> : <b key={i} className="font-semibold text-t-text">{p.b}</b>,
      )}
    </>
  );
}

export function Badge({ role, children }: { role: CardRole; children: ReactNode }) {
  const rgb = ROLE_RGB[role];
  return (
    <span
      className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold"
      style={{ color: `rgb(${rgb})`, background: `rgb(${rgb} / 0.15)` }}
    >
      {children}
    </span>
  );
}

const TONE: Record<Exclude<Tone, null>, string> = {
  up: "font-semibold text-role-guard",
  down: "font-semibold text-role-agent",
  strong: "font-bold text-t-text",
};

function Sql({ sql, marks }: { sql: string; marks?: string[] }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-lg border border-t-line bg-[#0c0d0f] px-3.5 py-3 font-mono text-[13px] leading-[1.6] text-t-body">
      {highlightSql(sql, marks).map((tok, i) =>
        tok.k === "kw" ? (
          <span key={i} className="text-role-agent">{tok.t}</span>
        ) : tok.k === "mark" ? (
          <mark key={i} className="rounded-sm bg-role-guard/15 px-0.5 text-role-guard">{tok.t}</mark>
        ) : (
          <span key={i}>{tok.t}</span>
        ),
      )}
    </pre>
  );
}

function Body({ card, lang }: { card: SampleCard; lang: Lang }) {
  switch (card.kind) {
    case "note":
      return null;
    case "sql":
      return <Sql sql={card.sql} marks={card.marks} />;
    case "table":
      return (
        <>
          {card.text && (
            <p className="mt-2.5 leading-[1.75] text-t-body">
              <Rich s={card.text[lang]} />
            </p>
          )}
          <div className="mt-2.5 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {card.head.map((h, i) => (
                    <th key={i} className={`border-b border-t-line px-1 py-1.5 text-[12.5px] font-semibold text-t-muted ${i ? "text-right" : "text-left"}`}>
                      {h[lang]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {card.rows.map((r, ri) => (
                  <tr key={ri} className="even:bg-white/[0.015]">
                    {r.map((c, ci) => {
                      const tone = card.tone?.[ri]?.[ci];
                      return (
                        <td key={ci} className={`border-b border-t-line px-1 py-1.5 tabular-nums ${ci ? "text-right" : ""} ${tone ? TONE[tone] : "text-t-text"}`}>
                          {c}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    case "points":
      return (
        <>
          <p className="mt-2.5 text-t-body">{card.text[lang]}</p>
          <ol className="mt-2.5 grid gap-2">
            {card.points.map((p, i) => (
              <li key={i} className="grid grid-cols-[26px_1fr_auto] items-start gap-2.5 rounded-lg bg-[#1d1e23] px-3 py-2.5">
                <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-role-out/15 text-xs font-bold text-role-out">{i + 1}</span>
                <div>
                  <b className="text-[14.5px] font-bold text-t-text">{p.title[lang]}</b>
                  <p className="mt-0.5 text-sm leading-relaxed text-t-body">{p.body[lang]}</p>
                </div>
                <span className="whitespace-nowrap rounded-full border border-role-out/35 px-2 py-0.5 text-xs text-role-out">{p.ref[lang]}</span>
              </li>
            ))}
          </ol>
        </>
      );
    case "cites":
      return (
        <>
          <ul className="mt-3 flex flex-wrap gap-2">
            {card.cites.map((c, i) => (
              <li key={i} className="rounded-md border border-role-out/40 bg-role-out/[0.06] px-2.5 py-1 text-[13px] text-role-out">
                <b className="mr-1.5 font-bold">{i + 1}</b>
                {c.text[lang]}
                {c.page && <b className="font-semibold text-t-text"> · {c.page}</b>}
                {c.note && <span className="ml-1 text-t-dim">{c.note[lang]}</span>}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            {card.follow.map((f, i) => (
              <span key={i} className="rounded-full border border-t-line px-3 py-1.5 text-[13px] text-t-muted">{f[lang]}</span>
            ))}
          </div>
        </>
      );
    case "products":
      return (
        <>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {card.products.map((p, i) => (
              <li key={i} className="rounded-lg border border-t-edge bg-[#1d1e23] p-3 text-[13px] text-t-muted">
                <RiceBag bag={p.bag} lang={lang} id={`bag${i}`} />
                <b className="mt-2.5 block font-semibold text-t-text">{p.name[lang]}</b>
                {p.desc[lang]}
              </li>
            ))}
          </ul>
          <p className="mt-3 leading-[1.75] text-t-body">
            <Rich s={card.text[lang]} />
            <span className="caret ml-0.5 inline-block h-[1.05em] w-2 translate-y-0.5 bg-t-body" aria-hidden="true" />
          </p>
        </>
      );
  }
}

export function SampleCardView({ card, lang }: { card: SampleCard; lang: Lang }) {
  const style = { "--rc": ROLE_RGB[card.role], borderLeftColor: `rgb(${ROLE_RGB[card.role]})` } as CSSProperties;
  const slim = card.kind === "note";
  return (
    <section className={`mt-3 rounded-[10px] border border-l-[3px] border-t-edge bg-t-raise ${slim ? "px-4 py-2.5" : "px-4 py-3.5"}`} style={style}>
      <header className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[14.5px]">
        <Badge role={card.role}>{card.badge[lang]}</Badge>
        <b className="font-semibold text-t-text">{card.title[lang]}</b>
        <span className="text-[12.5px] text-t-muted sm:ml-auto">{card.meta[lang]}</span>
      </header>
      <Body card={card} lang={lang} />
    </section>
  );
}
