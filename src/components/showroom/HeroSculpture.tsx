"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll } from "motion/react";
import { visuals } from "@/config/visuals";
import { EASE } from "./utils";

// Turntable frames rendered by `npm run sculpture` and converted by `npm run art`.
const FRAMES = visuals.sculptureFrames;
const IDLE_FPS = 6; // frames per second while the page rests (one turn every 10 s)
const frameSrc = (size: number, index: number) => `/visuals/sculpture/${size}/f-${String(index).padStart(3, "0")}.webp`;

export default function HeroSculpture() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<HTMLImageElement[]>([]);
  const drawn = useRef(-1);
  const idle = useRef(0);
  const reduce = useReducedMotion();
  const lift = useMotionValue(0);
  // 0 when the sculpture enters the viewport from below, 1 when it leaves at the top.
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end start"] });

  useEffect(() => {
    const size = window.innerWidth < 768 ? 480 : 720;
    const list = Array.from({ length: FRAMES }, () => new Image());
    frames.current = list;
    // Show the first frame quickly, then fetch the rest.
    list[0].onload = () => {
      const canvas = canvasRef.current;
      if (canvas) canvas.width = canvas.height = size;
      drawn.current = -1; // resizing clears the canvas
      // With reduced motion only the first frame is shown, so skip downloading the rest.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      list.slice(1).forEach((image, index) => {
        image.decoding = "async";
        image.src = frameSrc(size, index + 1);
      });
    };
    list[0].src = frameSrc(size, 0);
  }, []);

  useAnimationFrame((_, delta) => {
    const progress = scrollYProgress.get();
    if (progress >= 1) return; // scrolled out of view
    if (!reduce) idle.current += (delta / 1000) * IDLE_FPS;
    // Idle spin plus one extra turn across the scroll.
    const index = reduce ? 0 : Math.floor(idle.current + progress * FRAMES) % FRAMES;
    lift.set(reduce ? 0 : 50 - progress * 120);

    const image = frames.current[index];
    const canvas = canvasRef.current;
    if (index === drawn.current || !canvas || !image?.complete || !image.naturalWidth) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    drawn.current = index;
  });

  return (
    <motion.div
      ref={wrapRef}
      className="sr-sculpture"
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 1.1, ease: EASE }}
      style={{ y: lift }}
    >
      <canvas ref={canvasRef} width={720} height={720} />
    </motion.div>
  );
}
