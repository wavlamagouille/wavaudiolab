"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import RecDot from "./rec-dot";
import { scrollToStage } from "@/lib/scroll-to-stage";

export default function SiteHeader() {
  const pathname = usePathname();

  function handleStageLink(name: string, e: React.MouseEvent) {
    if (pathname === "/") {
      e.preventDefault();
      scrollToStage(name);
    }
    // else: let the Link navigate normally to /#stage-<name>; the home
    // page itself picks up the hash on mount and scrolls there once the
    // stage stack has laid out
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-2.5 font-mono text-sm font-semibold tracking-[0.06em]">
          <RecDot /> WAVAUDIOLAB
        </Link>
        <nav className="hidden gap-8 font-mono text-[13px] tracking-wide text-muted md:flex">
          <Link
            className="transition-colors hover:text-text"
            href="/#stage-mixing"
            onClick={(e) => handleStageLink("mixing", e)}
          >
            Mixing
          </Link>
          <Link
            className="transition-colors hover:text-text"
            href="/#stage-mastering"
            onClick={(e) => handleStageLink("mastering", e)}
          >
            Mastering
          </Link>
          <Link
            className="transition-colors hover:text-text"
            href="/#stage-packs"
            onClick={(e) => handleStageLink("packs", e)}
          >
            Packs
          </Link>
          <Link className="transition-colors hover:text-text" href="/faq">FAQ</Link>
        </nav>
        <Link
          className="rounded-full border border-line-2 px-[18px] py-2.5 font-mono text-[13px] transition-colors hover:border-signal hover:text-signal"
          href="/studio"
        >
          Start a project
        </Link>
      </div>
    </header>
  );
}
