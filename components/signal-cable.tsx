"use client";

import { useEffect, useId, useRef } from "react";
import { animate, createDrawable, onScroll } from "animejs";

// A literal signal cable, drawn with anime.js's actual SVG toolset (not a
// CSS trick): one continuous winding path running down the page gutter,
// tracing itself in as you scroll from top to bottom of the whole page,
// and un-tracing as you scroll back up (sync:true, both directions). Only
// shown on wide screens where there's real gutter space for it to live in
// without sitting on top of content.
export default function SignalCable() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathId = useId();

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !svgRef.current) return;

    const path = svgRef.current.querySelector("path");
    if (!path) return;

    const drawable = createDrawable(path);

    animate(drawable, {
      draw: ["0 0", "0 1"],
      ease: "linear",
      autoplay: onScroll({
        target: document.body,
        enter: "top top",
        leave: "bottom bottom",
        sync: true,
      }),
    });
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-8 top-0 hidden h-full w-10 lg:block"
      viewBox="0 0 40 2000"
      preserveAspectRatio="none"
    >
      <path
        id={pathId}
        d="M20,0 
           C 20,60 4,90 4,150
           C 4,210 36,240 36,300
           C 36,360 4,390 4,450
           C 4,520 36,550 36,620
           C 36,690 4,720 4,790
           C 4,860 36,890 36,960
           C 36,1030 4,1060 4,1130
           C 4,1200 36,1230 36,1300
           C 36,1370 4,1400 4,1470
           C 4,1540 36,1570 36,1640
           C 36,1710 4,1740 4,1810
           C 4,1880 20,1920 20,2000"
        fill="none"
        stroke="var(--color-signal)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
