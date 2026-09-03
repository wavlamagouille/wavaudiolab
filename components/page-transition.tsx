"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

// A real shared-element transition, not a screen-covering effect: the
// product image itself (same layoutId on the grid card and the detail
// page's hero) is the thing that actually moves and resizes between pages
// — Motion measures its position/size on the outgoing page and the
// incoming page, then animates continuously between the two. Everything
// else on the page does a quick crossfade underneath it. `popLayout` mode
// is what makes this possible: it lets the outgoing page keep animating
// out while the incoming page is already mounted and laying out, which is
// the overlap Motion needs to compute the shared-element handoff. `mode:
// "wait"` would fully remove the old page before the new one exists —
// no overlap, no shared element to match against.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 0.985, filter: "blur(6px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.985, filter: "blur(6px)" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
