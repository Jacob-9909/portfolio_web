/* 04 기술. 칩마다 아이콘 타일(public/icons). 배치는 세 줄:
   AI(두 칸, 4열 × 2줄) + 언어(세로 목록) / 백엔드·인프라·도구 / 자격(한 줄 전체).
   첫 줄 두 카드는 같은 높이로 늘고, 안의 칩이 높이를 고르게 나눠 채운다. */

import type { SkillGroup } from "@/lib/data";

/* next.config.mjs 의 basePath 와 같아야 한다 (LINKS.portfolio 와 같은 규칙) */
const ICON_BASE = "/portfolio_web/icons/";

function Chip({ name, icon, size }: { name: string; icon: string; size: "sm" | "md" | "lg" }) {
  const box = size === "lg" ? "h-[38px] w-[38px] rounded-lg" : size === "md" ? "h-[30px] w-[30px] rounded-lg" : "h-6 w-6 rounded-md";
  const pad = size === "sm" ? "py-[5px] pl-[5px] pr-[11px] text-[13.5px]" : "py-2 pl-2 pr-3 text-[15px]";
  return (
    <li className={`inline-flex items-center gap-2 rounded-[7px] border border-t-edge ${size === "sm" ? "bg-[#1d1e22]" : "bg-[#1b1c20]"} ${pad} text-t-text`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 쓰지 않는다 */}
      <img src={`${ICON_BASE}${icon}.svg`} alt="" width={38} height={38} className={`block ${box}`} />
      {name}
    </li>
  );
}

export function Skills({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className="grid gap-3.5 md:grid-cols-3">
      {groups.map((g) => {
        const main = g.variant === "main";
        const lang = g.variant === "lang";
        const cert = g.variant === "cert";
        return (
          <section
            key={g.title}
            className={`flex flex-col rounded-xl border bg-[#141518] px-5 pb-[22px] pt-5 break-inside-avoid ${
              main ? "border-t-hi/40 md:col-span-2" : "border-t-line"
            } ${cert ? "md:col-span-3" : ""}`}
          >
            <h3 className={`text-[13px] font-bold ${main ? "text-t-hi" : "text-t-body"}`}>{g.title}</h3>
            {cert ? (
              <ul className="mt-3.5 flex flex-wrap gap-2">
                {g.items.map((i) => (
                  <li key={i.name} className="rounded-[7px] border border-t-edge bg-[#1d1e22] px-2.5 py-1.5 text-[13.5px] text-t-text">
                    <span className="mr-1.5 font-bold text-role-guard">✓</span>
                    {i.name}
                  </li>
                ))}
              </ul>
            ) : (
              <ul
                className={`mt-3.5 flex-1 gap-2 ${
                  main
                    ? "grid auto-rows-fr grid-cols-2 gap-2.5 sm:grid-cols-4"
                    : lang
                      ? "grid auto-rows-fr grid-cols-1"
                      : "flex flex-wrap content-start"
                }`}
              >
                {g.items.map((i) => (
                  <Chip key={i.name} name={i.name} icon={i.icon} size={main ? "lg" : lang ? "md" : "sm"} />
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
