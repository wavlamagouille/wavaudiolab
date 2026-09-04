"use client";

import { useEffect, useRef } from "react";

// The cable itself: two layered strokes sharing the same path — a wide
// dark "jacket" and a thinner, offset-lighter "highlight" running along
// one edge — which is what actually reads as a rounded, cylindrical cable
// rather than a flat line. Both draw in together, tied directly to overall
// page scroll progress (real getBoundingClientRect/scrollY math, not
// anime.js's scroll-sync API — used it a lot elsewhere in this build with
// mixed results, and this effect specifically needs pixel-exact control
// since a real plug has to land exactly on the drawn tip).
//
// The viewBox width (40) is chosen to numerically match the CSS width
// (w-10 = 40px) so horizontal scaling is exactly 1:1 — only the vertical
// axis stretches to match the page's real height, which keeps the cable's
// side-to-side winding undistorted and makes the plug's position math a
// single scale factor instead of two.
const VIEWBOX_W = 40;
const VIEWBOX_H = 2000;

const CABLE_PATH = `M20,0
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
  C 4,1880 20,1920 20,1980`;

export default function SignalCable() {
  const svgRef = useRef<SVGSVGElement>(null);
  const jacketRef = useRef<SVGPathElement>(null);
  const highlightRef = useRef<SVGPathElement>(null);
  const plugRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const jacket = jacketRef.current;
    const highlight = highlightRef.current;
    const plug = plugRef.current;
    if (!svg || !jacket || !highlight || !plug) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const length = jacket.getTotalLength();
    jacket.style.strokeDasharray = `${length}`;
    highlight.style.strokeDasharray = `${length}`;

    let rafId = 0;

    function update() {
      const doc = document.documentElement;
      const range = doc.scrollHeight - window.innerHeight;
      const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;

      const offset = length * (1 - progress);
      jacket!.style.strokeDashoffset = `${offset}`;
      highlight!.style.strokeDashoffset = `${offset}`;

      // position the plug at the exact current tip of the drawn line
      const drawnLength = length * progress;
      const point = jacket!.getPointAtLength(drawnLength);
      const svgRect = svg!.getBoundingClientRect();
      const scaleY = svgRect.height / VIEWBOX_H;
      const px = point.x; // scaleX is 1:1 by design
      const py = point.y * scaleY;

      plug!.style.opacity = progress > 0.005 ? "1" : "0";
      plug!.style.transform = `translate(${px - 9}px, ${py - 4}px)`;

      rafId = requestAnimationFrame(update);
    }

    rafId = requestAnimationFrame(update);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute left-8 top-0 hidden h-full w-10 lg:block" aria-hidden="true">
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        preserveAspectRatio="none"
      >
        {/* wide dark jacket */}
        <path
          ref={jacketRef}
          d={CABLE_PATH}
          fill="none"
          stroke="#2a0c0e"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* thin bright highlight, offset toward one side for a rounded look */}
        <path
          ref={highlightRef}
          d={CABLE_PATH}
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.75"
          transform="translate(-1.6, 0)"
        />
      </svg>

      {/* the jack plug riding the drawn tip */}
      <div
        ref={plugRef}
        className="absolute left-0 top-0 opacity-0"
        style={{ willChange: "transform" }}
      >
        <svg width="18" height="34" viewBox="0 0 18 34">
          <defs>
            <linearGradient id="plugBody" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8a8f96" />
              <stop offset="35%" stopColor="#e8ebee" />
              <stop offset="55%" stopColor="#c2c7cc" />
              <stop offset="100%" stopColor="#6b7075" />
            </linearGradient>
          </defs>
          {/* plug tip */}
          <path d="M9,0 C13,0 16,3 16,7 L16,9 L2,9 L2,7 C2,3 5,0 9,0 Z" fill="url(#plugBody)" />
          {/* insulator ring */}
          <rect x="1" y="9" width="16" height="3" fill="var(--color-signal)" opacity="0.9" />
          {/* body / sleeve */}
          <rect x="2" y="12" width="14" height="22" rx="2" fill="url(#plugBody)" />
        </svg>
      </div>
    </div>
  );
}
