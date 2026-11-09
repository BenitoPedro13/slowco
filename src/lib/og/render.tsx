// Open Graph images (docs/10 B17). Used by every `opengraph-image.tsx` route file.
// STAND-IN type: ImageResponse ships a default sans, not Archivo (08 #2, the client's own wordmark
// is not available), so titles are set in the default bold sans, uppercase, in the drop accent.
// Photos are read from `public/` (EXIF already stripped by `pnpm images:import`) and inlined as
// data URIs: no network access at build time.

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { DropAccent } from "@/lib/theme/themes";
import { hasPlaceholderData } from "@/lib/catalog";
import { strings } from "@/content/strings";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Mirrors `src/styles/tokens.css` (`docs/02-VISUAL-IDENTITY.md` §3.2). Satori cannot read CSS vars.
const ACCENT_HEX: Record<DropAccent, string> = {
  vermelho: "#d4110d",
  roxo: "#9a4ea0",
  azul: "#2a48a0",
  verde: "#2bd65a",
};
const INK = "#0b0b0b";
const PAPER = "#f5f5f5";

async function photoDataUri(publicPath: string | undefined): Promise<string | null> {
  if (!publicPath || !publicPath.startsWith("/") || publicPath.includes("..")) return null;
  try {
    const buf = await readFile(join(process.cwd(), "public", publicPath));
    const type = publicPath.endsWith(".png") ? "image/png" : "image/jpeg";
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function renderOg({
  kicker,
  title,
  accent,
  photo,
  footer,
}: {
  kicker: string;
  title: string;
  accent: DropAccent;
  /** Path under `public/`, e.g. "/catalogo/slow-2025-08-24-01.jpg". */
  photo?: string;
  footer?: string;
}) {
  const color = ACCENT_HEX[accent];
  const img = await photoDataUri(photo);
  const placeholder = await hasPlaceholderData();
  const fontSize = title.length > 28 ? 64 : title.length > 16 ? 84 : 120;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: INK,
          color: PAPER,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: img ? 640 : 1200,
            padding: 56,
            borderLeft: `16px solid ${color}`,
          }}
        >
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 4 }}>{kicker.toUpperCase()}</div>
          <div
            style={{
              display: "flex",
              fontSize,
              fontWeight: 900,
              lineHeight: 0.95,
              textTransform: "uppercase",
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {placeholder ? (
              <div style={{ display: "flex", fontSize: 20 }}>{strings["G-EXEMPLO-CURTO"]}</div>
            ) : null}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, letterSpacing: 3 }}>
              <div style={{ display: "flex", fontWeight: 900, fontSize: 40, fontStyle: "italic" }}>{strings["G-WORDMARK"]}</div>
              <div style={{ display: "flex" }}>{(footer ?? strings["G-INSTAGRAM"]).toUpperCase()}</div>
            </div>
          </div>
        </div>
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="" width={560} height={630} style={{ width: 560, height: 630, objectFit: "cover" }} />
        ) : null}
      </div>
    ),
    { ...ogSize },
  );
}
