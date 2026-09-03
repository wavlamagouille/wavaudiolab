"use client";

import { useEffect } from "react";
import { animate, onScroll } from "animejs";
import BeamsBackground from "@/components/kokonutui/beams-background";
import ParticleButton from "@/components/kokonutui/particle-button";
import ProductGrid, { type Product } from "@/components/product-grid";
import ScrollProgress from "@/components/scroll-progress";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import RecDot from "@/components/rec-dot";
import { Stagger, StaggerItem } from "@/components/stagger";
import { products } from "@/lib/products";

const packs: Product[] = products.map((p) => ({
  slug: p.slug,
  title: p.title,
  description: p.shortDescription,
  price: p.price,
  tag: p.tag,
  tagColor: p.tagColor,
  image: p.image,
}));

function StageHead({ num, label }: { num: string; label: string }) {
  return (
    <div className="mb-13 flex items-baseline gap-4">
      <span className="font-mono text-[13px] tracking-wide text-signal">{num}</span>
      <span
        className="h-px flex-1 origin-left scale-x-0 bg-gradient-to-r from-signal to-line"
        data-signal-line
      />
      <span className="font-mono text-[13px] tracking-[0.14em] text-muted">{label}</span>
    </div>
  );
}

export default function Home() {
  // Each stage divider draws itself in as a real function of scroll position
  // — not "fade in when it enters view" (that's Motion's whileInView, used
  // nowhere here on purpose), but continuously scroll-scrubbed: scroll
  // halfway through a section, the line is halfway drawn. This is anime.js's
  // one genuinely distinct capability worth reaching for it specifically.
  useEffect(() => {
    const lines = document.querySelectorAll<HTMLElement>("[data-signal-line]");
    lines.forEach((el) => {
      animate(el, {
        scaleX: [0, 1],
        ease: "linear",
        autoplay: onScroll({
          target: el,
          enter: "bottom-=15% top",
          leave: "top+=10% bottom",
          sync: true,
        }),
      });
    });
  }, []);

  return (
    <>
      <ScrollProgress />

      {/* ---------- NAV ---------- */}
      <SiteHeader />

      {/* ---------- HERO (real Beams Background, recolored to brand) ---------- */}
      <BeamsBackground intensity="medium" className="pb-24 pt-24">
        <Stagger className="mx-auto max-w-[1180px] px-8">
          <StaggerItem className="mb-7 flex items-center gap-2.5 font-mono text-[13px] tracking-[0.08em] text-muted">
            <RecDot /> SIGNAL IN — WAVAUDIOLAB STUDIO, SWITZERLAND
          </StaggerItem>
          <StaggerItem>
            <h1 className="max-w-[920px] font-display text-[clamp(52px,7.4vw,108px)] font-extrabold leading-[0.94] tracking-[0.005em]">
              Your track,<br />
              <span className="text-signal">engineered to translate.</span>
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-6 max-w-[520px] text-[17px] text-muted">
              Mixing and mastering for hard techno and beyond, run out of a real
              studio with real hardware — not a preset chain. Calibrated
              monitoring, three rounds of revisions, and a straight answer on
              what your track actually needs.
            </p>
          </StaggerItem>
          <StaggerItem className="mt-9 flex flex-wrap gap-3.5">
            <ParticleButton variant="signal" size="lg" className="font-mono text-[13.5px]">
              Start a project
            </ParticleButton>
            <a
              className="inline-flex items-center gap-2 rounded-full border border-line-2 px-6 py-[15px] font-mono text-[13.5px] transition-colors hover:border-text"
              href="#connect"
            >
              Get a quote
            </a>
          </StaggerItem>
        </Stagger>
      </BeamsBackground>

      {/* ---------- STAGE 01 — MIXING ---------- */}
      <section className="border-t border-line py-24" id="mixing">
        <div className="mx-auto max-w-[1180px] px-8">
          <StageHead num="STAGE 01" label="MIXING" />
          <Stagger className="grid items-start gap-[70px] md:grid-cols-[1.1fr_.9fr]">
            <StaggerItem>
              <h2 className="max-w-[460px] font-display text-[clamp(34px,4vw,54px)] font-extrabold leading-[0.94]">
                Balance, space, and punch — before mastering ever touches it.
              </h2>
              <p className="mt-5 max-w-[440px] text-[15.5px] text-muted">
                Stems in, a finished mix out. Priced by channel count, so a
                6-track idea and a 40-channel session aren&apos;t charged the
                same — you only pay for the complexity you actually bring.
              </p>
              <a
                className="mt-7 inline-flex items-center gap-2 rounded-full border border-line-2 px-6 py-[15px] font-mono text-[13.5px] transition-colors hover:border-text"
                href="#connect"
              >
                Send your stems →
              </a>
            </StaggerItem>
            <StaggerItem className="rounded-2xl border border-line bg-panel px-7 py-6">
              <SpecRow k="Up to 9 channels" v="100 CHF" />
              <SpecRow k="Up to 14 channels" v="125 CHF" />
              <SpecRow k="Up to 19 channels" v="150 CHF" />
              <SpecRow k="Up to 29 channels" v="175 CHF" />
              <SpecRow k="Up to 49 channels" v="200 CHF" />
              <SpecRow k="50+ channels" v="250 CHF" hi last />
              <p className="mt-4 text-[12.5px] leading-relaxed text-muted-2">
                Monitoring calibrated with Sonarworks Reference 4. Revisions
                included until it&apos;s right.
              </p>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* ---------- STAGE 02 — MASTERING (flipped) ---------- */}
      <section className="border-t border-line py-24" id="mastering">
        <div className="mx-auto max-w-[1180px] px-8">
          <StageHead num="STAGE 02" label="MASTERING" />
          <Stagger className="grid items-start gap-[70px] md:grid-cols-[.9fr_1.1fr]">
            <StaggerItem className="rounded-2xl border border-line bg-panel px-7 py-6 md:order-2">
              <SpecRow k="Mastering, per track" v="25 CHF" />
              <SpecRow k="Stem mastering, per track" v="50 CHF" />
              <SpecRow k="Turnaround" v="Typically 2–4 days" hi />
              <SpecRow k="Formats" v="WAV 24/16-bit" last />
              <p className="mt-4 text-[12.5px] leading-relaxed text-muted-2">
                Delivered with your loudness target hit and logged, not
                guessed at.
              </p>
            </StaggerItem>
            <StaggerItem className="md:order-1">
              <h2 className="max-w-[460px] font-display text-[clamp(34px,4vw,54px)] font-extrabold leading-[0.94]">
                Loud where it counts, clean everywhere else.
              </h2>
              <p className="mt-5 max-w-[440px] text-[15.5px] text-muted">
                Your premaster in, a release-ready master out — checked
                against your reference, checked in mono, checked on more than
                one system. Stem mastering available for finer control at the
                top of the chain.
              </p>
              <a
                className="mt-7 inline-flex items-center gap-2 rounded-full border border-line-2 px-6 py-[15px] font-mono text-[13.5px] transition-colors hover:border-text"
                href="#connect"
              >
                Send your premaster →
              </a>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* ---------- STAGE 03 — SAMPLE PACKS (real product photography) ---------- */}
      <section className="border-t border-line py-24" id="packs">
        <div className="mx-auto max-w-[1180px] px-8">
          <StageHead num="STAGE 03" label="SAMPLE PACKS — OUTPUT" />
          <Stagger>
            <StaggerItem>
              <ProductGrid products={packs} />
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* ---------- THE LAB (inverted paper panel) ---------- */}
      <section className="border-t border-line bg-paper py-24 text-paper-ink" id="lab">
        <div className="mx-auto max-w-[1180px] px-8">
          <div className="mb-13 flex items-baseline gap-4">
            <span className="font-mono text-[13px] tracking-wide text-signal">STAGE 00</span>
            <span className="h-px flex-1 bg-paper-line" />
            <span className="font-mono text-[13px] tracking-[0.14em] text-[#7a756a]">
              THE LAB — SIGNAL SOURCE
            </span>
          </div>
          <Stagger className="grid gap-[70px] md:grid-cols-[.85fr_1.15fr]">
            <StaggerItem>
              <h2 className="font-display text-[clamp(32px,3.6vw,46px)] font-extrabold leading-[0.96] text-paper-ink">
                Real hardware. Real signal path.
              </h2>
              <p className="mt-5 max-w-[420px] text-[15px] text-[#4a473f]">
                Wavaudiolab is run by Florian Schären — SAE Institute
                Geneva-trained sound engineer, producer, and live act working
                mainly in hard techno and schranz. Every mix and master
                passes through monitoring calibrated with Sonarworks
                Reference 4, so what you hear here is close to what you&apos;ll
                hear anywhere.
              </p>
              <div className="mt-6 font-mono text-[12.5px] text-[#7a756a]">
                <b className="mb-1 block text-[14px] text-paper-ink">Florian Schären</b>
                .wav_909 — Rolle, Switzerland
              </div>
            </StaggerItem>
            <StaggerItem className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
              <GearGroup
                title="MODULAR & SYNTHESIS"
                items={["648HP modular system", "Behringer Model D", "Arturia MicroFreak", "Custom modular voice rack"]}
              />
              <GearGroup
                title="DRUM MACHINES & SAMPLERS"
                items={["Elektron Analog Rytm MKII", "Elektron Digitakt", "AKAI Force", "1010music Bitbox"]}
              />
              <GearGroup
                title="MONITORING"
                items={["Yamaha HS8 monitors", "Sonarworks Reference 4", "Beyerdynamic DT 770 Pro"]}
              />
              <GearGroup
                title="SOFTWARE"
                items={["Full mixing & mastering VST chain", "Ableton Live production environment"]}
              />
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* ---------- CONNECT ---------- */}
      <section className="px-8 py-24 text-center" id="connect">
        <Stagger>
          <StaggerItem className="mx-auto flex items-center justify-center gap-2.5 font-mono text-[13px] tracking-[0.08em] text-muted">
            <RecDot /> SIGNAL OUT
          </StaggerItem>
          <StaggerItem>
            <h2 className="mx-auto mt-5 max-w-[760px] font-display text-[clamp(40px,6vw,78px)] font-extrabold leading-[0.96]">
              Ready to send your track through?
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="mx-auto mt-4 max-w-[460px] text-muted">
              Start a project or ask for a quote first — either way, you&apos;re
              talking to the person who&apos;ll actually work on it.
            </p>
          </StaggerItem>
          <StaggerItem className="mt-8 flex justify-center">
            <ParticleButton variant="signal" size="lg" className="font-mono text-[13.5px]">
              Start a project
            </ParticleButton>
          </StaggerItem>
        </Stagger>
      </section>

      <SiteFooter />
    </>
  );
}

function SpecRow({ k, v, hi, last }: { k: string; v: string; hi?: boolean; last?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between py-[13px] font-mono text-[13.5px] ${last ? "" : "border-b border-line"}`}>
      <span className="text-muted">{k}</span>
      <span className={hi ? "font-medium text-amber" : "font-medium text-text"}>{v}</span>
    </div>
  );
}

function GearGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border-b border-paper-line py-4">
      <h4 className="mb-2.5 font-mono text-[11px] tracking-[0.08em] text-[#9a9484]">{title}</h4>
      <ul className="space-y-1.5 text-[13.5px] text-[#33312b]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
