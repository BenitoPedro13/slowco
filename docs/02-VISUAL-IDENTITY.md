# 02 — Visual identity

First version, 2026-11-09 (`tasks/TASK-definition.md`). Owns: exact values (colour, type, spacing,
grid, motion tokens), the photo treatment and the rules for the client's marks. `04` places them,
`06` says where they live in code.

**Every value is provisional** until the client sends brand files (`08` #2). Colours were
**measured from the Instagram slides** (median of saturated pixels, Pillow, 2026-11-09, method in
§3.4), then tuned only as far as contrast required; type is an open-licence stand-in chosen to
match what the garments show. When the client's files arrive, they win and this doc is updated.

---

## 1. The synthesis

| Source | Takes from it |
| --- | --- |
| `@slow_tm` (`00` §B) | black/white garments, one accent per collection, the italic SLOW wordmark, legal-label lines, crumpled-paper posters with heavy condensed type, flash/street photography |
| OUTFIT (`00` §D.1), main reference | the *technique*: a tiny palette, huge type as the hero, a whole-site theme switch, a counter as the bag's signature. **Not** its cream `#ede4dd`, its red `#ff0001`, its layout, its loader or its wordmark break-up |
| Red and Green (`00` §D.3) | colour carried by photos (duotone, editorial only), a cursor as a gesture |
| Ethel Vaughn (`00` §D.2) | nothing visual in release 1 (the hero-object idea waits for the client's globe artwork, `08` #2) |

In one sentence: **a black-and-white store that switches mode, where one drop colour and the
photographs do the shouting, and the type is as loud as the back of a Slow hoodie.**

## 2. Marks

### 2.1 What exists (seen on garments and posts, `00` §B.3)

| Mark | Where seen | Status on the site |
| --- | --- | --- |
| Bold italic sans **SLOW** wordmark | hoodie backs, Reel 2023-08-01 title card, balaclavas | **client file needed** (`08` #2); typographic stand-in until then (§2.3) |
| Blackletter SLOW | trucker cap 2023-01-05, long sleeve 2023-07-31 | not used until a client file exists |
| Globe (wireframe earth) | Drop 1 tee and teaser (2021), 2025 crest | not used until a client file exists |
| SC / SLOW stacked monogram | 2024 sets, 2025 jersey, flag | not used until a client file exists |
| Crest "SLOW APPAREL COMPANY / ALWAYS WIN" | 2025 drop poster | not used until a client file exists |
| Racing badges (Slow Racing Club) | 2024-12-19 tees | not used |

### 2.2 Rules

1. **Never redraw, trace or re-letter any of the client's marks.** Only files the client sends
   (vector preferred) go into `public/brand/`, by a script that records the source (`06` §7).
2. A mark is never recoloured outside black, white and the current drop accent, never outlined,
   stretched, rotated or given effects (glow, chrome, 3D).
3. The accessible name of a mark is `Slow Company` (`01` rule 14).

### 2.3 Typographic stand-in (until `08` #2 is answered)

- The word `SLOW` set in **Archivo, weight 900, italic, width 125%** (§4), uppercase, tracking
  `-0.04em`. It is **text, not a drawing**: no hand-kerned outlines, no doubled shadow, no
  imitation of the client's letter shapes.
- In code it carries `data-standin="wordmark"` and a comment pointing here; `06` §7 lists every
  stand-in so the swap to the client file is one search.
- It may be shown in the hero and the header only.

## 3. Colour

### 3.1 Tokens

Base (all themes):

| Token | Hex | Derived from |
| --- | --- | --- |
| `ink` | `#0b0b0b` | black tee flat-lay (2024-10-04) median `#060606`; poster ink (2025-12-20) median `#1d1d1d`; set between, slightly lifted so photos with crushed blacks still read against it |
| `paper` | `#f5f5f5` | 2025 drop poster paper, median `#f5f5f5` (neutral, not cream) |
| `smoke` | `#949494` | secondary text on `ink` (6.49:1) |
| `ash` | `#5c5c5c` | secondary text on `paper` (6.13:1) |

Drop accents (one per drop; the drop record names it, `06` §3):

| Token | Hex | Measured from | Status |
| --- | --- | --- | --- |
| `vermelho` | `#d4110d` | red puffer 2023-06-16 `#e1100c`; 2025 "Slow Mode" shorts `#a20207` (in shade). Darkened from `#e1100c` so `paper` text on it passes 4.5:1 | **current drop accent** (2025 drops, newest wins, `CLAUDE.md` §3) **[confirm]** |
| `roxo` | `#9a4ea0` | globe print on the FLACKO tee 2021-08-13 `#a157a6`; trucker 2023-01-05 `#5f3875`. Darkened from `#a157a6` for 4.5:1 | 2021–2023 era |
| `azul` | `#2a48a0` | monogram set 2024-12-05 `#2a48a0`; racing badge 2024-12-19 `#02459d` | 2024 era |
| `verde` | `#2bd65a` | **not found on any garment.** The only saturated green is stage lighting (2024-01-13 `#049e2e`) and a jewel. Kept as a candidate because the brief names a neon green | **unconfirmed** (`08` #17): ships only if the client names a green drop |

Not adopted: OUTFIT's cream and red; navy `#17222a` (2025 jersey) as an accent (1.22:1 on `ink`,
it behaves as a dark neutral, usable in photos only); gradients; transparency greys for text
(contrast becomes unpredictable over photos).

### 3.2 Themes (the switch, `04` §3)

Three themes. `preto` and `branco` are the base; `drop` floods the page with the current drop's
accent. The text colour on `drop` is whichever of `ink`/`paper` contrasts more.

| Role (CSS var) | `preto` | `branco` | `drop` |
| --- | --- | --- | --- |
| `--canvas` (background) | `ink` | `paper` | the drop accent |
| `--content` (text, borders, focus ring) | `paper` | `ink` | `paper` for vermelho/roxo/azul, `ink` for verde |
| `--subtle` (secondary text) | `smoke` | `ash` | same as `--content` (no grey on a colour) |
| `--accent` (non-text emphasis: active swatch, counter tick, sold-out stroke) | the drop accent if ≥ 3:1 on `ink`, else `paper` | the drop accent if ≥ 3:1 on `paper`, else `ink` | `ink` if ≥ 3:1 on the accent, else `--content` |

**Default theme: `preto`** (black is the brand's base garment and the poster ink). The visitor's
choice persists (`04` §3.4).

### 3.3 Contrast matrix (WCAG 2.2, computed)

Computed 2026-11-09 with the WCAG 2.x relative-luminance formula (sRGB linearisation, threshold
0.04045, `(L1+0.05)/(L2+0.05)`). Thresholds: text 4.5:1 (1.4.3; every text role must pass it,
display sizes included), non-text UI 3:1 (1.4.11). In code the same check is
`pnpm check:contrast` (`06` §8), which reads the shipped CSS and fails below these thresholds.

| Drop accent | Theme | `--canvas` | `--content` | `--subtle` | `--accent` |
| --- | --- | --- | --- | --- | --- |
| vermelho | preto | `#0b0b0b` | `#f5f5f5` **18.05** | `#949494` **6.49** | `#d4110d` **3.64** |
| vermelho | branco | `#f5f5f5` | `#0b0b0b` **18.05** | `#5c5c5c` **6.13** | `#d4110d` **4.96** |
| vermelho | drop | `#d4110d` | `#f5f5f5` **4.96** | `#f5f5f5` **4.96** | `#0b0b0b` **3.64** |
| roxo | preto | `#0b0b0b` | `#f5f5f5` 18.05 | `#949494` 6.49 | `#9a4ea0` 3.72 |
| roxo | branco | `#f5f5f5` | `#0b0b0b` 18.05 | `#5c5c5c` 6.13 | `#9a4ea0` 4.85 |
| roxo | drop | `#9a4ea0` | `#f5f5f5` 4.85 | `#f5f5f5` 4.85 | `#0b0b0b` 3.72 |
| azul | preto | `#0b0b0b` | `#f5f5f5` 18.05 | `#949494` 6.49 | `#f5f5f5` 18.05 (blue on ink is 2.37, fails) |
| azul | branco | `#f5f5f5` | `#0b0b0b` 18.05 | `#5c5c5c` 6.13 | `#2a48a0` 7.60 |
| azul | drop | `#2a48a0` | `#f5f5f5` 7.60 | `#f5f5f5` 7.60 | `#f5f5f5` 7.60 (ink on blue is 2.37, fails) |
| verde | preto | `#0b0b0b` | `#f5f5f5` 18.05 | `#949494` 6.49 | `#2bd65a` 10.19 |
| verde | branco | `#f5f5f5` | `#0b0b0b` 18.05 | `#5c5c5c` 6.13 | `#0b0b0b` 18.05 (green on paper is 1.77, fails) |
| verde | drop | `#2bd65a` | `#0b0b0b` 10.19 | `#0b0b0b` 10.19 | `#0b0b0b` 10.19 (paper on green is 1.77, fails) |

Rejected while tuning: `#e1100c` (measured red) gives `paper` text 4.50:1, too close to the line;
`#a157a6` (measured purple) gives 4.35:1; `#8a8a8a` as `smoke` on `paper` 3.17:1.

### 3.4 How the colours were measured (reproducible)

For each named slide in `references/instagram/slow_tm/` (private): thumbnail to 400 px, keep
pixels in the hue range of the colour with HSV saturation ≥ 0.3–0.5 and value ≥ 0.2–0.45, take the
per-channel median. Photos are under uncontrolled light, so these are *approximations of the
fabric*, which is why the client's own colour files win (`08` #2).

### 3.5 Usage rules

4. A page uses **one** accent: the current drop's (or, on a drop page, that drop's).
5. Colour never carries meaning alone (`04` §8): states have text, sold-out sizes are struck
   through **and** labelled.
6. Product photos are never tinted (§6).

## 4. Typography

### 4.1 Faces

| Role | Face | Licence | Loaded via | Why |
| --- | --- | --- | --- | --- |
| Display, wordmark stand-in, body | **Archivo** (variable: `wght` 100–900, `wdth` 62–125, italic) | SIL OFL 1.1 (Omnibus-Type) | `next/font/google`, self-hosted at build; axes verified in `node_modules/next/dist/compiled/@next/font/dist/google/font-data.json` (2026-11-09) | one family covers the wide heavy italic of the wordmark (`wdth` 125), the condensed poster headlines (`wdth` 62) and readable body (`wdth` 100) |
| Labels, numbers, legal-label lines | **Geist Mono** (variable `wght`) | SIL OFL 1.1 (Vercel) | `next/font/google` | the garments' small caps label blocks; tabular figures for the counter, dates and prices |
| Blackletter accents | **UnifrakturMaguntia** 400 | SIL OFL 1.1 | `next/font/google`, **not loaded** until a task uses it | the brand's blackletter, only for archive numerals/years ≥ 32 px; never body, never the wordmark |

Not adopted: Anton/Bebas-style single-width condensed faces (Archivo's `wdth` axis covers it with
one file); Inter and Geist Sans from the 2025 prototype (generic).

### 4.2 Scale

Sizes in px; `vw`/`cqi` values are fluid with clamps. Stored text case per `01` §6.2 (no
`text-transform` on shipped strings).

| Token | Face / settings | Size | Line height | Tracking | Use |
| --- | --- | --- | --- | --- | --- |
| `wordmark` | Archivo 900 italic, `wdth` 125 | `25.5cqi` of the hero content box (measured in T1: advance width 96% of the box, italic ink inside it; 87px at 375px, 347px at 1440px) | 0.8 | −0.04em | hero only |
| `display-xl` | Archivo 800, `wdth` 62 | `clamp(56px, 12vw, 192px)` | 0.88 | −0.01em | drop name, drop state (`DISPONÍVEL AGORA`) |
| `display-l` | Archivo 800, `wdth` 62 | `clamp(40px, 7vw, 112px)` | 0.9 | 0 | section titles |
| `title` | Archivo 700, `wdth` 100 | 24px; 28px ≥ 1024px | 1.1 | −0.01em | product name |
| `body` | Archivo 400, `wdth` 100 | 16px | 1.5 | 0 | running text |
| `small` | Archivo 400, `wdth` 100 | 14px | 1.45 | 0 | helper text |
| `label` | Geist Mono 500, tabular figures | 12px; 13px ≥ 1024px | 1.3 | 0.06em | legal-label lines, states, prices, counters, nav |

Minimum shipped text size 12px. Text must reflow at 320 CSS px and survive 200% zoom (1.4.4,
1.4.10).

## 5. Layout primitives

### 5.1 Spacing scale (px)

`0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192`. Nothing else.

### 5.2 Grid and gutters

| Viewport | Columns | Gutter (also page margin) |
| --- | --- | --- |
| < 640px | 4 | 16px |
| 640–1023px | 8 | 24px |
| ≥ 1024px | 12 | 40px |

Full-bleed for the hero and photo bands; text measure max 68ch. Header height 56px (< 1024px),
64px (≥ 1024px).

### 5.3 Corners, borders, targets, focus

- Radius **0** everywhere (posters, labels, garments' print blocks are square). Exception: theme
  swatches and the cursor are circles.
- Borders 1px `--content`. No shadows.
- Pointer targets ≥ 24×24 CSS px (2.5.8); primary actions (`PEDIR NO WHATSAPP`, add to bag) ≥ 44px
  tall.
- Focus ring: `outline: 2px solid var(--content); outline-offset: 3px` on every theme (≥ 4.85:1
  against every canvas, §3.3). Never removed.

## 6. Photograph treatment

Two registers, as on the Instagram (`00` §B.3):

| Register | Where | Treatment |
| --- | --- | --- |
| **Product** (garment on plain ground or worn, garment readable) | product page, drop grid | natural colour, **never tinted or duotoned**; 4:5 crop (Instagram's 1080×1350); ground colour as shot |
| **Editorial** (street, flash, crowd, Reels stills) | home bands, drop intro, archive covers | may be shown black-and-white in `preto`/`branco` (the brand already posts B&W), or duotone in `drop`: `grayscale(1) contrast(1.1)` + a `--canvas` layer in `mix-blend-mode: multiply`. Static, never animated colour cycling |

All images: EXIF stripped (GPS, device), long edge ≤ 2400px at source, neutral filenames, alt text
per `05` §9. **People appear only with consent recorded** (`08` #9). Posters by other accounts
(e.g. the Pesadão flyer) are not used.

Paper texture: when a drop announcement needs the crumpled-paper feel, it is **our own** texture
(a static SVG `feTurbulence` noise at ≤ 6% opacity, or a paper photo Benito shoots), never the
client's poster files cut up without their source files. Not in release 1 unless a task names it.

## 7. Motion tokens

| Token | Value | Use |
| --- | --- | --- |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | entries, the counter roll, cursor growth |
| `--ease-in-out` | `cubic-bezier(0.76, 0, 0.24, 1)` | the theme wipe |
| `--dur-hover` | `120ms` | hover/press feedback |
| `--dur-ui` | `240ms` | small UI changes |
| `--dur-wipe` | `280ms` per half (560ms total) | theme wipe in, theme wipe out |
| `--dur-entry` | `720ms` | hero letters rising |
| `--stagger` | `60ms` | per letter |
| `--dur-count` | `480ms` | bag counter digit roll |
| theme change interval | ≥ `600ms` between two applied theme changes, any mode | flash safety (`04` §3.5) |

Nothing loops for more than 5 s without a pause control (`04` §8). No parallax on text.

## 8. Icons, favicon, share images

- One icon set: **Remix Icon** (`@remixicon/react`, already installed; `06` §6).
- Favicon and share image: **from the client's files only** (`08` #2). Until then the favicon is
  the repository's current `src/app/favicon.ico` (unbranded) and no share image is set.

## 9. Acceptance checks (implementation)

1. `pnpm check:contrast` passes for every theme × accent combination in §3.3.
2. A search for `data-standin` lists every stand-in; none ships in place of a client file once
   `08` #2 is answered.
3. No colour hex in components: every colour comes from a §3.2 role variable.
4. No `text-transform` on strings from `05`.
5. No image under `public/` with EXIF GPS or device tags (`06` §7 script).
