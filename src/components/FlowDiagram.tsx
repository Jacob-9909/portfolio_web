"use client";

/* 에이전트 흐름 그림. 역할마다 색, 모양, 아이콘이 다르고, 단계에 따라 노드가
   켜진다 (남은 단계는 흐리게, 지나온 단계는 연하게, 지금 단계는 진하게).
   아이콘은 페이지에 한 번 깔린 IconSprite 를 쓴다. */

import { useEffect, useId, useRef, useState } from "react";
import { translations } from "@/lib/data";
import type { Flow, FlowLoop, FlowNode } from "@/lib/flows";
import { cylinderRim, edgePath, linkPath, loopPath, shapePath, type Role } from "@/lib/geometry";
import { nodeState } from "@/lib/stage";
import { ROLE_ICON } from "./icons";

type Lang = "ko" | "en";

const roleKey = (role: Role) =>
  role === "llm" || role === "db" || role === "tool" ? "res" : role;

const FAST = "0.15s";

function Node({ node, step, lang }: { node: FlowNode; step: number; lang: Lang }) {
  const state = nodeState(node.step, step);
  const key = roleKey(node.role);
  const color = `var(--r-${key})`;
  const { x, y, w, h } = node;
  const bubble = node.role === "human" || node.role === "out";
  const iconX = x + (node.role === "guard" ? 20 : 14);
  /* 원통은 윗면 테두리를 피해 글자를 조금 내린다 */
  const mid = y + h / 2 + (node.role === "db" ? 3 : 0);
  const caption = node.caption?.[lang] ?? translations[lang].labels.roles[key];

  return (
    <g
      style={{ opacity: state === "future" ? 0.28 : 1, transition: `opacity ${FAST}`, color: `rgb(${color})` }}
    >
      <text x={x + 2} y={y - 10} fontSize="11.5" fontWeight="600" fill={`rgb(${color})`}>
        {caption}
      </text>
      <path
        d={shapePath(node.role, node)}
        fill={`rgb(${color} / ${state === "current" ? 0.26 : 0.08})`}
        stroke={`rgb(${color})`}
        strokeWidth={state === "current" ? 2.2 : 1.6}
        strokeDasharray={node.role === "tool" ? "4 4" : undefined}
        style={{ transition: `fill ${FAST}, stroke-width ${FAST}` }}
      />
      {node.role === "llm" && (
        <path
          d={[1, 2, 3, 4, 5]
            .map((i) => {
              const px = x + (w * i) / 6;
              return `M${px} ${y - 6} V${y} M${px} ${y + h} V${y + h + 6}`;
            })
            .join(" ")}
          stroke={`rgb(${color})`}
          strokeWidth="1.4"
        />
      )}
      {node.role === "db" && <path d={cylinderRim(node)} fill="none" stroke={`rgb(${color})`} strokeWidth="1.5" />}
      <use href={`#${ROLE_ICON[node.role]}`} x={iconX} y={mid - 9} width="18" height="18" />
      <text x={iconX + 26} y={mid + 5.5} fontSize="15.5" fontWeight="500" fill="rgb(var(--t-text))">
        {node.label[lang]}
      </text>
      {node.sub && (
        <text
          x={x + w / 2}
          y={y + h + (bubble ? 30 : 22)}
          fontSize="12.5"
          textAnchor="middle"
          fill="rgb(var(--t-muted))"
        >
          {node.sub[lang]}
        </text>
      )}
    </g>
  );
}

