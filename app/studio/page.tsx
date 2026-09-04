import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio — Wavaudiolab",
  description: "Start a project, get a quote, and manage your mastering with Wavaudiolab.",
};

export default function StudioPage() {
  return (
    <div className="h-screen w-full bg-ink">
      <iframe
        src="https://wavmastering.vercel.app"
        title="Wavaudiolab Studio"
        className="h-full w-full border-0"
        allow="clipboard-write"
      />
    </div>
  );
}
