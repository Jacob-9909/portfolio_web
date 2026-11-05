/* 다이어그램 노드 아이콘. 페이지에 한 번만 깔고 FlowDiagram 이 <use href="#fi-..."> 로 쓴다.
   use 의 그림자 트리에는 CSS 선택자가 닿지 않아서 속성으로 직접 칠한다. */

import type { Role } from "@/lib/geometry";

export const ROLE_ICON: Record<Role, string> = {
  human: "fi-user",
  agent: "fi-code",
  guard: "fi-shield",
  out: "fi-chat",
  llm: "fi-chip",
  db: "fi-db",
  tool: "fi-globe",
};

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconSprite() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute">
      <symbol id="fi-user" viewBox="0 0 18 18">
        <circle cx="9" cy="6" r="3.2" {...stroke} />
        <path d="M2.5 16c1-3.3 3.6-5 6.5-5s5.5 1.7 6.5 5" {...stroke} />
      </symbol>
      <symbol id="fi-code" viewBox="0 0 18 18">
        <path d="M6 4 2 9l4 5M12 4l4 5-4 5" {...stroke} />
      </symbol>
      <symbol id="fi-shield" viewBox="0 0 18 18">
        <path d="M9 1.5 3 4v5c0 3.8 2.6 6.6 6 7.5 3.4-.9 6-3.7 6-7.5V4z" {...stroke} />
        <path d="m6 9 2 2 4-4" {...stroke} />
      </symbol>
      <symbol id="fi-chat" viewBox="0 0 18 18">
        <path d="M2.5 3.5h13v9H8l-4 3v-3H2.5z" {...stroke} />
      </symbol>
      <symbol id="fi-chip" viewBox="0 0 18 18">
        <rect x="4" y="4" width="10" height="10" rx="1.5" {...stroke} />
        <path d="M7 1.5V4M11 1.5V4M7 14v2.5M11 14v2.5M1.5 7H4M1.5 11H4M14 7h2.5M14 11h2.5" {...stroke} />
      </symbol>
      <symbol id="fi-db" viewBox="0 0 18 18">
        <ellipse cx="9" cy="4" rx="6" ry="2.3" {...stroke} />
        <path d="M3 4v10c0 1.3 2.7 2.3 6 2.3s6-1 6-2.3V4M3 9c0 1.3 2.7 2.3 6 2.3s6-1 6-2.3" {...stroke} />
      </symbol>
      <symbol id="fi-globe" viewBox="0 0 18 18">
        <circle cx="9" cy="9" r="7" {...stroke} />
        <path d="M2 9h14M9 2c2 2.2 2.8 4.5 2.8 7S11 13.8 9 16c-2-2.2-2.8-4.5-2.8-7S7 4.2 9 2Z" {...stroke} />
      </symbol>
    </svg>
  );
}
