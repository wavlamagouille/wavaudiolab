import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ParticleButton from "@/components/kokonutui/particle-button";
import ProductHeroImage from "@/components/product-hero-image";
import { Stagger, StaggerItem } from "@/components/stagger";
import ScrollReveal from "@/components/scroll-reveal";
import CountUp from "@/components/count-up";
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
    openGraph: {
      title: `${product.title} — Wavaudiolab`,
      description: product.shortDescription,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} — Wavaudiolab`,
      description: product.shortDescription,
    },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription,
    brand: { "@type": "Brand", name: "Wavaudiolab" },
    offers: {
      "@type": "Offer",
      price: product.price.replace(/[^0-9.]/g, ""),
      priceCurrency: "CHF",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          <ProductHeroImage
            slug={product.slug}
            image={product.image}
            title={product.title}
            tagColor={product.tagColor}
          />

          <div className="flex flex-col">
            <Stagger>
              <StaggerItem className={`mb-3 font-mono text-[11px] tracking-[0.1em] ${tagColor}`}>
                {product.tag}
              </StaggerItem>
              <StaggerItem>
                <h1 className="mb-5 font-display text-[clamp(36px,4.4vw,56px)] font-extrabold leading-[0.98]">
                  {product.title}
                </h1>
              </StaggerItem>
              <StaggerItem>
                <p className="mb-8 max-w-md text-[15px] leading-relaxed text-muted">
                  {product.intro}
                </p>
              </StaggerItem>

              {product.warning && (
                <StaggerItem className="mb-8 rounded-xl border border-amber/30 bg-amber/[0.06] px-5 py-4 font-mono text-[12.5px] text-amber">
                  ⚠ {product.warning}
                </StaggerItem>
              )}

              <StaggerItem className="mb-8">
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
              </StaggerItem>

              <StaggerItem className="mt-auto flex flex-col gap-4 border-t border-line pt-7">
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
              </StaggerItem>
            </Stagger>
          </div>
        </div>

        {/* ---------- CONTENTS BREAKDOWN ---------- */}
        <div className="mt-20 pt-14">
          <div className="mb-10">
            <span className="font-mono text-[13px] tracking-wide text-signal">CONTENTS</span>
          </div>
          <ScrollReveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {product.contents.map((group) => {
              const match = group.count.match(/^(\d+)(.*)$/);
              return (
                <div
                  key={group.count}
                  className="rounded-2xl border border-line bg-panel p-6"
                >
                  <div className="mb-4 font-display text-xl font-bold text-text">
                    {match ? (
                      <CountUp value={parseInt(match[1], 10)} suffix={match[2]} />
                    ) : (
                      group.count
                    )}
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
              );
            })}
          </ScrollReveal>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
