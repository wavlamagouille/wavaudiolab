"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";

// Real scroll-scrubbing, not a one-time "reveal once and stay" trigger:
// sync:true ties each item's opacity/position directly to scroll progress
// between the enter and leave thresholds, so scrolling down reveals a
// section and scrolling back up un-reveals it — continuous both ways,
// same mechanism already used for the stage-divider lines on this page.
export default function ScrollReveal({
  children,
  className,
  staggerMs = 45,
}: {
  children: React.ReactNode;
  className?: string;
  staggerMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const items = el.children;
    if (!items.length) return;

    Array.from(items).forEach((item) => {
      (item as HTMLElement).style.opacity = "0";
    });

    animate(items, {
      opacity: [
        { to: 1, duration: 18, ease: "outQuad" },
        { to: 1, duration: 64 },
        { to: 0, duration: 18, ease: "inQuad" },
      ],
      translateY: [
        { to: 0, duration: 18, ease: "outQuad" },
        { to: 0, duration: 64 },
        { to: -16, duration: 18, ease: "inQuad" },
      ],
      delay: stagger(staggerMs),
      autoplay: onScroll({
        target: el,
        enter: "bottom-=8% bottom",
        leave: "top+=12% top",
        sync: true,
      }),
    });
  }, [staggerMs]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
