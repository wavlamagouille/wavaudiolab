"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { animate, stagger } from "animejs";

const BAR_COUNT = 48;

// A waveform sweep, not a flat panel: each bar grows to full height in a
// staggered wave (left to right), holds as a solid wall for a beat, then
// shrinks back down in a staggered wave from the center outward — revealing
// the new page as it goes. The page content underneath swaps the instant
// the route changes (React does this synchronously on re-render), so by
// the time the bars are even halfway up, the new page is already sitting
// there waiting — the animation never has to race the content.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const barsRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !barsRef.current) return;

    const bars = barsRef.current.children;

    animate(bars, {
      scaleY: [
        { to: 1, duration: 280, ease: "outExpo" },
        { to: 0, duration: 380, delay: 260, ease: "inOutQuad" },
      ],
      delay: stagger(5, { from: "first" }),
    });
  }, [pathname]);

  return (
    <>
      <div key={pathname}>{children}</div>
      <div
        ref={barsRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[100] flex"
      >
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <span
            key={i}
            className={
              i % 5 === 0
                ? "h-full flex-1 origin-center bg-amber"
                : "h-full flex-1 origin-center bg-signal"
            }
            style={{ transform: "scaleY(0)" }}
          />
        ))}
      </div>
    </>
  );
}
