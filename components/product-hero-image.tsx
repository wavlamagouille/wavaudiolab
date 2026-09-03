"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function ProductHeroImage({
  slug,
  image,
  title,
  tagColor,
}: {
  slug: string;
  image?: string;
  title: string;
  tagColor?: "signal" | "amber";
}) {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line bg-panel">
      <div
        className="absolute inset-0 opacity-30 blur-3xl"
        style={{
          background:
            tagColor === "amber"
              ? "radial-gradient(circle at 50% 55%, #ffb020, transparent 70%)"
              : "radial-gradient(circle at 50% 55%, #ff2e3e, transparent 70%)",
        }}
      />
      {image ? (
        <motion.div layoutId={`pack-image-${slug}`} className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            className="relative object-contain p-10"
            sizes="(max-width: 768px) 90vw, 45vw"
            priority
          />
        </motion.div>
      ) : (
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 text-muted-2">
          <span className="font-display text-4xl font-extrabold text-line-2">W</span>
          <span className="font-mono text-[10.5px] tracking-[0.1em]">ART PENDING</span>
        </div>
      )}
    </div>
  );
}
