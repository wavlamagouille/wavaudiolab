// A best-effort heuristic, not a perfect device fingerprint — there's no
// reliable native "is this a trackpad" API. Mouse wheels almost always
// report whole-number deltaY values in fixed steps (100, 120, etc.);
// trackpads report fine-grained, often fractional deltaY due to their
// sub-pixel precision, arriving in rapid bursts during a single swipe.
// This is passive observation only (no preventDefault, no interference
// with native scroll) — it just informs how much real scroll distance
// our own scroll-driven animations should treat as "one full cycle."
let trackpadLikely = false;
let samples = 0;

if (typeof window !== "undefined") {
  window.addEventListener(
    "wheel",
    (e) => {
      if (samples > 40) return; // settle on an answer early, don't keep flip-flopping
      const isFractional = Math.abs(e.deltaY) % 1 !== 0;
      const isSmall = Math.abs(e.deltaY) > 0 && Math.abs(e.deltaY) < 30;
      if (isFractional || isSmall) {
        trackpadLikely = true;
      }
      samples++;
    },
    { passive: true }
  );
}

// Multiplier applied to scroll-driven animation ranges: trackpad-detected
// input shrinks the effective distance needed to complete a cycle, mouse
// wheel input is completely unaffected (multiplier of 1).
export function getScrollRangeMultiplier(): number {
  return trackpadLikely ? 0.6 : 1;
}
