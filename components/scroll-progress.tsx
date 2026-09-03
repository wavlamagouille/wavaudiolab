"use client";

import { motion, useScroll, useSpring } from "motion/react";

// The one deliberate scroll-driven element on the page: a signal level
// meter that fills as you scroll, standing in for "how far the signal
// has traveled down the chain." Everything else on the page is calm.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-gradient-to-r from-signal via-amber to-signal"
      style={{ scaleX }}
    />
  );
}
