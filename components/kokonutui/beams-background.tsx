"use client";

/**
 * Adapted from KokonutUI's Beams Background (MIT licensed)
 * https://kokonutui.com — https://github.com/kokonut-labs/kokonutui
 * Original hue range swapped from blue/cyan to Wavaudiolab's signal-red +
 * VU-amber palette. Originally built to wrap just the hero as a section
 * background; now a standalone fixed layer rendered once at the site level
 * so it runs across the whole site, not just the home page's hero — same
 * pattern as the other ambient background layers (orbs, particles, grain).
 */

import { motion } from "motion/react";
import { useEffect, useRef } from "react";

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

// Wavaudiolab signal palette: most beams sit in the signal-red range
// (350-360), a smaller share in VU-meter amber (28-42) — a real two-color
// system instead of one hue band, matching the brand's actual accents.
function pickHue(): number {
  return Math.random() < 0.72 ? 350 + Math.random() * 12 : 28 + Math.random() * 14;
}

function createBeam(width: number, height: number): Beam {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.1 + Math.random() * 0.13,
    hue: pickHue(),
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  };
}

export default function BeamsBackground({
  intensity = "strong",
}: {
  intensity?: "subtle" | "medium" | "strong";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);
  // just the latest position, no history — updating a ref on mousemove is
  // essentially free, the actual cost would be in drawing more per frame,
  // which this keeps to exactly one extra gradient call
  const mouseRef = useRef({ x: -9999, y: -9999, active: 0 });
  const MINIMUM_BEAMS = 18;

  const opacityMap = {
    subtle: 0.6,
    medium: 0.8,
    strong: 1,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      // Capped, not the raw devicePixelRatio: this content is intentionally
      // soft and blurred, so full Retina resolution (2x on most MacBooks,
      // meaning 4x the actual pixels to process every frame) buys no
      // visible sharpness here, only extra CPU/GPU work.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);

      const totalBeams = MINIMUM_BEAMS * 1.5;
      beamsRef.current = Array.from({ length: totalBeams }, () =>
        createBeam(canvas.width, canvas.height)
      );
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    function onMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = 1;
    }
    if (!isCoarsePointer) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }

    function resetBeam(beam: Beam, index: number, totalBeams: number) {
      if (!canvas) return beam;
      const column = index % 3;
      const spacing = canvas.width / 3;

      beam.y = canvas.height + 100;
      beam.x =
        column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
      beam.width = 100 + Math.random() * 100;
      beam.speed = 0.5 + Math.random() * 0.4;
      beam.hue = pickHue();
      beam.opacity = 0.18 + Math.random() * 0.09;
      return beam;
    }

    function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);

      const pulsingOpacity =
        beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * opacityMap[intensity];

      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
      const saturation = "88%";
      const lightness = "58%";

      gradient.addColorStop(0, `hsla(${beam.hue}, ${saturation}, ${lightness}, 0)`);
      gradient.addColorStop(0.1, `hsla(${beam.hue}, ${saturation}, ${lightness}, ${pulsingOpacity * 0.5})`);
      gradient.addColorStop(0.4, `hsla(${beam.hue}, ${saturation}, ${lightness}, ${pulsingOpacity})`);
      gradient.addColorStop(0.6, `hsla(${beam.hue}, ${saturation}, ${lightness}, ${pulsingOpacity})`);
      gradient.addColorStop(0.9, `hsla(${beam.hue}, ${saturation}, ${lightness}, ${pulsingOpacity * 0.5})`);
      gradient.addColorStop(1, `hsla(${beam.hue}, ${saturation}, ${lightness}, 0)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    }

    function drawMouseGlow() {
      if (!ctx || mouseRef.current.active === 0) return;
      const { x, y } = mouseRef.current;
      const radius = 260;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      // same two-color signal system as the beams themselves, just a
      // single warm wash following the cursor rather than a full beam
      gradient.addColorStop(0, "hsla(358, 88%, 58%, 0.10)");
      gradient.addColorStop(0.5, "hsla(32, 88%, 58%, 0.05)");
      gradient.addColorStop(1, "hsla(32, 88%, 58%, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }

    function animate() {
      if (!(canvas && ctx)) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const totalBeams = beamsRef.current.length;
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < -100) {
          resetBeam(beam, index, totalBeams);
        }
        drawBeam(ctx, beam);
      });
      drawMouseGlow();

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      animate();
    } else {
      beamsRef.current.forEach((beam) => drawBeam(ctx, beam));
    }

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      window.removeEventListener("mousemove", onMouseMove);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [intensity]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[-2] overflow-hidden" aria-hidden="true">
      <canvas className="absolute inset-0" ref={canvasRef} style={{ filter: "blur(18px)" }} />
      <motion.div
        animate={{ opacity: [0.03, 0.09, 0.03] }}
        className="absolute inset-0 bg-ink/10"
        style={{ backdropFilter: "blur(40px)" }}
        transition={{ duration: 10, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
      />
    </div>
  );
}
