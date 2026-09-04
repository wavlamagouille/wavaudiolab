import { ImageResponse } from "next/og";
import { getProduct } from "@/lib/products";

export const alt = "Wavaudiolab product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  const accent = product?.tagColor === "amber" ? "#ffb020" : "#ff2e3e";

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
            background: `radial-gradient(circle at 20% 30%, ${accent}33, transparent 55%)`,
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginLeft: 80,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: accent,
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 24,
              color: "#9a9d9f",
              letterSpacing: 4,
              fontFamily: "monospace",
            }}
          >
            WAVAUDIOLAB
          </div>
        </div>
        {product && (
          <div
            style={{
              marginLeft: 80,
              fontSize: 22,
              color: accent,
              letterSpacing: 2,
              fontFamily: "monospace",
              display: "flex",
            }}
          >
            {product.tag}
          </div>
        )}
        <div
          style={{
            marginLeft: 80,
            marginTop: 12,
            fontSize: 76,
            fontWeight: 800,
            color: "#f2f1ee",
            lineHeight: 1,
            maxWidth: 1000,
            display: "flex",
          }}
        >
          {product ? product.title : "Wavaudiolab"}
        </div>
        {product && (
          <div
            style={{
              marginLeft: 80,
              marginTop: 24,
              fontSize: 40,
              fontWeight: 800,
              color: "#f2f1ee",
              display: "flex",
            }}
          >
            {product.price}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
