import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import RecDot from "@/components/rec-dot";

export const metadata: Metadata = {
  title: "Signal lost — Wavaudiolab",
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
        <div className="mb-6 flex items-center gap-2.5 font-mono text-[13px] tracking-[0.08em] text-muted">
          <RecDot /> SIGNAL LOST
        </div>
        <h1 className="font-display text-[clamp(80px,14vw,180px)] font-extrabold leading-[0.9] text-signal">
          404
        </h1>
        <p className="mt-5 max-w-md text-[15px] text-muted">
          Whatever you were looking for isn&apos;t here — dropped out
          somewhere in the signal chain. Might&apos;ve moved, might never
          have existed.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-line-2 px-6 py-[15px] font-mono text-[13.5px] transition-colors hover:border-signal hover:text-signal"
        >
          ← Back to the signal
        </Link>
      </div>
      <SiteFooter />
    </>
  );
}
