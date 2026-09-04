"use client";

import { useEffect, useRef } from "react";
import { animate, onScroll } from "animejs";

// Numbers count up from 0 to their real value as they scroll into view,
// using anime.js's core numeric tweening (animate a plain object, write
// the interpolated value into the DOM on every tick) — a proper use of
// what the library is actually built for, not a text fade.
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

    const counter = { val: 0 };
    animate(counter, {
      val: value,
      round: 1,
      duration: 450,
      ease: "outExpo",
      onUpdate: () => {
        el.textContent = `${counter.val}${suffix}`;
      },
      autoplay: onScroll({
        target: el,
        enter: "bottom-=15% bottom",
      }),
    });
  }, [value, suffix]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
