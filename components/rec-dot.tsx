export default function RecDot() {
  return (
    <span className="relative inline-flex h-2 w-2 flex-none">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
    </span>
  );
}
