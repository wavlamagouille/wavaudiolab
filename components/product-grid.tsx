"use client";

import Image from "next/image";
import { useState } from "react";

export interface Product {
  title: string;
  description: string;
  price: string;
  tag: string;
  tagColor?: "signal" | "amber";
  image?: string; // path in /public, e.g. "/packs/essential-tools-vol2.png"
}

function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const tagColor = product.tagColor === "amber" ? "text-amber" : "text-signal";

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] transition-colors duration-300 hover:border-white/16"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-panel-2">
        {product.image ? (
          <>
            <div
              className="absolute inset-0 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
              style={{
                background:
                  product.tagColor === "amber"
                    ? "radial-gradient(circle at 50% 60%, #ffb020, transparent 70%)"
                    : "radial-gradient(circle at 50% 60%, #ff2e3e, transparent 70%)",
              }}
            />
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="relative object-contain p-6 transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-2">
            <span className="font-display text-4xl font-extrabold text-line-2">W</span>
            <span className="font-mono text-[10.5px] tracking-[0.1em]">ART PENDING</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className={`mb-2 font-mono text-[10.5px] tracking-[0.08em] ${tagColor}`}>
          {product.tag}
        </div>
        <h3 className="mb-1.5 font-display text-[22px] font-bold leading-[1.05]">
          {product.title}
        </h3>
        <p className="mb-4 flex-1 text-[13px] text-muted">{product.description}</p>
        <div className="flex items-baseline justify-between border-t border-line pt-4 font-mono">
          <span className="text-[17px] text-text">{product.price}</span>
          <span className={`text-[12px] transition-transform ${hovered ? "translate-x-1" : ""} text-signal`}>
            View →
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.title} product={p} />
      ))}
    </div>
  );
}
