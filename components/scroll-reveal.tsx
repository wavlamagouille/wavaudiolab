"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

// Triggering and animating are two different jobs — this splits them
// properly instead of asking one scroll-synced tween to do both. The
// browser's own IntersectionObserver decides *when* (fires the instant
// any part of the element is visible, not once the whole thing is on
// screen, and with threshold:0 there's no scroll-position "sweet spot" to
// hit). anime.js just plays a normal, fixed-duration animation once
// triggered — so how fast or slow someone scrolls never matters.
export default function ScrollReveal({
  children,
  className,
  staggerMs = 60,
}: {
  children: React.ReactNode;
  className?: string;
  staggerMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const items = Array.from(el.children) as HTMLElement[];
    if (!items.length) return;
    items.forEach((item) => {
      item.style.opacity = "0";
    });

    const anim = animate(items, {
      opacity: [0, 1],
      translateY: [22, 0],
      duration: 550,
      ease: "outQuad",
      delay: stagger(staggerMs),
      autoplay: false,
    });

    let hasEnteredOnce = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasEnteredOnce = true;
          anim.play();
        } else if (hasEnteredOnce) {
          anim.reverse();
          anim.play();
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [staggerMs]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
