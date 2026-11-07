/* 03 경력. 카드 세 장. 지금 다니는 곳만 코랄 테두리와 "현재" 배지, 조금 더 넓게. */

import type { CareerItem } from "@/lib/data";

export function Career({ items }: { items: CareerItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-[1.3fr_1fr_1fr]">
      {items.map((c) => (
        <article
          key={c.org}
          className={`rounded-xl border p-5 break-inside-avoid ${
            c.now ? "border-t-hi/45 bg-[linear-gradient(180deg,rgb(240_134_106/0.06),rgb(var(--t-card))_60%)]" : "border-t-line bg-t-card"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${c.now ? "bg-t-hi/15 text-t-hi" : "bg-role-res/15 text-role-res"}`}
            >
              {c.badge}
            </span>
            <span className="font-mono text-xs text-t-muted">{c.period}</span>
          </div>
          <h3 className="mt-[18px] text-[22px] font-bold">{c.org}</h3>
          <p className="mt-1 text-[14.5px] font-medium text-t-text">{c.role}</p>
          {c.text && <p className="mt-3 text-sm leading-relaxed text-t-body">{c.text}</p>}
        </article>
      ))}
    </div>
  );
}
