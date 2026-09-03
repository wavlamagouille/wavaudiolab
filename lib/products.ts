export interface ProductContent {
  count: string; // e.g. "242 loops"
  items: string[];
}

export interface FullProduct {
  slug: string;
  title: string;
  shortDescription: string;
  price: string;
  tag: string;
  tagColor?: "signal" | "amber";
  image?: string;
  intro: string;
  contents: ProductContent[];
  deliveryNote: string;
  soundcloudUrl: string;
  warning?: string; // e.g. the "don't buy if you already own..." note on the racks bundle
}

export const products: FullProduct[] = [
  {
    slug: "essential-tools-vol-1",
    title: "Essential Tools Vol. 1",
    shortDescription:
      "Ableton racks, loops, and one-shots built from the modular rig — hard techno and schranz-leaning.",
    price: "29.99 CHF",
    tag: "RACKS + LOOPS + ONE-SHOTS",
    tagColor: "signal",
    image: "/packs/essential-tools-vol1.png",
    intro:
      "The first Essential Tools pack — built from the modular rig, drum machines, and hardware in the studio. Everything here is made to drop straight into a hard techno or schranz session.",
    contents: [
      {
        count: "242 loops",
        items: [
          "30 basslines",
          "30 melodies / lead synths",
          "11 pads",
          "56 percussion grooves",
          "78 textures / drones / noises",
          "37 top loops",
        ],
      },
      {
        count: "9 Ableton effect racks",
        items: [
          "basic treatment",
          "build up / breakdown (to be automated for best results)",
          "distortion",
          "FX texture maker (turn any percussion into an amazing FX)",
          "mid/side processing",
          "multiband splitter",
          "pad maker (turn literally any loop into a lush pretty pad)",
          "tonal metallic delay",
          "vocal shredder",
        ],
      },
      {
        count: "341 one-shots",
        items: [
          "37 claps / snares",
          "56 FX textures",
          "73 hi-hats / rides",
          "27 kicks",
          "53 percussion shots",
          "95 synth shots",
        ],
      },
    ],
    deliveryNote: "Download link delivered via email — may take a few minutes.",
    soundcloudUrl:
      "https://soundcloud.com/user-626133450/sets/wavaudiolab-essential-tools-vol1-by-wav_909-demo-tracks",
  },
  {
    slug: "essential-tools-vol-2",
    title: "Essential Tools Vol. 2",
    shortDescription:
      "A second round — new textures, new racks, same signal chain, no repeats from Vol. 1.",
    price: "29.99 CHF",
    tag: "RACKS + LOOPS + ONE-SHOTS",
    tagColor: "signal",
    image: "/packs/essential-tools-vol2.png",
    intro:
      "The second Essential Tools pack — a fresh set of racks and sounds, built the same way as Vol. 1 but with nothing carried over. Live 12 and up.",
    contents: [
      {
        count: "271 loops",
        items: [
          "27 basslines",
          "51 melodies / lead synths",
          "15 pads",
          "60 percussion grooves",
          "78 textures / drones / noises",
          "52 top loops",
        ],
      },
      {
        count: "11 Ableton effect racks",
        items: [
          "auto riser",
          "hyper spectral attack",
          "LFO box",
          "modulated bump and notch",
          "rider gain knob",
          "send and return device",
          "the drummerf*cker",
          "turbo LFO box",
          "turbo LFO EQ 1",
          "turbo LFO EQ 2",
          "turbo LFO EQ 3",
        ],
      },
      {
        count: "302 one-shots",
        items: [
          "55 claps / snares",
          "20 impacts",
          "71 hi-hats / rides",
          "26 kicks",
          "63 percussion shots",
          "67 synth shots",
        ],
      },
    ],
    deliveryNote: "Download link delivered via email — may take a few minutes.",
    soundcloudUrl: "https://soundcloud.com/user-626133450",
  },
  {
    slug: "essential-tools-bundle",
    title: "Vol. 1 + 2 Bundle",
    shortDescription: "Both packs together, 25% off buying them one at a time.",
    price: "44.99 CHF",
    tag: "25% OFF BUNDLED",
    tagColor: "amber",
    image: "/packs/bundle.png",
    intro:
      "Both Essential Tools packs together at 25% off. High-quality hard techno samples designed for producers — powerful kicks, dark synths, driving loops, and industrial FX. 100% royalty-free, ready to drop into your DAW.",
    contents: [
      { count: "Everything in Vol. 1", items: ["242 loops", "9 Ableton effect racks", "341 one-shots"] },
      { count: "Everything in Vol. 2", items: ["271 loops", "11 Ableton effect racks", "302 one-shots"] },
    ],
    deliveryNote: "Download link delivered via email — may take a few minutes.",
    soundcloudUrl:
      "https://soundcloud.com/user-626133450/sets/wavaudiolab-essential-tools-vol1-by-wav_909-demo-tracks",
  },
  {
    slug: "ableton-racks",
    title: "Racks Bundle",
    shortDescription:
      "20 Ableton effect racks from both volumes, for anyone who already has their own one-shots.",
    price: "11.99 CHF",
    tag: "ABLETON RACKS ONLY",
    tagColor: "signal",
    image: "/packs/racks-bundle.png",
    intro: "All the Ableton effect racks from Essential Tools Vol. 1 and Vol. 2, on their own. Ableton 12 compatible only.",
    contents: [
      {
        count: "20 Ableton effect racks",
        items: [
          "auto riser",
          "basic treatment",
          "build up / breakdown (to be automated for best results)",
          "distortion",
          "focused FX",
          "FX texture maker (turn any percussion into an amazing FX)",
          "hyper spectral attack",
          "mid/side processing",
          "modulated bump and notch",
          "multiband splitter",
          "pad maker (turn literally any loop into a lush pretty pad)",
          "pitched reverbs",
          "rider gain knob",
          "send return device",
          "super fattener",
          "the drummerf*cker",
          "tonal metallic delay",
          "turbo LFO box",
          "turbo LFO EQ",
          "vocal shredder",
        ],
      },
    ],
    deliveryNote: "Download link delivered via email — may take a few minutes.",
    soundcloudUrl: "https://soundcloud.com/user-626133450",
    warning: "Don't buy if you already own Essential Tools Vol. 1 and 2 — you already have this.",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
