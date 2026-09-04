// A small stylized analog-mixer input jack, positioned to align with
// where the signal cable's drawn path actually terminates (bottom of the
// whole page). Purely decorative SVG, no motion of its own — the payoff
// is the cable's plug appearing to land here once you've scrolled all
// the way down.
export default function MixerJack() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-3 left-8 z-10 hidden w-10 justify-center lg:flex"
    >
      <svg width="46" height="52" viewBox="0 0 46 52">
        {/* mixer panel plate */}
        <rect x="2" y="2" width="42" height="48" rx="4" fill="#161719" stroke="#2f3235" strokeWidth="1.5" />
        {/* screws */}
        <circle cx="8" cy="8" r="1.6" fill="#3a3d40" />
        <circle cx="38" cy="8" r="1.6" fill="#3a3d40" />
        <circle cx="8" cy="44" r="1.6" fill="#3a3d40" />
        <circle cx="38" cy="44" r="1.6" fill="#3a3d40" />
        {/* socket ring */}
        <circle id="mixer-jack-socket" cx="23" cy="26" r="11" fill="#0b0c0d" stroke="#454850" strokeWidth="2" />
        <circle cx="23" cy="26" r="6.5" fill="#000000" />
        <circle
          id="mixer-jack-glow"
          cx="23"
          cy="26"
          r="6.5"
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="1"
          opacity="0.55"
          style={{ transition: "opacity 0.4s ease, stroke-width 0.4s ease" }}
        />
        {/* label */}
        <text
          x="23"
          y="15"
          textAnchor="middle"
          fontSize="5"
          fontFamily="var(--font-mono)"
          fill="#6b6e70"
          letterSpacing="0.5"
        >
          IN 1
        </text>
      </svg>
    </div>
  );
}