/** 재생성 고리. 활성 단계에서는 점이 고리를 돌며 시도 횟수를 센다 */
function Loop({ loop, from, to, step, lang }: { loop: FlowLoop; from: FlowNode; to: FlowNode; step: number; lang: Lang }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [dot, setDot] = useState<{ x: number; y: number } | null>(null);
  const [lap, setLap] = useState(1);
  const [still, setStill] = useState(false);
  const active = loop.step === step;
  const drawn = loop.step <= step;
  const color = `rgb(var(--r-${roleKey(from.role)}))`;

  useEffect(() => {
    setLap(1);
    setDot(null);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStill(reduce);
    if (!active || reduce) return;
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    const LAP_MS = 1300;
    let start = performance.now();
    let k = 1;
    let raf = requestAnimationFrame(function tick(now) {
      let t = (now - start) / LAP_MS;
      if (t >= 1) {
        start = now;
        t = 0;
        k = (k % loop.tries) + 1;
        setLap(k);
      }
      const p = path.getPointAtLength(total * t);
      setDot(k < loop.tries ? { x: p.x, y: p.y } : null);
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [active, loop.tries]);

  const top = Math.min(from.y, to.y) - 62;
  const midX = (from.x + from.w / 2 + to.x + to.w / 2) / 2;
  const passed = translations[lang].labels.passed;
  /* 움직임을 끈 환경에서는 횟수를 세지 않고 안내 문구만 둔다 */
  const label = !active || still ? loop.note[lang] : lap < loop.tries ? `${loop.note[lang]} · ${lap} / ${loop.tries}` : passed;

  return (
    <g>
      <path
        ref={pathRef}
        d={loopPath(from, to)}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={drawn ? 0 : 1}
        style={{ transition: "stroke-dashoffset 0.3s ease-out" }}
      />
      {dot && <circle cx={dot.x} cy={dot.y} r="5" fill={color} />}
      <text
        x={midX}
        y={top}
        fontSize="12.5"
        textAnchor="middle"
        fill={color}
        style={{ opacity: drawn ? 1 : 0, transition: `opacity ${FAST}` }}
      >
        {label}
      </text>
    </g>
  );
}

export function FlowDiagram({ flow, step, lang, title }: { flow: Flow; step: number; lang: Lang; title: string }) {
  const uid = useId().replace(/:/g, "");
  const byId = new Map(flow.nodes.map((n) => [n.id, n]));
  const node = (id: string) => byId.get(id)!;
  /* 위쪽 빈 공간을 잘라 낸다: 역할 이름(노드 위 24) 과 고리 안내 문구(고리 위 62+14) 중 가장 높은 곳 */
  const top = Math.max(
    0,
    Math.min(
      ...flow.nodes.map((n) => n.y - 24),
      ...flow.loops.map((l) => Math.min(node(l.from).y, node(l.to).y) - 76),
    ),
  );

  return (
    <svg
      viewBox={`0 ${top} ${flow.width} ${flow.height - top}`}
      role="img"
      aria-labelledby={`${uid}-t ${uid}-d`}
      className="block h-auto w-full overflow-visible"
    >
      <title id={`${uid}-t`}>{title}</title>
      <desc id={`${uid}-d`}>{flow.nodes.map((n) => n.label[lang]).join(", ")}</desc>
      <defs>
        <marker id={`${uid}-ah`} viewBox="0 0 8 10" refX="8" refY="5" markerWidth="7" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto">
          <path d="M0 0 L8 5 L0 10Z" fill="rgb(var(--t-muted))" />
        </marker>
      </defs>

      {flow.edges.map((e) => {
        const a = node(e.from);
        const b = node(e.to);
        const on = e.step <= step;
        if (e.link) {
          return (
            <path
              key={`${e.from}-${e.to}`}
              d={linkPath({ ...a, h: a.h + (a.sub ? 30 : 4) }, b)}
              fill="none"
              stroke="rgb(var(--t-dim))"
              strokeWidth="1.5"
              strokeDasharray="3 5"
              style={{ opacity: on ? 1 : 0.4, transition: `opacity ${FAST}` }}
            />
          );
        }
        const d = edgePath(a, b);
        return (
          <g key={`${e.from}-${e.to}`}>
            <path d={d} fill="none" stroke="rgb(var(--t-line))" strokeWidth="1.8" />
            <path
              d={d}
              fill="none"
              stroke="rgb(var(--t-muted))"
              strokeWidth="1.8"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={on ? 0 : 1}
              markerEnd={on ? `url(#${uid}-ah)` : undefined}
              style={{ transition: "stroke-dashoffset 0.3s ease-out" }}
            />
          </g>
        );
      })}

      {flow.loops.map((l) => (
        <Loop key={`${l.from}-${l.to}`} loop={l} from={node(l.from)} to={node(l.to)} step={step} lang={lang} />
      ))}

      {flow.nodes.map((n) => (
        <Node key={n.id} node={n} step={step} lang={lang} />
      ))}
    </svg>
  );
}
