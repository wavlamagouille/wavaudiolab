"use client";

import { useEffect } from "react";
import Link from "next/link";
import ParticleButton from "@/components/kokonutui/particle-button";
import ProductGrid, { type Product } from "@/components/product-grid";
import ScrollProgress from "@/components/scroll-progress";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import RecDot from "@/components/rec-dot";
import StageStack from "@/components/stage-stack";
import BeforeAfterPlayer from "@/components/before-after-player";
import Testimonials from "@/components/testimonials";
import FlipCard from "@/components/flip-card";
import CountUp from "@/components/count-up";
import { products } from "@/lib/products";
import { scrollToStage } from "@/lib/scroll-to-stage";

const packs: Product[] = products.map((p) => ({
  slug: p.slug,
  title: p.title,
  description: p.shortDescription,
  price: p.price,
  tag: p.tag,
  tagColor: p.tagColor,
  image: p.image,
}));

export default function Home() {
  // arriving from another page via a header nav link (e.g. /#stage-mixing
  // from the FAQ page) — the stage stack needs a moment to lay out and
  // set its real height before a scroll target is meaningful, so this
  // waits a tick rather than trying immediately on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith("#stage-")) return;
    const name = hash.replace("#stage-", "");
    const timer = window.setTimeout(() => {
      scrollToStage(name);
    }, 150);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <ScrollProgress />

      {/* ---------- NAV ---------- */}
      <SiteHeader />

      {/* ---------- HERO / MIXING / MASTERING / PACKS / CONNECT — sticky crossfade on desktop ---------- */}
      <StageStack
        id="mixing"
        stages={[
          <div key="hero" className="mx-auto max-w-[1180px] px-8">
            <div className="mb-7 flex items-center gap-2.5 font-mono text-[13px] tracking-[0.08em] text-muted">
              <RecDot /> SIGNAL IN — WAVAUDIOLAB STUDIO, SWITZERLAND
            </div>
            <h1 className="max-w-[920px] font-display text-[clamp(52px,7.4vw,108px)] font-extrabold leading-[0.94] tracking-[0.005em]">
              Your track,<br />
              <span className="text-signal">engineered to translate.</span>
            </h1>
            <p className="mt-6 max-w-[520px] text-[17px] text-muted">
              Mixing and mastering for hard techno and beyond, run out of a real
              studio with real hardware — not a preset chain. Calibrated
              monitoring, three rounds of revisions, and a straight answer on
              what your track actually needs.
            </p>
            <div className="mt-9 flex flex-wrap gap-3.5">
              <Link href="/studio">
                <ParticleButton variant="signal" size="lg" className="font-mono text-[13.5px]">
                  Start a project
                </ParticleButton>
              </Link>
            </div>
          </div>,
          <div key="before-after" className="mx-auto w-full max-w-[640px]">
            <div className="mb-6 text-center">
              <h2 className="font-display text-[clamp(28px,3.4vw,40px)] font-extrabold leading-[0.98]">
                Hear it, don&apos;t just take our word for it.
              </h2>
              <p className="mt-3 text-[14.5px] text-muted">
                Same track, before and after. Flip between them and listen for
                yourself.
              </p>
            </div>
            <BeforeAfterPlayer />
          </div>,
          <div key="mixing" className="grid items-start gap-[70px] md:grid-cols-[1.1fr_.9fr]">
            <div>
              <h2 className="max-w-[460px] font-display text-[clamp(34px,4vw,54px)] font-extrabold leading-[0.94]">
                Balance, space, and punch — before mastering ever touches it.
              </h2>
              <p className="mt-5 max-w-[440px] text-[15.5px] text-muted">
                Stems in, a finished mix out. Priced by channel count, so a
                6-track idea and a 40-channel session aren&apos;t charged the
                same — you only pay for the complexity you actually bring.
              </p>
              <Link
                className="mt-7 inline-flex items-center gap-2 rounded-full border border-line-2 px-6 py-[15px] font-mono text-[13.5px] transition-colors hover:border-text"
                href="/studio"
              >
                Start a project
              </Link>
            </div>
            <FlipCard
              front={
                <div className="rounded-2xl border border-line bg-panel px-7 pt-6 pb-14">
                  <SpecRow k="Up to 9 channels" count={100} suffix=" CHF" />
                  <SpecRow k="Up to 14 channels" count={125} suffix=" CHF" />
                  <SpecRow k="Up to 19 channels" count={150} suffix=" CHF" />
                  <SpecRow k="Up to 29 channels" count={175} suffix=" CHF" />
                  <SpecRow k="Up to 49 channels" count={200} suffix=" CHF" />
                  <SpecRow k="50+ channels" count={250} suffix=" CHF" hi last />
                  <p className="mt-4 text-[12.5px] leading-relaxed text-muted-2">
                    Monitoring calibrated with Sonarworks Reference 4. Revisions
                    included until it&apos;s right.
                  </p>
                </div>
              }
              back={
                <div className="rounded-2xl border border-line bg-panel px-7 pt-6 pb-14">
                  <div className="mb-3 font-mono text-[11px] tracking-[0.1em] text-signal">
                    HOW THE TOOL WORKS
                  </div>
                  <ol className="space-y-3 text-[13.5px] leading-relaxed text-muted">
                    <li>
                      <span className="text-text">1. Sign in to the Studio</span> — one
                      account for every project, past and future.
                    </li>
                    <li>
                      <span className="text-text">2. Upload your stems</span> — however
                      you&apos;ve split them, plus a reference track if you
                      have one.
                    </li>
                    <li>
                      <span className="text-text">3. Note your channel count</span> — and
                      any direction on balance, space, or feel, then submit.
                    </li>
                    <li>
                      <span className="text-text">4. Track it from your dashboard</span> —
                      see the status and message directly if anything
                      needs adjusting.
                    </li>
                    <li>
                      <span className="text-text">5. Download your mix</span> — a 24-bit
                      WAV, ready for mastering.
                    </li>
                  </ol>
                </div>
              }
            />
          </div>,
          <div key="mastering" className="grid items-start gap-[70px] md:grid-cols-[.9fr_1.1fr]">
            <div className="md:order-2">
              <FlipCard
                front={
                  <div className="rounded-2xl border border-line bg-panel px-7 pt-6 pb-14">
                    <SpecRow k="Mastering, per track" count={25} suffix=" CHF" />
                    <SpecRow k="Stem mastering, per track" count={50} suffix=" CHF" />
                    <SpecRow k="Turnaround" v="Typically 2–4 days" hi />
                    <SpecRow k="Formats" v="WAV 24-bit" last />
                    <p className="mt-4 text-[12.5px] leading-relaxed text-muted-2">
                      Delivered with your loudness target hit and logged, not
                      guessed at.
                    </p>
                  </div>
                }
                back={
                  <div className="rounded-2xl border border-line bg-panel px-7 pt-6 pb-14">
                    <div className="mb-3 font-mono text-[11px] tracking-[0.1em] text-signal">
                      HOW THE TOOL WORKS
                    </div>
                    <ol className="space-y-3 text-[13.5px] leading-relaxed text-muted">
                      <li>
                        <span className="text-text">1. Sign in to the Studio</span> — one
                        account for every project, past and future.
                      </li>
                      <li>
                        <span className="text-text">2. Upload your premaster</span> — plus a
                        reference track and any notes on what you want out
                        of it.
                      </li>
                      <li>
                        <span className="text-text">3. Pick mastering or stem mastering</span> —
                        and submit, no back-and-forth emails needed.
                      </li>
                      <li>
                        <span className="text-text">4. Track it from your dashboard</span> —
                        see the status and message directly if anything
                        needs adjusting.
                      </li>
                      <li>
                        <span className="text-text">5. Download your master</span> — WAV
                        24-bit WAV, ready to release.
                      </li>
                    </ol>
                  </div>
                }
              />
            </div>
            <div className="md:order-1">
              <h2 className="max-w-[460px] font-display text-[clamp(34px,4vw,54px)] font-extrabold leading-[0.94]">
                Loud where it counts, clean everywhere else.
              </h2>
              <p className="mt-5 max-w-[440px] text-[15.5px] text-muted">
                Your premaster in, a release-ready master out — checked
                against your reference, checked in mono, checked on more than
                one system. Stem mastering available for finer control at the
                top of the chain.
              </p>
              <Link
                className="mt-7 inline-flex items-center gap-2 rounded-full border border-line-2 px-6 py-[15px] font-mono text-[13.5px] transition-colors hover:border-text"
                href="/studio"
              >
                Start a project
              </Link>
            </div>
          </div>,
          <div key="packs">
            <ProductGrid products={packs} />
          </div>,
          <div key="testimonials" className="w-full">
            <div className="mb-8 text-center">
              <h2 className="font-display text-[clamp(28px,3.4vw,40px)] font-extrabold leading-[0.98]">
                What people are saying.
              </h2>
            </div>
            <Testimonials />
          </div>,
          <div key="connect" id="connect" className="mx-auto max-w-[1180px] px-8 text-center">
            <div className="mx-auto flex items-center justify-center gap-2.5 font-mono text-[13px] tracking-[0.08em] text-muted">
              <RecDot /> SIGNAL OUT
            </div>
            <h2 className="mx-auto mt-5 max-w-[760px] font-display text-[clamp(40px,6vw,78px)] font-extrabold leading-[0.96]">
              Ready to send your track through?
            </h2>
            <p className="mx-auto mt-4 max-w-[460px] text-muted">
              Start a project or ask for a quote first — either way, you&apos;re
              talking to the person who&apos;ll actually work on it.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/studio">
                <ParticleButton variant="signal" size="lg" className="font-mono text-[13.5px]">
                  Start a project
                </ParticleButton>
              </Link>
            </div>
          </div>,
        ]}
      />

      <SiteFooter />
    </>
  );
}

function SpecRow({
  k,
  v,
  count,
  suffix,
  hi,
  last,
}: {
  k: string;
  v?: string;
  count?: number;
  suffix?: string;
  hi?: boolean;
  last?: boolean;
}) {
  return (
    <div className={`flex items-baseline justify-between py-[13px] font-mono text-[13.5px] ${last ? "" : "border-b border-line"}`}>
      <span className="text-muted">{k}</span>
      {count !== undefined ? (
        <CountUp value={count} suffix={suffix} className={hi ? "font-medium text-amber" : "font-medium text-text"} />
      ) : (
        <span className={hi ? "font-medium text-amber" : "font-medium text-text"}>{v}</span>
      )}
    </div>
  );
}


