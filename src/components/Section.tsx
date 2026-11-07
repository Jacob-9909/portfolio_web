/* 아래 섹션의 띠. 바탕을 번갈아 깔고(base / band) 위쪽에 가는 선을 둔다.
   머리에는 코랄 번호 배지와 섹션 이름. */

import type { ReactNode } from "react";

export function Section({
  id,
  no,
  label,
  tone,
  children,
  className = "",
}: {
  id?: string;
  no: string;
  label: string;
  tone: "base" | "band";
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-14 border-t border-[#1c1e22] py-[84px] ${tone === "band" ? "bg-t-band" : "bg-t-bg"} print:border-0 print:py-8 ${className}`}
    >
      <div className="mx-auto max-w-[80rem] px-6 lg:px-10">
        <h2 className="mb-7 flex items-center gap-3">
          <span className="rounded-md border border-t-hi/40 px-[7px] py-[3px] font-mono text-xs font-semibold text-t-hi">{no}</span>
          <span className="text-sm font-semibold text-t-body">{label}</span>
        </h2>
        {children}
      </div>
    </section>
  );
}
