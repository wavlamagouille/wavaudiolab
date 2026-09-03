import type { Metadata } from "next";
import "@fontsource/big-shoulders-display/600";
import "@fontsource/big-shoulders-display/700";
import "@fontsource/big-shoulders-display/800";
import "@fontsource/big-shoulders-display/900";
import "@fontsource/jetbrains-mono/400";
import "@fontsource/jetbrains-mono/500";
import "@fontsource/jetbrains-mono/600";
import "@fontsource/ibm-plex-sans/400";
import "@fontsource/ibm-plex-sans/500";
import "@fontsource/ibm-plex-sans/600";
import "./globals.css";
import PageTransition from "@/components/page-transition";
import BeamsBackground from "@/components/kokonutui/beams-background";
import MouseTrail from "@/components/mouse-trail";

export const metadata: Metadata = {
  title: "Wavaudiolab — Mixing & Mastering Studio",
  description:
    "Wavaudiolab — mixing, mastering, and sample packs from a hard techno studio in Switzerland. Engineered to translate, on any system.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-ink text-text">
        <BeamsBackground />
        <MouseTrail />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
