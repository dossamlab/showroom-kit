"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";

type Dot = { x: number; y: number; at: number };
type Geometry = { width: number; height: number; d: string; dots: Dot[] };

const TURN = 90; // px of height per loop
const STEP = 0.12; // radians between path points
const TOP = 20;

// A coil seen from the side: x swings across the gutter while y keeps descending, with small loops.
function buildGeometry(height: number, anchors: number[], width: number): Geometry {
  const cx = width / 2;
  const radius = width * 0.32;
  const loop = width * 0.29;
  const pitch = TURN / (2 * Math.PI);
  const total = Math.max(0, (height - TOP * 2) / pitch);
  const point = (t: number) => ({ x: cx + radius * Math.sin(t), y: TOP + pitch * t + loop * (1 - Math.cos(t)) });

  let d = "";
  for (let t = 0; t <= total; t += STEP) {
    const p = point(t);
    d += `${t === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
  }
  const dots = anchors.map((y) => {
    // Subtracting the loop offset keeps each dot within one loop height of its heading.
    const t = Math.min(total, Math.max(0, (y - TOP - loop) / pitch));
    return { ...point(t), at: total ? t / total : 0 };
  });
  return { width, height, d, dots };
}

export default function SpiralPath({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotion();
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const [reached, setReached] = useState(0);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start 70%", "end 85%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    const measure = () => {
      const box = target.getBoundingClientRect();
      const anchors = Array.from(target.querySelectorAll<HTMLElement>("[data-spiral-anchor]")).map(
        (el) => el.getBoundingClientRect().top - box.top + 14
      );
      setGeometry(buildGeometry(target.offsetHeight, anchors, window.innerWidth < 768 ? 28 : 56));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef]);

  useMotionValueEvent(progress, "change", (value) => {
    if (!geometry) return;
    setReached(geometry.dots.filter((dot) => value >= dot.at - 0.01).length);
  });

  if (!geometry) return null;
  const pathLength = reduce ? 1 : progress;
  const shown = reduce ? geometry.dots.length : reached;

  return (
    <svg
      className="sr-spiral"
      width={geometry.width}
      height={geometry.height}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      aria-hidden="true"
    >
      <motion.path d={geometry.d} className="sr-spiral-glow" style={{ pathLength }} />
      <motion.path d={geometry.d} className="sr-spiral-line" style={{ pathLength }} />
      {geometry.dots.map((dot, index) => (
        <motion.circle
          key={index}
          cx={dot.x}
          cy={dot.y}
          r={6}
          className="sr-spiral-dot"
          initial={false}
          animate={{ scale: index < shown ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 14 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      ))}
    </svg>
  );
}
