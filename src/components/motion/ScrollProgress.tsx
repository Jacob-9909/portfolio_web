"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import type { RefObject } from "react";

interface ScrollProgressProps {
  /** 스크롤 컨테이너 (main pane) */
  containerRef: RefObject<HTMLElement | null>;
}

/** 최상단 얇은 진행 바 — 터미널 statusbar 느낌 (Magic UI scroll-progress) */
export default function ScrollProgress({ containerRef }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[2px] bg-t-amber/80 origin-left z-40"
      style={{ scaleX }}
    />
  );
}
