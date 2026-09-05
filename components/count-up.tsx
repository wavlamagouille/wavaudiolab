"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

// Numbers count up from 0 to their real value once their stage actually
// becomes visible, using anime.js's core numeric tweening (animate a
// plain object, write the interpolated value into the DOM on every
// tick).
//
// This used to trigger off anime.js's onScroll utility, which assumes
// normal document-flow scrolling — an element starts below the
// viewport, scrolls up into it, and the trigger fires at that
// intersection. But every stage inside StageStack is position:absolute
// and sits at the same spot in the viewport the entire time; only its
// opacity changes as you scroll. Geometrically the element is "in the
// viewport" from the very first frame, regardless of which stage is
// actually showing — so the scroll trigger could fire far earlier or
// later than when the stage is actually visible, and reordering the
// stages changed exactly when that mismatch happened. Watching the
// ancestor stage layer's own opacity directly is what actually matches
// how this page works.
export default function CountUp({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      el.textContent = `${value}${suffix}`;
      return;
    }

    let played = false;
    function play() {
      if (played) return;
      played = true;
      const counter = { val: 0 };
      animate(counter, {
        val: value,
        round: 1,
        duration: 350,
        ease: "outExpo",
        onUpdate: () => {
          el!.textContent = `${counter.val}${suffix}`;
        },
      });
    }

    // find the nearest ancestor stage layer (StageStack sets opacity
    // directly on these via inline style) — if there isn't one (e.g. a
    // product detail page with no crossfade sequence), just play once
    // the element exists, since there's no stage visibility to wait for
    const layer = el.closest<HTMLElement>('[data-stage-layer]');
    if (!layer) {
      play();
      return;
    }

    function checkVisible() {
      const opacity = parseFloat(layer!.style.opacity || "1");
      if (opacity > 0.5) play();
    }
    checkVisible(); // in case it's already the active stage on mount

    const observer = new MutationObserver(checkVisible);
    observer.observe(layer, { attributes: true, attributeFilter: ["style"] });

    return () => observer.disconnect();
  }, [value, suffix]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
