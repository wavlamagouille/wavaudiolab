"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";

// A real 3D flip (rotateY, not a fade), with a blur that peaks right at
// the 90-degree point — the moment the card is edge-on and would
// otherwise look like a jarring hard cut — then clears as the new face
// rotates fully into view. A plain two-state CSS transition can't do
// this (it only interpolates in a straight line between a start and end
// value, so blur:0 to blur:0 produces nothing) — this needs an actual
// keyframe animation with a midpoint.
export default function FlipCard({
  front,
  back,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
}) {
  const [flipped, setFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);

  function toggle() {
    if (animating) return;
    setAnimating(true);
    setFlipped((f) => !f);
    // a setTimeout matching the animation's own duration is more
    // predictable here than relying on onAnimationEnd, which can be
    // fragile to get firing reliably depending on how the animated
    // element and its children interact
    window.setTimeout(() => setAnimating(false), 560);
  }

  return (
    <div className="relative" style={{ perspective: "1600px" }}>
      <div
        className={animating ? (flipped ? "flip-card-to-back" : "flip-card-to-front") : ""}
        style={{
          position: "relative",
          transformStyle: "preserve-3d",
          // only set the resting transform when NOT animating — an
          // inline style and a CSS animation both targeting `transform`
          // fight each other and produce a broken, stuck-looking result.
          // The animation alone drives the transform during the flip;
          // this just holds the final position once it's done.
          ...(animating ? {} : { transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }),
        }}
      >
        {/* front */}
        <div style={{ backfaceVisibility: "hidden" }}>
          {front}
          <button
            onClick={toggle}
            className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full border border-line-2 bg-panel-2 px-3 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-signal hover:text-signal"
            aria-label="More info about the mastering process"
          >
            <Info size={12} /> More info
          </button>
        </div>
        {/* back */}
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
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
    </div>
  );
}
