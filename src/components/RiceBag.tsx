/* 쌀 포대 그림. 상품 사진 대신 쓴다 (저작권). 윗단은 톱니 모양으로 접혀 있고,
   가운데 미색 라벨에 농협 이름과 상품명, 아래 띠에 쌀알 무늬가 있다. */

import type { BagSpec } from "@/lib/samples";

type Lang = "ko" | "en";

const BAG = "M14 18 L22 8 L30 16 L38 8 L46 16 L54 8 L62 16 L70 8 L78 16 L86 8 L94 16 L102 8 L106 18 L110 122 Q110 130 102 130 L18 130 Q10 130 10 122 Z";
/* 고정된 쌀알 자리 (무작위로 만들면 서버와 브라우저 렌더가 달라진다) */
const GRAINS: [number, number, number][] = [
  [24, 108, -30], [38, 116, 20], [52, 110, -10], [66, 120, 40], [80, 112, -45], [94, 118, 15],
  [30, 124, 50], [46, 122, -20], [60, 106, 30], [74, 126, -5], [88, 106, 25], [100, 124, -35],
];

export function RiceBag({ bag, lang, id }: { bag: BagSpec; lang: Lang; id: string }) {
  return (
    <svg viewBox="0 0 120 136" className="block h-[150px] w-full rounded-md bg-[#15130f] py-2" aria-hidden="true">
      <defs>
        <linearGradient id={`shade-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".18" />
          <stop offset=".35" stopColor="#fff" stopOpacity=".08" />
          <stop offset="1" stopColor="#000" stopOpacity=".25" />
        </linearGradient>
      </defs>
      <path d={BAG} fill={bag.body} />
      <rect x="10" y="96" width="100" height="34" fill={bag.band} />
      {GRAINS.map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="2.4" ry="1.2" fill="#fff" fillOpacity=".55" transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <rect x="22" y="32" width="76" height="54" rx="4" fill="#f4efe4" />
      <text x="60" y="50" textAnchor="middle" fontSize="8" fontWeight="500" fill="#2a2118">{bag.brand[lang]}</text>
      <text x="60" y="66" textAnchor="middle" fontSize={lang === "ko" ? 13 : 10} fontWeight="700" fill="#2a2118">{bag.name[lang]}</text>
      <text x="60" y="80" textAnchor="middle" fontSize="8.5" fill="#2a2118" fillOpacity=".7">{bag.weight[lang]}</text>
      <path d={BAG} fill={`url(#shade-${id})`} />
    </svg>
  );
}
