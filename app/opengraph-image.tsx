import { ImageResponse } from "next/og";

export const alt = "Wavaudiolab — Mixing & Mastering Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0b0c0d",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 15% 20%, rgba(255,46,62,0.25), transparent 55%), radial-gradient(circle at 85% 85%, rgba(255,176,32,0.18), transparent 55%)",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginLeft: 80,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#ff2e3e",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 26,
              color: "#9a9d9f",
              letterSpacing: 4,
              fontFamily: "monospace",
            }}
          >
            WAVAUDIOLAB
          </div>
        </div>
        <div
          style={{
            marginLeft: 80,
            fontSize: 88,
            fontWeight: 800,
            color: "#f2f1ee",
            lineHeight: 0.98,
            display: "flex",
            flexDirection: "column",
            maxWidth: 980,
          }}
        >
          <div>Your track,</div>
          <div style={{ color: "#ff2e3e" }}>engineered to translate.</div>
        </div>
        <div
          style={{
            marginLeft: 80,
            marginTop: 28,
            fontSize: 28,
            color: "#9a9d9f",
            display: "flex",
          }}
        >
          Mixing &amp; mastering — hard techno studio, Switzerland
        </div>
      </div>
    ),
    { ...size }
  );
}
