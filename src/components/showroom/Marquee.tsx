"use client";

import { useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity
} from "motion/react";
import ShowcaseCard from "./ShowcaseCard";
import { EASE, showItems, type OpenCard } from "./utils";

const BASE_SPEED = 40; // px per second
const TILTS = [-2.4, 1.6, -1.2, 2.2, -1.8, 1.2];
const LIFTS = [10, 0, 16, 4, 12, 2];
const STRIP_SIZES = "(max-width: 767px) 160px, 220px";

export default function Marquee({ onOpen, paused }: { onOpen: (open: OpenCard) => void; paused: boolean }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // No work while the strip is off screen (saves battery on phones).
  const visible = useInView(sectionRef, { margin: "200px 0px" });
  const [held, setHeld] = useState(false);
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollSpeed = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 30 });
  // Scrolling down speeds the strip up; scrolling up briefly runs it backwards.
  const boost = useTransform(scrollSpeed, [-2000, 0, 2000], [-8, 0, 8]);

  useAnimationFrame((_, delta) => {
    const track = trackRef.current;
    // While the page scrolls, the strip slides under a resting cursor; keep moving so the scroll boost shows.
    const scrolling = Math.abs(scrollSpeed.get()) > 50;
    if (reduce || paused || !visible || !track || (held && !scrolling)) return;
    // Each slot carries its own right margin, so half the width is exactly one copy.
    const loop = track.scrollWidth / 2;
    if (!loop) return;
    let next = (x.get() - BASE_SPEED * (1 + boost.get()) * (delta / 1000)) % loop;
    if (next > 0) next -= loop;
    x.set(next);
  });

  return (
    <motion.section
      ref={sectionRef}
      className="sr-marquee"
      aria-label="모든 링크 미리보기"
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.9, ease: EASE }}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <motion.div ref={trackRef} className="sr-track" style={{ x }}>
        {[0, 1].map((copy) =>
          showItems.map((item, index) => (
            <div
              key={`${copy}-${item.id}`}
              className={copy ? "sr-slot sr-slot-clone" : "sr-slot"}
              style={{ transform: `rotate(${TILTS[index % TILTS.length]}deg) translateY(${LIFTS[index % LIFTS.length]}px)` }}
            >
              <ShowcaseCard
                item={item}
                layoutId={`${copy ? "marquee-clone" : "marquee"}-${item.id}`}
                onOpen={onOpen}
                sizes={STRIP_SIZES}
                decorative={copy === 1}
              />
            </div>
          ))
        )}
      </motion.div>
    </motion.section>
  );
}
