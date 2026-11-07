/* "일하는 방식" 카드의 등각 선 그림. 바탕 viewBox 는 0 0 300 220.
   투영: X = ox + (x - y)·cos30°·s, Y = oy + (x + y)·sin30°·s - z·s */

export type FigPath = { d: string; accent?: "out" | "hi" | "guard" };

const C = Math.cos(Math.PI / 6);
const S = Math.sin(Math.PI / 6);
const n = (v: number) => String(Number(v.toFixed(1)));

/** 상자 하나의 왼쪽, 오른쪽, 윗면 경로 */
export function isoBox(x: number, y: number, z: number, w: number, d: number, h: number, s = 1, ox = 150, oy = 110): string[] {
  const P = (a: number, b: number, c: number) => `${n(ox + (a - b) * C * s)},${n(oy + (a + b) * S * s - c * s)}`;
  const face = (pts: [number, number, number][]) => "M" + pts.map((p) => P(...p)).join(" L") + " Z";
  return [
    face([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]]),
    face([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]]),
    face([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]),
  ];
}

const box = (accent?: FigPath["accent"]) => (x: number, y: number, z: number, w: number, d: number, h: number): FigPath[] =>
  isoBox(x, y, z, w, d, h).map((p) => (accent ? { d: p, accent } : { d: p }));
const plain = box();

/* 막대 6개: 숫자는 DB 가 계산 */
const bars = [20, 38, 30, 56, 46, 72].flatMap((h, i) => plain(-60 + i * 20, -14, 0, 14, 28, h));

/* 문서 7장 더미에서 한 장이 빠져나온 그림: 답에 근거를 붙인다 */
const lines: FigPath[] = [0, 1, 2, 3].map((k) => {
  const [a, b] = [62, 110].map((x) => isoBox(x, -35 + k * 14, 23.5, 0, 0, 0)[0].split(" ")[0].slice(1));
  return { d: `M${a} L${b}`, accent: "out" };
});
const docs = [
  ...[0, 1, 2, 3, 4, 5, 6].flatMap((i) => plain(-35, -45, i * 7, 70, 90, 3)),
  ...box("out")(55, -45, 20, 70, 90, 3),
  ...lines,
];

/* 판 두 장이 상자를 지나 두 갈래로: 분기는 코드가 정한다 */
const router = [
  ...plain(-110, -12, 0, 20, 24, 4),
  ...plain(-80, -12, 0, 20, 24, 4),
  ...plain(-50, -30, 0, 50, 60, 40),
  ...plain(25, -60, 0, 20, 24, 4),
  ...plain(55, -60, 0, 20, 24, 4),
  ...box("hi")(25, 36, 0, 20, 24, 4),
  ...box("hi")(55, 36, 0, 20, 24, 4),
];

export const FIGS: Record<"bars" | "docs" | "router", FigPath[]> = { bars, docs, router };
