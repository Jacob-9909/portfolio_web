/* 프로젝트 다이어그램의 도형과 연결선 경로. 좌표는 모두 SVG 사용자 단위이고
   상자는 왼쪽 위 모서리 기준이다. 화면과 무관한 순수 함수라 테스트로 고정한다. */

export type Box = { x: number; y: number; w: number; h: number };
export type Role = "human" | "agent" | "guard" | "out" | "llm" | "db" | "tool";

/** 150.000 같은 자리를 없애고 소수 둘째 자리까지만 남긴다 */
const f = (n: number) => String(Number(n.toFixed(2)));

const cx = (b: Box) => b.x + b.w / 2;
const cy = (b: Box) => b.y + b.h / 2;

/** a에서 b로 가는 직각 연결선. 끝점은 b의 테두리이고 화살촉은 SVG marker가 그린다 */
export function edgePath(a: Box, b: Box): string {
  if (Math.abs(cy(a) - cy(b)) < 1) {
    const [sx, ex] = cx(b) > cx(a) ? [a.x + a.w, b.x] : [a.x, b.x + b.w];
    return `M${f(sx)} ${f(cy(a))} H${f(ex)}`;
  }
  if (Math.abs(cx(a) - cx(b)) < 1) {
    const [sy, ey] = cy(b) > cy(a) ? [a.y + a.h, b.y] : [a.y, b.y + b.h];
    return `M${f(cx(a))} ${f(sy)} V${f(ey)}`;
  }
  const sx = cx(b) > cx(a) ? a.x + a.w : a.x;
  const ey = cy(b) > cy(a) ? b.y : b.y + b.h;
  return `M${f(sx)} ${f(cy(a))} H${f(cx(b))} V${f(ey)}`;
}

/** 재생성 같은 되돌림 고리. 두 상자의 위쪽 가운데를 위로 솟은 곡선으로 잇는다 */
export function loopPath(from: Box, to: Box, lift = 58): string {
  const fy = from.y;
  const ty = to.y;
  return `M${f(cx(from))} ${f(fy)} C${f(cx(from))} ${f(fy - lift)}, ${f(cx(to))} ${f(ty - lift)}, ${f(cx(to))} ${f(ty)}`;
}

function roundedRect({ x, y, w, h }: Box, r: number): string {
  return (
    `M${f(x + r)} ${f(y)} H${f(x + w - r)} A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)} ` +
    `V${f(y + h - r)} A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)} H${f(x + r)} ` +
    `A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)} V${f(y + r)} A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`
  );
}

/** 말풍선. 꼬리는 아래쪽 왼쪽(사람) 또는 오른쪽(응답) */
function bubble({ x, y, w, h }: Box, tail: "left" | "right"): string {
  const r = 14;
  const bottom =
    tail === "left"
      ? `H${f(x + 34)} L${f(x + 20)} ${f(y + h + 12)} V${f(y + h)} H${f(x + r)}`
      : `H${f(x + w - 20)} V${f(y + h + 12)} L${f(x + w - 34)} ${f(y + h)} H${f(x + r)}`;
  return (
    `M${f(x + r)} ${f(y)} H${f(x + w - r)} A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)} ` +
    `V${f(y + h - r)} A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)} ${bottom} ` +
    `A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)} V${f(y + r)} A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`
  );
}

const CYL_RY = 9;

/** 역할별 노드 외곽선 */
export function shapePath(role: Role, b: Box): string {
  const { x, y, w, h } = b;
  switch (role) {
    case "human":
      return bubble(b, "left");
    case "out":
      return bubble(b, "right");
    case "guard":
      return `M${f(x + 16)} ${f(y)} H${f(x + w - 16)} L${f(x + w)} ${f(y + h / 2)} L${f(x + w - 16)} ${f(y + h)} H${f(x + 16)} L${f(x)} ${f(y + h / 2)}Z`;
    case "agent":
      return roundedRect(b, 10);
    case "llm":
      return roundedRect(b, 4);
    case "tool":
      return roundedRect(b, 8);
    case "db":
      return (
        `M${f(x)} ${f(y + CYL_RY)} A${f(w / 2)} ${CYL_RY} 0 0 1 ${f(x + w)} ${f(y + CYL_RY)} ` +
        `V${f(y + h - CYL_RY)} A${f(w / 2)} ${CYL_RY} 0 0 1 ${f(x)} ${f(y + h - CYL_RY)}Z`
      );
  }
}

/** 원통 윗면의 앞쪽 테두리. shapePath("db")와 함께 그린다 */
export function cylinderRim({ x, y, w }: Box): string {
  return `M${f(x)} ${f(y + CYL_RY)} A${f(w / 2)} ${CYL_RY} 0 0 0 ${f(x + w)} ${f(y + CYL_RY)}`;
}
