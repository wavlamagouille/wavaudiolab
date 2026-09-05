"use client";

import { useEffect, useRef } from "react";

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
const NORMAL_STAGE_VH = 60; // per-stage scroll allowance for every stage except the last
// The last stage doesn't need anywhere near as much sticky dwell time —
// it has nothing to cross-fade into afterward, just needs to fade in
// and then hand off to the footer. Giving it the same 60vh as every
// other stage meant a long stretch where it sat fully visible with the
// panel still pinned before the sticky mechanism finally released and
// the footer's normal scroll took over — which read as a sudden "phase
// change" no matter how smooth the underlying math was, since scrolling
// suddenly started actually moving content after a long stretch where
// it visibly didn't. Shrinking this to a small fraction means the
// release happens almost immediately once the last stage is in view,
// so scrolling into the footer feels like a continuation, not a jump
// into a different mode.
const LAST_STAGE_VH = 12;

function computeOpacity(progress: number, i: number, boundaries: number[]): number {
  const n = boundaries.length - 1;
  const segment = boundaries[i + 1] - boundaries[i];
  const crossfade = Math.min(segment * 0.28, (boundaries[1] - boundaries[0]) * 0.28);
  const startAt = boundaries[i];
  const endAt = boundaries[i + 1];

  if (i === 0) {
    if (progress <= endAt - crossfade) return 1;
    if (progress >= endAt) return 0;
    return 1 - (progress - (endAt - crossfade)) / crossfade;
  }
  if (i === n - 1) {
    // fades in across its own (much shorter) segment, reaching full
    // opacity exactly at progress=1 — the sticky panel's real release
    // point — so there's no dwell time where nothing changes before it
    // lets go.
    if (progress <= startAt) return 0;
    if (progress >= 1) return 1;
    return (progress - startAt) / (1 - startAt);
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
  lastStageDecoration,
}: {
  stages: React.ReactNode[];
  id?: string;
  // rendered as a sibling to the centered content column, inside the
  // last stage's own full-width layer — not position:fixed, which breaks
  // if any ancestor has a CSS transform (Motion's page-transition wrapper
  // does), silently switching fixed's containing block away from the
  // true viewport and letting it drift as that ancestor's content moves.
  // A full-width absolute-positioned sibling has no such gotcha.
  lastStageDecoration?: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const n = stages.length;
  // total scroll allowance: every stage gets the normal share except the
  // last, which gets a much smaller one (see LAST_STAGE_VH above)
  const totalVh = (n - 1) * NORMAL_STAGE_VH + LAST_STAGE_VH;
  // boundaries as fractions of the total (0 to 1), one per stage edge —
  // stage i spans boundaries[i] to boundaries[i+1]
  const boundaries: number[] = [];
  for (let i = 0; i <= n; i++) {
    const vhSoFar = i < n ? i * NORMAL_STAGE_VH : (n - 1) * NORMAL_STAGE_VH + LAST_STAGE_VH;
    boundaries.push(vhSoFar / totalVh);
  }
  // the release point IS when the last stage's fade-in completes, by
  // construction — exposed for SignalCable to target the same point
  const lastStageVisibleAt = 1;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    function applyHeight() {
      if (!wrap || !isDesktop) return;
      wrap!.style.height = `${totalVh}vh`;
    }

    if (isDesktop) {
      applyHeight();
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
      const range = wrap.offsetHeight - (window.innerHeight - HEADER_HEIGHT);
      const progress =
        range > 0
          ? Math.min(1, Math.max(0, (HEADER_HEIGHT - rect.top) / range))
          : 0;

      layerRefs.current.forEach((layer, i) => {
        if (!layer) return;
        const opacity = computeOpacity(progress, i, boundaries);
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
    <div
      ref={wrapRef}
      id={id}
      data-dock-fraction={lastStageVisibleAt}
      className="relative lg:h-[300vh]"
    >
      <div
        className="lg:sticky lg:h-[calc(100vh-76px)] lg:overflow-hidden"
        style={{ top: `${HEADER_HEIGHT}px` }}
      >
        {stages.map((stage, i) => (
          <div
            key={i}
            data-stage-layer
            ref={(el) => {
              layerRefs.current[i] = el;
            }}
            className={`py-24 lg:flex lg:items-center lg:py-0 ${
              i === 0 ? "lg:absolute lg:inset-0" : "lg:absolute lg:inset-0 lg:opacity-0"
            }`}
          >
            {i === stages.length - 1 && lastStageDecoration}
            <div className="mx-auto w-full max-w-[1180px] px-8">{stage}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
