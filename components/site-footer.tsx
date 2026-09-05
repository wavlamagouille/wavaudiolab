import MixerJack from "./mixer-jack";

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-line px-8 py-8">
      <MixerJack />
      <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-3.5 font-mono text-xs text-muted-2 md:flex-row">
        <span>© Wavaudiolab, Rolle CH</span>
        <div className="flex gap-5">
          <a className="transition-colors hover:text-text" href="https://instagram.com/wavaudiolab" target="_blank" rel="noopener">Instagram</a>
          <a className="transition-colors hover:text-text" href="https://soundcloud.com/user-626133450" target="_blank" rel="noopener">SoundCloud</a>
        </div>
      </div>
    </footer>
  );
}
