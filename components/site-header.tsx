import Link from "next/link";
import RecDot from "./rec-dot";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-2.5 font-mono text-sm font-semibold tracking-[0.06em]">
          <RecDot /> WAVAUDIOLAB
        </Link>
        <nav className="hidden gap-8 font-mono text-[13px] tracking-wide text-muted md:flex">
          <Link className="transition-colors hover:text-text" href="/#mixing">Mixing</Link>
          <Link className="transition-colors hover:text-text" href="/#mixing">Mastering</Link>
          <Link className="transition-colors hover:text-text" href="/#mixing">Packs</Link>
          <Link className="transition-colors hover:text-text" href="/#lab">The Lab</Link>
        </nav>
        <Link
          className="rounded-full border border-line-2 px-[18px] py-2.5 font-mono text-[13px] transition-colors hover:border-signal hover:text-signal"
          href="/#connect"
        >
          Start a project
        </Link>
      </div>
    </header>
  );
}
