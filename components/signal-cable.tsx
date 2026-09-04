"use client";

import { useEffect, useRef } from "react";
import JackPlug3D from "./jack-plug-3d";

// Real black cable + a jack plug modeled on an actual 1/4" TRS connector.
// The plug rides the drawn tip of the cable via getPointAtLength, then
// hands off to the socket's real measured position for the final dock.
//
// Real bug fixed here: the cable's actual visual length (the SVG
// wrapper's height) was still hardcoded to h-full — the whole page's
// height — completely independent of the progress-timing fix from
// before. That fix only changed *when* the reveal animation reached
// 100%, not *how long a line* 100% actually drew — so the fully-drawn
// cable still visually extended the full page length regardless, running
// straight through wherever the socket happened to be instead of ending
// there. Fixed by deriving the wrapper's actual height from the same
// measured reference point used for docking (the socket's real on-screen
// position, which stays constant while its sticky ancestor is pinned),
// so the line's true visual length and the reveal timing are the same
// number, not two independent calculations that can drift apart.
const VIEWBOX_W = 40;
const HEADER_HEIGHT = 76; // px — must match SiteHeader's h-[76px] and StageStack's own constant
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

    const length = jacket.getTotalLength();
    const allStrokes = svg.querySelectorAll<SVGPathElement>("[data-cable-stroke]");
    allStrokes.forEach((el) => {
      el.style.strokeDasharray = `${length}`;
    });

    let rafId = 0;
    let ticking = false;
    let docked = false;
    let range = 0;

    function computeRange() {
      // where StageStack's crossfade settles on its final stage —
      // computed from its own dock-fraction attribute, same as before
      const stackEl = document.getElementById("mixing");
      const socket = document.getElementById("mixer-jack-socket");

      if (stackEl && socket) {
        const dockFraction = parseFloat(stackEl.dataset.dockFraction || "1");
        const stageRange = stackEl.offsetHeight - (window.innerHeight - HEADER_HEIGHT);
        const targetScrollY = dockFraction * stageRange + stackEl.offsetTop - HEADER_HEIGHT;
        // the socket's on-screen position stays constant for as long as
        // its sticky ancestor is pinned, so this is a stable measurement
        // to take at any time, not something that needs live tracking
        const socketViewportTop = socket.getBoundingClientRect().top;
        range = targetScrollY + socketViewportTop;
      } else {
        range = document.documentElement.scrollHeight - window.innerHeight;
      }
      // the wrapper's actual rendered height IS the cable's visual
      // length — this has to be the same number driving the timing, not
      // a separate h-full that happens to span something else entirely
      wrapper!.style.height = `${range}px`;
    }

    function update() {
      // recomputed every call rather than trusted from an earlier
      // snapshot — measuring once at mount risked capturing a wrong,
      // tiny value if it ran before the page's real content had
      // finished rendering, and never correcting itself afterward. This
      // is cheap enough to redo every frame; the values it reads only
      // actually change on resize/content changes, not from redundant
      // reads themselves.
      computeRange();

      const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;

      const offset = length * (1 - progress);
      allStrokes.forEach((el) => {
        el.style.strokeDashoffset = `${offset}`;
      });

      const wrapperRect = wrapper!.getBoundingClientRect();
      const point = jacket!.getPointAtLength(length * progress);
      const svgRect = svg!.getBoundingClientRect();
      const scaleY = svgRect.height / VIEWBOX_H;

      // normal following: anchor is the plug's TOP, meeting the drawn
      // cable tip exactly
      let topX = point.x - 8;
      let topY = point.y * scaleY;

      if (progress > DOCK_START) {
        const socket = document.getElementById("mixer-jack-socket");
        if (socket) {
          const socketRect = socket.getBoundingClientRect();
          const targetX = socketRect.left + socketRect.width / 2 - wrapperRect.left - 8;
          // docking anchor is the plug's TIP (bottom), which is what should
          // actually reach the socket, not wherever the top happens to land
          const targetTopY =
            socketRect.top + socketRect.height / 2 - wrapperRect.top - PLUG_HEIGHT + 6;
          const dockT = Math.min(1, (progress - DOCK_START) / (1 - DOCK_START));
          // ease-out with a very slight overshoot for a "seats into place" feel
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

    update(); // computes range fresh and paints the initial position on mount
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
      className="pointer-events-none absolute left-8 top-0 hidden w-10 lg:block"
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        preserveAspectRatio="none"
      >
        {/* black rubber cable jacket */}
        <path
          ref={jacketRef}
          data-cable-stroke
          d={CABLE_PATH}
          fill="none"
          stroke="#161616"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        {/* subtle rounded highlight for cylindrical depth */}
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
        {/* thin signal-red tracer thread, a real cable detail */}
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

      {/* the jack plug — a real 3D object, not a flat icon */}
      <div ref={plugRef} className="absolute left-0 top-0 opacity-0" style={{ willChange: "transform" }}>
        <JackPlug3D size={16} />
      </div>
    </div>
  );
}
