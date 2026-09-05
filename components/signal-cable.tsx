"use client";

import { useEffect, useRef } from "react";
import JackPlug3D from "./jack-plug-3d";

// Reverted to the simple version that actually worked, per direct
// request — the more "correct" dynamic-path-generation approach from
// later iterations kept the math cleaner but the cable stopped
// rendering and I was never able to fully pin down why despite real
// browser testing. This version is deliberately simple: one fixed
// path, stretched to fill the page height, progress tied to plain
// document scroll. The mixer jack lives back in the footer where it
// originally did, in normal document flow.
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
  C 4,1880 20,1920 20,1960`;

const DOCK_START = 0.975;
const PLUG_HEIGHT = 44;

export default function SignalCable() {
  const svgRef = useRef<SVGSVGElement>(null);
  const jacketRef = useRef<SVGPathElement>(null);
  const plugRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const jacket = jacketRef.current;
    const plug = plugRef.current;
    if (!svg || !jacket || !plug) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const length = jacket.getTotalLength();
    const allStrokes = svg.querySelectorAll<SVGPathElement>("[data-cable-stroke]");
    allStrokes.forEach((el) => {
      el.style.strokeDasharray = `${length}`;
    });

    let rafId = 0;
    let docked = false;

    function update() {
      const doc = document.documentElement;
      const range = doc.scrollHeight - window.innerHeight;
      const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;

      const offset = length * (1 - progress);
      allStrokes.forEach((el) => {
        el.style.strokeDashoffset = `${offset}`;
      });

      const wrapperRect = svg!.parentElement!.getBoundingClientRect();
      const point = jacket!.getPointAtLength(length * progress);
      const svgRect = svg!.getBoundingClientRect();
      const scaleY = svgRect.height / VIEWBOX_H;

      let topX = point.x - 8;
      let topY = point.y * scaleY;

      if (progress > DOCK_START) {
        const socket = document.getElementById("mixer-jack-socket");
        if (socket) {
          const socketRect = socket.getBoundingClientRect();
          const targetX = socketRect.left + socketRect.width / 2 - wrapperRect.left - 8;
          const targetTopY =
            socketRect.top + socketRect.height / 2 - wrapperRect.top - PLUG_HEIGHT + 6;
          const dockT = Math.min(1, (progress - DOCK_START) / (1 - DOCK_START));
          const eased = dockT < 1 ? 1 - Math.pow(1 - dockT, 3) : 1;
          topX = topX + (targetX - topX) * eased;
          topY = topY + (targetTopY - topY) * eased;

          const glow = document.getElementById("mixer-jack-glow");
          if (dockT > 0.9 && !docked) {
            docked = true;
            if (glow) {
              glow.style.opacity = "1";
              glow.style.strokeWidth = "2.2";
            }
          } else if (dockT <= 0.9 && docked) {
            docked = false;
            if (glow) {
              glow.style.opacity = "0.55";
              glow.style.strokeWidth = "1";
            }
          }
        }
      }

      plug!.style.opacity = progress > 0.004 ? "1" : "0";
      plug!.style.transform = `translate(${topX}px, ${topY}px)`;

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
        <path
          ref={jacketRef}
          data-cable-stroke
          d={CABLE_PATH}
          fill="none"
          stroke="#161616"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <path
          data-cable-stroke
          d={CABLE_PATH}
          fill="none"
          stroke="#3a3a3a"
          strokeWidth="1.4"
          strokeLinecap="round"
          transform="translate(-1.8, 0)"
          opacity="0.7"
        />
        <path
          data-cable-stroke
          d={CABLE_PATH}
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="0.6"
          strokeLinecap="round"
          transform="translate(1.6, 0)"
          opacity="0.85"
        />
      </svg>

      <div ref={plugRef} className="absolute left-0 top-0 opacity-0" style={{ willChange: "transform" }}>
        <JackPlug3D size={16} />
      </div>
    </div>
  );
}
