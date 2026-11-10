# P1 — First-load weight: font preloads and image format

Source: open item in `docs/STATUS.md` (B1 LCP target < 2.5 s; archive LCP follow-up).
Started 2026-11-09.

## Current scenario (measured, throttled 390px profile: 150 ms RTT, 200000 B/s, CPU ×4)

- Home LCP ≈ 2.72 s, element = hero photo (`_next/image … w=640`, WebP 55 KB).
- Archive LCP ≈ 3.88 s, element = first poster photo (WebP 102 KB, `priority`).
- On both pages **401 KB of fonts** download first: six preloaded woff2 files, because both
  `next/font/google` calls list `subsets: ["latin", "latin-ext"]` (Archivo normal + italic with
  the width axis, Geist Mono). Images: 384 KB (home) / 211 KB (archive), WebP only.

## Planned changes

1. `subsets: ["latin"]` for Archivo and Geist Mono. Per the installed docs
   (`node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md`, `subsets`), the
   option only decides which subsets are **preloaded**; the `latin-ext` faces stay declared with
   their `unicode-range` and load on demand if a character needs them. pt-BR copy (ã, ç, é, õ, ú,
   ·, –, —) is inside the `latin` range.
2. `images.formats: ["image/avif", "image/webp"]` in `next.config.ts` (installed `image.md`,
   `formats`): AVIF where the browser accepts it, WebP otherwise. No change to sizes or sources.

## Verification

Same diagnostic script before/after (LCP element, bytes by type), three LCP samples per page;
full e2e suite (fonts and images render in every existing screenshot/axe test); a screenshot
of the hero and the archive to check type and image quality by eye.

## Results (2026-11-09)

Same throttled profile and scripts, production build, image cache warmed once:

| Page | LCP before | LCP after (3 runs) | Fonts | Images |
| --- | --- | --- | --- | --- |
| `/` | 2716–2748 ms | 1376 / 1392 / 1400 ms | 401 → 211 KB | 384 → 215 KB |
| `/arquivo` | 3880 ms | 1904 / 1900 / 1888 ms | 401 → 211 KB | 211 → 118 KB |
| `/produtos/peca-de-exemplo-04` | 1952–2160 ms (B7 notes) | 1080 / 1012 / 1020 ms | — | — |

LCP elements unchanged (hero photo; first archive poster). Script bodies unchanged (≈ 657 KiB
uncompressed, 172 KB transferred). **B1's < 2.5 s target is met on this profile** for all three
pages. These are local lab samples (Chromium, one machine), not field data or Lighthouse.
Hero and archive screenshots reviewed: AVIF quality and all three font faces render as before.
Note: the first request for each AVIF size is encoded on the server (slower once, then
cached); a CDN/host cache makes that a one-time cost per deploy. Full suite: 124 passed.
