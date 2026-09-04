"use client";

import { useEffect, useRef } from "react";
import JackPlug3D from "./jack-plug-3d";

// Real black cable + a jack plug modeled on an actual 1/4" TRS connector.
// The plug rides the drawn tip of the cable via getPointAtLength, then
// hands off to the socket's real measured position for the final dock.
//
// Rebuilt without preserveAspectRatio="none" scaling entirely. The
// previous version used a fixed-shape path in a 2000-unit viewBox
// stretched non-uniformly to whatever the real wrapper height happened
// to be (often 3000+ px) — extreme non-uniform scaling on a *curved*
// stroke is a real edge case that can render unpredictably, and despite
// every measurable property (geometry, color, opacity, stroke width) all
// checking out correctly in inspection, the cable itself still didn't
// paint. Rather than keep guessing at that specific mechanism, this
// generates the path's actual coordinates to match the real pixel height
// directly — the viewBox equals the true rendered size, so there's no
// transform for the browser to get wrong.
const VIEWBOX_W = 40;
const HEADER_HEIGHT = 76; // px — must match SiteHeader's h-[76px] and StageStack's own constant
const SEGMENT_HEIGHT = 150; // roughly one wave per this many px, matching the original design

function buildCablePath(totalHeight: number): string {
  const segments = Math.max(4, Math.round(totalHeight / SEGMENT_HEIGHT));
  const segH = totalHeight / segments;
  let path = "M20,0";
  let y = 0;
  let atLeft = true;

  for (let i = 0; i < segments; i++) {
    const isLast = i === segments - 1;
    const nextY = isLast ? totalHeight : y + segH;
    const startX = i === 0 ? 20 : atLeft ? 36 : 4;
    const endX = isLast ? 20 : atLeft ? 4 : 36;
    const cp1Y = y + segH * 0.4;
    const cp2Y = y + segH * 0.6;
    path += ` C ${startX},${cp1Y} ${endX},${cp2Y} ${endX},${nextY}`;
    y = nextY;
    atLeft = !atLeft;
  }
  return path;
}

// once overall scroll progress passes this point, the plug stops
// following the raw path math and eases into the socket's real position
const DOCK_START = 0.975;
const PLUG_HEIGHT = 44; // matches the plug SVG's own height attribute (1:1 px)

export default function SignalCable() {
  const svgRef = useRef<SVGSVGElement>(null);
  const jacketRef = useRef<SVGPathElement>(null);
  const plugRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const jacket = jacketRef.current;
    const plug = plugRef.current;
    const wrapper = wrapperRef.current;
    if (!svg || !jacket || !plug || !wrapper) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const allStrokes = svg.querySelectorAll<SVGPathElement>("[data-cable-stroke]");

    let rafId = 0;
    let ticking = false;
    let docked = false;
    let range = 0;
    let length = 0;
    let lastBuiltHeight = -1;

    function computeRange() {
      const stackEl = document.getElementById("mixing");
      const socket = document.getElementById("mixer-jack-socket");

      if (stackEl && socket) {
        const dockFraction = parseFloat(stackEl.dataset.dockFraction || "1");
        const stageRange = stackEl.offsetHeight - (window.innerHeight - HEADER_HEIGHT);
        const targetScrollY = dockFraction * stageRange + stackEl.offsetTop - HEADER_HEIGHT;
        const socketViewportTop = socket.getBoundingClientRect().top;
        range = targetScrollY + socketViewportTop;
      } else {
        range = document.documentElement.scrollHeight - window.innerHeight;
      }
      wrapper!.style.height = `${range}px`;

      // only rebuild the actual path geometry when the height genuinely
      // changes by a meaningful amount — regenerating on every frame
      // regardless would be wasted DOM work, since this only actually
      // needs to change on resize or real layout shifts
      if (Math.abs(range - lastBuiltHeight) > 2) {
        lastBuiltHeight = range;
        svg!.setAttribute("viewBox", `0 0 ${VIEWBOX_W} ${range}`);
        const d = buildCablePath(range);
        allStrokes.forEach((el) => el.setAttribute("d", d));
        length = jacket!.getTotalLength();
        allStrokes.forEach((el) => {
          el.style.strokeDasharray = `${length}`;
        });
      }
    }

    function update() {
      computeRange();

      const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;

      const offset = length * (1 - progress);
      allStrokes.forEach((el) => {
        el.style.strokeDashoffset = `${offset}`;
      });

      const wrapperRect = wrapper!.getBoundingClientRect();
      const point = jacket!.getPointAtLength(length * progress);

      // no scaling needed anymore — the viewBox matches real pixels 1:1
      let topX = point.x - 8;
      let topY = point.y;

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
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none absolute left-8 top-0 z-20 hidden w-10 lg:block"
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${VIEWBOX_W} 2000`}
      >
        {/* black rubber cable jacket */}
        <path
          ref={jacketRef}
          data-cable-stroke
          fill="none"
          stroke="#161616"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        {/* subtle rounded highlight for cylindrical depth */}
        <path
          data-cable-stroke
          fill="none"
          stroke="#3a3a3a"
          strokeWidth="1.4"
          strokeLinecap="round"
          transform="translate(-1.8, 0)"
          opacity="0.7"
        />
        {/* thin signal-red tracer thread, a real cable detail */}
        <path
          data-cable-stroke
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="0.6"
          strokeLinecap="round"
          transform="translate(1.6, 0)"
          opacity="0.85"
        />
      </svg>

      {/* the jack plug — a real 3D object, not a flat icon */}
      <div ref={plugRef} className="absolute left-0 top-0 opacity-0" style={{ willChange: "transform" }}>
        <JackPlug3D size={16} />
      </div>
    </div>
  );
}
