"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

// A wipe transition tied to the site's own signal-path idea: a bar of
// signal-red sweeps in covering the screen, holds briefly at full opacity,
// then sweeps off the other side revealing the new page — like a level
// meter pinning full and dropping back. Next.js swaps the actual page
// content instantly the moment the route changes (well before the bar
// even reaches full coverage), so the swap itself is always hidden behind
// the bar rather than racing it — no two animations to keep in sync.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <>
      <div key={pathname}>{children}</div>
      <motion.div
        key={`wipe-${pathname}`}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[100] bg-signal"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 1, 1, 0] }}
        transition={{
          duration: 0.7,
          times: [0, 0.45, 0.55, 1],
          ease: [0.65, 0, 0.35, 1],
        }}
        style={{ transformOrigin: "left" }}
      />
    </>
  );
}
