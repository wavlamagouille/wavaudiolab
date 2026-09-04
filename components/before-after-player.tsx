"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

// True gapless A/B: both tracks are loaded and always playing in sync —
// switching "Before"/"After" just flips which one is muted, so there's
// zero restart, zero gap, zero re-buffering. That's what makes an A/B
// comparison actually useful instead of annoying.
export default function BeforeAfterPlayer({
  beforeSrc = "/audio/before.mp3",
  afterSrc = "/audio/after.mp3",
  trackLabel = "Untitled — hard techno, 174 BPM",
}: {
  beforeSrc?: string;
  afterSrc?: string;
  trackLabel?: string;
}) {
  const beforeRef = useRef<HTMLAudioElement>(null);
  const afterRef = useRef<HTMLAudioElement>(null);
  const [mode, setMode] = useState<"before" | "after">("after");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(true);

  useEffect(() => {
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!before || !after) return;
    before.muted = mode !== "before";
    after.muted = mode !== "after";
  }, [mode]);

  useEffect(() => {
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!before || !after) return;

    const onError = () => setReady(false);
    before.addEventListener("error", onError);
    after.addEventListener("error", onError);

    const onTime = () => setProgress(before.currentTime);
    const onLoaded = () => setDuration(before.duration || 0);
    before.addEventListener("timeupdate", onTime);
    before.addEventListener("loadedmetadata", onLoaded);

    return () => {
      before.removeEventListener("error", onError);
      after.removeEventListener("error", onError);
      before.removeEventListener("timeupdate", onTime);
      before.removeEventListener("loadedmetadata", onLoaded);
    };
  }, []);

  function togglePlay() {
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!before || !after) return;
    if (playing) {
      before.pause();
      after.pause();
    } else {
      before.currentTime = after.currentTime; // keep them locked in sync
      before.play();
      after.play();
    }
    setPlaying(!playing);
  }

  function seek(t: number) {
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!before || !after) return;
    before.currentTime = t;
    after.currentTime = t;
    setProgress(t);
  }

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="rounded-2xl border border-line bg-panel p-6 sm:p-7">
      <audio ref={beforeRef} src={beforeSrc} preload="auto" />
      <audio ref={afterRef} src={afterSrc} preload="auto" />

      <div className="mb-5 flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.1em] text-muted">
          {trackLabel}
        </span>
        <span className="font-mono text-[11px] tracking-[0.1em] text-signal">
          A/B COMPARE
        </span>
      </div>

      {!ready ? (
        <div className="flex h-[120px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line-2 text-muted-2">
          <span className="font-mono text-[11px] tracking-[0.1em]">AUDIO PENDING</span>
          <span className="text-[12px]">Drop before.mp3 / after.mp3 into /public/audio</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-signal text-white transition-transform hover:scale-105"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>

            <div
              className="relative h-2 flex-1 cursor-pointer rounded-full bg-line"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const t = ((e.clientX - rect.left) / rect.width) * duration;
                seek(Math.max(0, Math.min(duration, t)));
              }}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-signal"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="relative flex rounded-full border border-line-2 bg-panel-2 p-1">
              <button
                onClick={() => setMode("before")}
                className={`relative z-10 rounded-full px-6 py-2 font-mono text-[13px] transition-colors ${
                  mode === "before" ? "text-ink" : "text-muted"
                }`}
              >
                Before
              </button>
              <button
                onClick={() => setMode("after")}
                className={`relative z-10 rounded-full px-6 py-2 font-mono text-[13px] transition-colors ${
                  mode === "after" ? "text-ink" : "text-muted"
                }`}
              >
                After
              </button>
              <div
                className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-signal transition-transform duration-200"
                style={{
                  transform: mode === "before" ? "translateX(4px)" : "translateX(calc(100% + 4px))",
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
