"use client";

import { useEffect, useRef } from "react";
import { getScrollRangeMultiplier } from "@/lib/input-detection";

// Desktop: each stage is absolutely stacked inside one sticky panel pinned
// just below the header. Scrolling drives a crossfade between whichever
// stage is active — computed directly from real scroll position rather
// than anime.js's threshold-string API, which repeatedly proved hard to
// get exactly right blind. This version is plain, verifiable arithmetic:
// easy to reason about and to fix precisely when something's off.
//
// Two real bugs fixed here versus the previous version:
// 1. The sticky panel's `top` didn't account for the 76px header sitting
//    above it in normal flow, so the browser required ~76px of ordinary
//    scrolling before the panel actually locked in place and the
//    crossfade could start — felt like "the page shifts, then the
//    animation begins." Panel now sticks at `top: 76px` (matching the
//    header height) so it engages the instant scrolling starts, and
//    progress is computed relative to that same rest position so there's
//    no dead zone before it starts responding.
// 2. All five layers sit in the exact same absolute position at all
//    times. opacity:0 does not make an element unclickable — a later
//    layer (e.g. Connect) was sitting on top of an earlier one (Packs) in
//    default stacking order, invisible but still capturing every click
//    and hover meant for the layer underneath. Only the currently-visible
//    layer gets pointer-events now; everything else is explicitly
//    disabled.
//
// Mobile: none of this — falls back to plain stacked flow via CSS
// breakpoints only, same as before.
const HEADER_HEIGHT = 76; // px — must match SiteHeader's h-[76px]

function computeOpacity(progress: number, i: number, n: number): number {
  const segment = 1 / n;
  const crossfade = segment * 0.28;
  const startAt = i * segment;
  const endAt = (i + 1) * segment;

  if (i === 0) {
    if (progress <= endAt - crossfade) return 1;
    if (progress >= endAt) return 0;
    return 1 - (progress - (endAt - crossfade)) / crossfade;
  }
  if (i === n - 1) {
    if (progress <= startAt) return 0;
    if (progress >= startAt + crossfade) return 1;
    return (progress - startAt) / crossfade;
  }
  if (progress <= startAt) return 0;
  if (progress <= startAt + crossfade) return (progress - startAt) / crossfade;
  if (progress <= endAt - crossfade) return 1;
  if (progress <= endAt) return 1 - (progress - (endAt - crossfade)) / crossfade;
  return 0;
}

export default function StageStack({
  stages,
  id,
}: {
  stages: React.ReactNode[];
  id?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    if (isDesktop) {
      wrap.style.height = `${stages.length * 60}vh`;
    }

    if (reduceMotion) {
      wrap.style.height = "auto";
      layerRefs.current.forEach((layer) => {
        if (!layer) return;
        layer.style.opacity = "1";
        layer.style.position = "static";
        layer.style.pointerEvents = "auto";
      });
      return;
    }

    if (!isDesktop) return;

    let rafId = 0;
    let ticking = false;

    function update() {
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const range =
        (wrap.offsetHeight - (window.innerHeight - HEADER_HEIGHT)) *
        getScrollRangeMultiplier();
      const progress =
        range > 0
          ? Math.min(1, Math.max(0, (HEADER_HEIGHT - rect.top) / range))
          : 0;

      layerRefs.current.forEach((layer, i) => {
        if (!layer) return;
        const opacity = computeOpacity(progress, i, stages.length);
        layer.style.opacity = String(opacity);
        layer.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
      });
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(update);
      }
    }

    update(); // paint the initial state once on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [stages.length]);

  return (
    <div ref={wrapRef} id={id} className="relative lg:h-[300vh]">
      <div
        className="lg:sticky lg:h-[calc(100vh-76px)] lg:overflow-hidden"
        style={{ top: `${HEADER_HEIGHT}px` }}
      >
        {stages.map((stage, i) => (
          <div
            key={i}
            ref={(el) => {
              layerRefs.current[i] = el;
            }}
            className={`py-24 lg:flex lg:items-center lg:py-0 ${
              i === 0 ? "lg:absolute lg:inset-0" : "lg:absolute lg:inset-0 lg:opacity-0"
            }`}
          >
            <div className="mx-auto w-full max-w-[1180px] px-8">{stage}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
