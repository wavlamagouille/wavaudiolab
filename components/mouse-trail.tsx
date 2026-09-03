"use client";

import { useEffect, useRef } from "react";

interface TrailPoint {
  x: number;
  y: number;
  born: number;
  hue: number;
}

// Same two-color signal system as the beams background — mostly signal-red,
// a smaller share of VU-amber — so this reads as part of the same ambient
// system, not a separate effect bolted on.
function pickHue(): number {
  return Math.random() < 0.72 ? 350 + Math.random() * 12 : 28 + Math.random() * 14;
}

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<TrailPoint[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    // no persistent cursor on touch devices — nothing to trail behind
    if (reduceMotion || isCoarsePointer) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const LIFE_MS = 850;
    let lastAdd = 0;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastAdd < 14) return; // light throttle, still feels continuous
      lastAdd = now;
      pointsRef.current.push({ x: e.clientX, y: e.clientY, born: now, hue: pickHue() });
    };
    window.addEventListener("mousemove", onMove);

    function animate() {
      if (!(canvas && ctx)) return;
      const now = performance.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = "blur(20px)";

      pointsRef.current = pointsRef.current.filter((p) => now - p.born < LIFE_MS);

      pointsRef.current.forEach((p) => {
        const age = (now - p.born) / LIFE_MS;
        const opacity = (1 - age) * 0.3;
        const radius = 24 + age * 46;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        gradient.addColorStop(0, `hsla(${p.hue}, 88%, 58%, ${opacity})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 88%, 58%, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-1]"
    />
  );
}
