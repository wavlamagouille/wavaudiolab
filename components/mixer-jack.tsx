// A small stylized analog-mixer input jack, positioned to align with
// where the signal cable's drawn path actually terminates (bottom of
// the whole page). Purely decorative SVG, no motion of its own — the
// payoff is the cable's plug appearing to land here once you've
// scrolled all the way down.
export default function MixerJack() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-3 left-8 z-10 hidden w-10 justify-center lg:flex"
    >
      <svg width="46" height="52" viewBox="0 0 46 52">
        <circle cx="23" cy="23" r="21" fill="#151618" stroke="#2a2c2e" strokeWidth="1.5" />
        <circle cx="23" cy="23" r="15" fill="#0b0c0d" />
        <circle
          id="mixer-jack-glow"
          cx="23"
          cy="23"
          r="10.5"
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="1"
          opacity="0.55"
          style={{ transition: "opacity 0.3s ease, stroke-width 0.3s ease" }}
        />
        <circle id="mixer-jack-socket" cx="23" cy="23" r="6" fill="#000" />
        <rect x="19" y="44" width="8" height="8" rx="1.5" fill="#151618" stroke="#2a2c2e" strokeWidth="1" />
      </svg>
    </div>
  );
}
