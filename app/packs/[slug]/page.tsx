import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ParticleButton from "@/components/kokonutui/particle-button";
import { products, getProduct } from "@/lib/products";

export const dynamicParams = false;

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.title} — Wavaudiolab`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const tagColor = product.tagColor === "amber" ? "text-amber" : "text-signal";

  return (
    <>
      <SiteHeader />

      <div className="mx-auto max-w-[1180px] px-8 py-14">
        <Link
          href="/#packs"
          className="mb-10 inline-flex items-center gap-2 font-mono text-[13px] text-muted transition-colors hover:text-text"
        >
          ← All packs
        </Link>

        {/* ---------- HERO: image + summary ---------- */}
        <div className="grid gap-14 md:grid-cols-2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line bg-panel">
            <div
              className="absolute inset-0 opacity-30 blur-3xl"
              style={{
                background:
                  product.tagColor === "amber"
                    ? "radial-gradient(circle at 50% 55%, #ffb020, transparent 70%)"
                    : "radial-gradient(circle at 50% 55%, #ff2e3e, transparent 70%)",
              }}
            />
            {product.image ? (
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="relative object-contain p-10"
                sizes="(max-width: 768px) 90vw, 45vw"
                priority
              />
            ) : (
              <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 text-muted-2">
                <span className="font-display text-4xl font-extrabold text-line-2">W</span>
                <span className="font-mono text-[10.5px] tracking-[0.1em]">ART PENDING</span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className={`mb-3 font-mono text-[11px] tracking-[0.1em] ${tagColor}`}>
              {product.tag}
            </div>
            <h1 className="mb-5 font-display text-[clamp(36px,4.4vw,56px)] font-extrabold leading-[0.98]">
              {product.title}
            </h1>
            <p className="mb-8 max-w-md text-[15px] leading-relaxed text-muted">
              {product.intro}
            </p>

            {product.warning && (
              <div className="mb-8 rounded-xl border border-amber/30 bg-amber/[0.06] px-5 py-4 font-mono text-[12.5px] text-amber">
                ⚠ {product.warning}
              </div>
            )}

            <div className="mb-8">
              <div className="mb-3 font-mono text-[11px] tracking-[0.1em] text-muted">
                DEMOS — made entirely with this pack
              </div>
              <div className="overflow-hidden rounded-xl border border-line">
                <iframe
                  title={`${product.title} — SoundCloud demos`}
                  width="100%"
                  height="220"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                    product.soundcloudUrl
                  )}&color=%23ff2e3e&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`}
                />
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-4 border-t border-line pt-7">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[13px] text-muted">Price</span>
                <span className="font-display text-3xl font-extrabold">{product.price}</span>
              </div>
              <ParticleButton variant="signal" size="lg" className="w-full font-mono text-[13.5px]">
                Buy now
              </ParticleButton>
              <p className="text-center font-mono text-[11px] text-muted-2">
                {product.deliveryNote}
              </p>
            </div>
          </div>
        </div>

        {/* ---------- CONTENTS BREAKDOWN ---------- */}
        <div className="mt-20 border-t border-line pt-14">
          <div className="mb-10 flex items-baseline gap-4">
            <span className="font-mono text-[13px] tracking-wide text-signal">CONTENTS</span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {product.contents.map((group) => (
              <div
                key={group.count}
                className="rounded-2xl border border-line bg-panel p-6"
              >
                <div className="mb-4 font-display text-xl font-bold text-text">
                  {group.count}
                </div>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-2.5 font-mono text-[13px] text-muted"
                    >
                      <span className="text-signal">–</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
