"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { EASE } from "./utils";

const TILT_SPRING = { stiffness: 120, damping: 16, mass: 0.8 };

// One transparent illustration (art-raw/hero-object.png, converted by `npm run art`) that floats,
// leans toward the mouse and drifts with the scroll. Reduced motion is handled in CSS.
export default function HeroObject() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [8, -8]), TILT_SPRING);
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-10, 10]), TILT_SPRING);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [40, -40]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const box = wrapRef.current?.getBoundingClientRect();
      if (reduce || event.pointerType !== "mouse" || !box) return;
      pointerX.set(Math.min(1, Math.max(0, (event.clientX - box.left) / box.width)));
      pointerY.set(Math.min(1, Math.max(0, (event.clientY - box.top) / box.height)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, pointerX, pointerY]);

  return (
    <motion.div
      ref={wrapRef}
      className="sr-object"
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 1.1, ease: EASE }}
      style={{ y: drift }}
    >
      <div className="sr-object-float">
        <motion.img
          src="/visuals/hero-object-720.webp"
          srcSet="/visuals/hero-object-480.webp 480w, /visuals/hero-object-720.webp 720w"
          sizes="(max-width: 767px) 90vw, 560px"
          alt=""
          draggable={false}
          style={{ rotateX, rotateY, transformPerspective: 900 }}
        />
      </div>
    </motion.div>
  );
}
