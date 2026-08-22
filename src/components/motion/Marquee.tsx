"use client";

interface MarqueeProps {
  items: string[];
}

/** 기술 스택 티커 — CSS keyframes만 사용, 양끝 마스크 (Magic UI marquee 변형) */
export default function Marquee({ items }: MarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div
      aria-hidden
      className="overflow-hidden border-y border-t-border/60 bg-t-surface/20 py-2.5 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
    >
      <div className="flex w-max animate-marquee gap-10">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-mono text-xs text-t-muted whitespace-nowrap flex items-center gap-10"
          >
            {item}
            <span className="text-t-dim select-none">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
