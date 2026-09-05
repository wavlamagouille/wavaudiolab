"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";

// A blur crossfade, not a flip — the tile itself never moves or
// rotates. Both faces sit stacked in the exact same spot; switching
// between them just blurs the current one out and blurs the new one in,
// using only opacity and filter (both cheap, GPU-composited properties,
// not a 3D transform).
export default function FlipCard({
  front,
  back,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
}) {
  const [showBack, setShowBack] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  function toggle() {
    if (transitioning) return;
    setTransitioning(true);
    // blur the current face out first, swap content at the midpoint,
    // then blur the new face in — a plain crossfade would show both
    // faces overlapping mid-transition, which looks messy since they're
    // different heights/content; blurring one out before swapping reads
    // as a single clean transition instead
    window.setTimeout(() => setShowBack((b) => !b), 180);
    window.setTimeout(() => setTransitioning(false), 420);
  }

  const faceStyle = (visible: boolean): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    filter: transitioning ? "blur(10px)" : "blur(0px)",
    transition: "opacity 220ms ease, filter 220ms ease",
    pointerEvents: visible ? "auto" : "none",
  });

  return (
    <div className="relative">
      <div style={faceStyle(!showBack)}>
        {front}
        <button
          onClick={toggle}
          className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full border border-line-2 bg-panel-2 px-3 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-signal hover:text-signal"
          aria-label="More info about the mastering process"
        >
          <Info size={12} /> More info
        </button>
      </div>
      <div className="absolute inset-0" style={faceStyle(showBack)}>
        {back}
        <button
          onClick={toggle}
          className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full border border-line-2 bg-panel-2 px-3 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-signal hover:text-signal"
          aria-label="Back to pricing"
        >
          <X size={12} /> Back
        </button>
      </div>
    </div>
  );
}
