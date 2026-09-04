"use client";

import { useEffect, useRef } from "react";
import { animate, onScroll } from "animejs";

// Desktop: each stage is absolutely stacked inside one sticky, full-height
// panel. Scrolling through the tall wrapper never moves the panel itself —
// it just drives an opacity crossfade between whichever two stages are
// adjacent, so one dissolves out exactly as the next dissolves in, in the
// same screen position. This genuinely needs scroll-sync (continuous,
// scroll-position-driven opacity), unlike the general content reveals
// elsewhere on the site — it's the one place that mechanism is actually
// the right tool.
//
// Mobile: none of this. The height:auto / static-position fallback below
// is the default and only overridden at the lg breakpoint, so a phone just
// gets the three stages in plain stacked flow — pinning viewport-height
// content is fragile on mobile browsers (dynamic toolbars resizing the
// viewport) and not worth the risk for a feature no one's asking for there.
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
      // set the scroll-multiplier height only on desktop, where the
      // sticky/pinned layout actually applies
      wrap.style.height = `${stages.length * 72}vh`;
    }

    if (reduceMotion) {
      // the lg: CSS classes hide every stage but the first via a pure
      // media query, independent of JS — if this effect stopped here for
      // reduced-motion users on a desktop-width screen, stages 2+ would
      // stay invisible forever with nothing left to reveal them. Force
      // every layer visible and drop the pinned layout entirely instead.
      wrap.style.height = "auto";
      layerRefs.current.forEach((layer) => {
        if (!layer) return;
        layer.style.opacity = "1";
        layer.style.position = "static";
      });
      return;
    }

    if (!isDesktop) return;

    const n = stages.length;
    const segment = 100 / n;
    const crossfade = segment * 0.28;

    layerRefs.current.forEach((layer, i) => {
      if (!layer) return;
      const startAt = i * segment;
      const endAt = (i + 1) * segment;

      let opacityKeyframes;
      if (i === 0) {
        opacityKeyframes = [
          { to: 1, duration: endAt - crossfade },
          { to: 0, duration: crossfade },
          { to: 0, duration: 100 - endAt },
        ];
      } else if (i === n - 1) {
        opacityKeyframes = [
          { to: 0, duration: startAt },
          { to: 1, duration: crossfade },
          { to: 1, duration: 100 - startAt - crossfade },
        ];
      } else {
        opacityKeyframes = [
          { to: 0, duration: startAt },
          { to: 1, duration: crossfade },
          { to: 1, duration: endAt - crossfade - (startAt + crossfade) },
          { to: 0, duration: crossfade },
          { to: 0, duration: 100 - endAt },
        ];
      }

      animate(layer, {
        opacity: opacityKeyframes,
        ease: "linear",
        autoplay: onScroll({
          target: wrap,
          enter: "top top",
          leave: "bottom bottom",
          sync: true,
        }),
      });
    });
  }, [stages.length]);

  return (
    <div ref={wrapRef} id={id} className="relative lg:h-[360vh]">
      <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden">
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
