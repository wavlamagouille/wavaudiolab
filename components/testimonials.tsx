const PLACEHOLDER_TESTIMONIALS = [
  {
    quote:
      "Sent over a rough mix I'd been stuck on for weeks and got back something that actually translated on my car system, my headphones, everywhere.",
    name: "Client name",
    role: "Placeholder — hard techno producer",
  },
  {
    quote:
      "Fast turnaround, clear communication the whole way, and the master hit exactly the loudness target I asked for without losing any punch.",
    name: "Client name",
    role: "Placeholder — schranz producer",
  },
  {
    quote:
      "Best money I've spent on a release. The stem mastering option gave me way more control than I expected for the price.",
    name: "Client name",
    role: "Placeholder — live act",
  },
];

export default function Testimonials() {
  return (
    <div>
      <div className="mb-3 font-mono text-[11px] tracking-[0.1em] text-amber">
        PLACEHOLDER CONTENT — swap in real client quotes here
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {PLACEHOLDER_TESTIMONIALS.map((t) => (
          <div
            key={t.name + t.role}
            className="flex flex-col rounded-2xl border border-line bg-panel p-6"
          >
            <div className="mb-4 flex gap-0.5 text-signal">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <p className="mb-5 flex-1 text-[14px] leading-relaxed text-muted">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="border-t border-line pt-4 font-mono text-[12px]">
              <div className="text-text">{t.name}</div>
              <div className="text-muted-2">{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
