import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "FAQ — Wavaudiolab",
  description: "Common questions about mixing, mastering, turnaround, and the sample packs.",
  openGraph: {
    title: "FAQ — Wavaudiolab",
    description: "Common questions about mixing, mastering, turnaround, and the sample packs.",
    type: "website",
  },
};

const FAQS = [
  {
    q: "How long does mixing or mastering take?",
    a: "Mastering is typically 2–4 days. Mixing depends on the session's complexity, but I'll give you a realistic estimate before starting once I've seen your stems.",
  },
  {
    q: "How many revisions do I get?",
    a: "Mixing includes revisions until it's right — I'm not going to call it done if you're not happy with it. Mastering includes reasonable adjustment rounds if the target isn't quite there yet.",
  },
  {
    q: "What's the difference between mastering and stem mastering?",
    a: "Regular mastering works on your final stereo mix. Stem mastering works on grouped stems (drums, bass, synths, etc. — however you split them), giving finer control over the balance during the mastering stage itself, not just overall loudness and tone.",
  },
  {
    q: "What file formats do you need, and what do I get back?",
    a: "Send WAV files, 24-bit if possible. You'll get your master back as WAV, 24-bit and 16-bit versions, ready for release or further distribution.",
  },
  {
    q: "Do you master for streaming platforms specifically?",
    a: "Yes — loudness targets are considered as part of the process so your track translates properly once platforms apply their own normalization, not just loud for the sake of loud.",
  },
  {
    q: "What monitoring do you use?",
    a: "Yamaha HS8 monitors calibrated with Sonarworks Reference 4, so what's heard here is close to accurate rather than colored by the room.",
  },
  {
    q: "How do I pay?",
    a: "Payment details are sent once we've confirmed the scope of the project — get in touch to start.",
  },
  {
    q: "Do the sample packs need a specific Ableton version?",
    a: "Essential Tools Vol. 1's racks need Live 10 or later. Vol. 2 and the standalone racks pack need Live 12. The loops and one-shots themselves work in any DAW.",
  },
  {
    q: "I bought a pack but haven't received the download link.",
    a: "Download links are sent by email and can occasionally take a few minutes. If it's been longer than that, get in touch and it'll be sorted out directly.",
  },
];

export default function FAQPage() {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto max-w-[820px] px-8 py-16">
        <div className="mb-3 font-mono text-[13px] tracking-[0.1em] text-signal">FAQ</div>
        <h1 className="mb-10 font-display text-[clamp(34px,5vw,52px)] font-extrabold leading-[0.98]">
          Questions people actually ask.
        </h1>
        <div className="divide-y divide-line">
          {FAQS.map((item) => (
            <div key={item.q} className="py-6">
              <h2 className="mb-2 font-display text-[19px] font-bold">{item.q}</h2>
              <p className="text-[14.5px] leading-relaxed text-muted">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
