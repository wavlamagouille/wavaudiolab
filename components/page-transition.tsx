"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import SignalCable from "./signal-cable";

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
// no overlap, no shared element to match against. popLayout also
// automatically takes the exiting element out of document flow the
// instant it starts exiting, which is what lets it slide fully off
// screen without leaving blank space or affecting the incoming page's
// position.
//
// A real push-slide, not a crossfade with a slight offset: both pages
// stay fully opaque the whole time (no fade at all) and each moves the
// full width of the screen — the old page is physically shoved off to
// the left while the new one pushes in from the right, like swiping
// between screens on a phone, rather than the two overlapping and
// dissolving into each other.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <>
        {children}
        <SignalCable />
      </>
    );
  }

  return (
    <>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={pathname}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="w-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <SignalCable />
    </>
  );
}
