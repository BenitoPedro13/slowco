# 06 — Architecture

First version, 2026-11-09 (`tasks/TASK-definition.md`). Owns: stack and versions, file layout,
the catalogue interface, client state, the WhatsApp link, theme mechanics, images, libraries,
tests, and what happens to the 2025 Shopify code. Behaviour is in `04`, values in `02`, strings
in `05`.

Principles (binding, `~/.claude/CLAUDE.md`, `CLAUDE.md` §5): Server Components by default,
`'use client'` only at leaves; every hook wrapped in a named hook; no reflexive memoisation;
`useEffect` only to sync with an external system; **no new server state** (the catalogue is read
on the server, nothing is fetched from the browser, so TanStack Query is not used); WCAG 2.2 AA.

---

## 1. Stack

### 1.1 Versions (checked against the npm registry, 2026-11-09)

| Package | Installed now | Latest (published) | Target | When |
| --- | --- | --- | --- | --- |
| next | 15.5.4 | 16.4.5 (2026-11-03) | 16.4.5 | T2 |
| react, react-dom | 19.1.0 | 19.3.1 (2026-10-14) | 19.3.1 | T2 |
| eslint-config-next | 15.5.4 | 16.4.5 | 16.4.5 (peer `eslint >=9`) | T2 |
| eslint | 9.36.0 | 10.14.0 | **9.39.5** (stay on 9 until the Next config is verified on 10) | T2 |
| typescript | 5.9.2 | 7.0.2 | **5.9.3** (`[VERIFY: Next 16.4 support for TypeScript 7 before moving]`) | T2 |
| tailwindcss, @tailwindcss/postcss | 4.1.13 | 4.3.5 (2026-11-06) | 4.3.5 | T2 |
| @types/node | 20.x | — | 24.x (Node in use: v24.22.2; next 16 needs ≥ 20.9) | T2 |
| @playwright/test | — | 1.65.0 (2026-11-05) | 1.65.0 | T1 |
| @axe-core/playwright | — | 4.14.0 (2026-10-15) | 4.14.0 | T1 |
| vitest | — | 5.1.0 (2026-11-02; node `^22.12 \|\| ^24`) | 5.1.0 + `vite` 8.3.6 (required peer `^6 \|\| ^7 \|\| ^8`, checked T3) | T3 |
| shadcn (CLI, not a dependency) | — | 4.23.0 | `pnpm dlx shadcn@4.23.0` | T4 |
| gsap | — | 3.15.1 | only if T6/T9 needs a timeline | T6/T9 |
| lenis | — | 1.3.27 | only with a scroll-driven moment; off under reduced motion | T6/T9 |
| next-themes | — | 0.4.6 (2025-03-11, no release in 20 months) | **not used** (§6) | — |
| zustand, @tanstack/react-query | — | 5.1.0, 5.107.1 | **not used** (§4, §1 principles) | — |

Package manager: **pnpm 12.15.0** (installed). pnpm 12 refuses dependency build scripts unless
approved: `pnpm-workspace.yaml` holds `allowBuilds` for `@tailwindcss/oxide`, `sharp`,
`unrs-resolver` (approved 2026-11-09 with `pnpm approve-builds <names>`). The file was in
`.gitignore` (2025 scaffold); T1 removes that line so a fresh clone installs.

### 1.2 Scripts (`package.json`)

| Script | Command | Added |
| --- | --- | --- |
| `dev`, `build`, `start`, `lint` | as today | — |
| `typecheck` | `tsc --noEmit` | T1 |

ESLint ignores `references/**`, `.venv-ig/**`, `playwright-report/**`, `test-results/**` (T1; before
that, linting read the private saved sites: 12,322 problems).
| `check:contrast` | `node scripts/check-contrast.mjs` | T1 |
| `test:e2e` | `playwright test` | T1 |
| `test` | `vitest run` | T3 |

## 2. File layout (target; new code only)

```
src/
  app/
    layout.tsx            fonts, <html lang="pt-BR" data-theme data-drop-accent>, theme script
    page.tsx              /
    drops/[slug]/page.tsx  arquivo/page.tsx  produtos/[slug]/page.tsx  sacola/page.tsx  contato/page.tsx
  styles/tokens.css        02 tokens: base, themes × accents, motion, type utilities
  content/
    strings.ts             05 strings by ID (typed object), the only place UI copy lives
    catalog.ts             the static catalogue data (T3; empty until 08 #7)
  lib/
    catalog/{types.ts,index.ts,static-provider.ts}
    whatsapp/{build-url.ts,format-message.ts}
    bag/store.ts           bag external store (T4)
    theme/{themes.ts,theme-store.ts,init-script.ts}
    time/clock-store.ts    clock external store for drop mode (T6)
  hooks/                   use-theme-switch.ts, use-bag.ts, use-now.ts, use-reduced-motion.ts …
  components/
    hero/hero.tsx          server
    theme/theme-switch.tsx client leaf
    bag/…  drop/…  product/…  layout/…
scripts/check-contrast.mjs  scripts/images/prepare.py
e2e/*.spec.ts              playwright.config.ts
```

Import rules: `components` never import from `content/catalog.ts` directly (only through
`lib/catalog`); nothing imports from `references/`; no file outside `lib/catalog` knows the data
source; no Shopify type anywhere in new code.

## 3. Catalogue interface (T3)

```ts
// src/lib/catalog/types.ts
export type Availability = "em-breve" | "disponivel" | "esgotado";
export type DropAccent = "vermelho" | "roxo" | "azul" | "verde";

export type Drop = {
  slug: string;
  name: string;
  releaseAt: string;        // ISO 8601 with offset, e.g. America/Sao_Paulo (-03:00)
  accent: DropAccent;
  text?: string;            // the client's own drop text
  limited?: boolean;        // 01 rule 17, only if the client says so
  noRestock?: boolean;
};

export type Size = { label: string; availability: Availability };

export type Product = {
  slug: string;
  dropSlug: string;
  name: string;
  price?: { cents: number };   // absent → not rendered (05 P-PRECO)
  description?: string;
  color?: string;
  sizes: Size[];
  availability: Availability;  // product-level; "esgotado" when every size is
  notForSale?: boolean;
  images: { src: string; alt: string; width: number; height: number }[];
};

// src/lib/catalog/index.ts (server-only)
export function getDrops(): Promise<Drop[]>;                   // newest releaseAt first
export function getDrop(slug: string): Promise<Drop | null>;
export function getProducts(filter?: { dropSlug?: string; availability?: Availability }): Promise<Product[]>;
export function getProduct(slug: string): Promise<Product | null>;
export function getCurrentDrop(): Promise<Drop | null>;      // newest drop with releaseAt ≤ now + 30 days, else newest
```

- **Provider:** `static-provider.ts` reads `src/content/catalog.ts` (typed TS data, validated by
  `tsc` and a unit test: unique slugs, every product's `dropSlug` exists, image files exist).
  A future Shopify provider implements the same functions (`08` #12); nothing else changes.
- Async signatures on purpose, so a remote provider is a drop-in.
- No `server-only` guard (T3 decision): the data is public; client components never import
  `lib/catalog/index.ts`, they get `getCatalogIndex()` output as props.
- **Placeholder catalogue** until `08` #7/#14 (T3, default assumed by Claude, `08` #22): every
  record has `placeholder: true`, names say `EXEMPLO`, sizes `A/B/C`, no prices or photos,
  `releaseAt` relative to the build (−400 d, −60 d, +3 d) so all drop states exist. The layout
  shows `G-EXEMPLO` while any placeholder exists; `pnpm check:launch` fails on it. E2E runs on
  this data; there is no separate fixture or `CATALOG_SOURCE`. An empty catalogue is still a
  valid state (pages render their empty states).
- **Drop state is derived, not stored:** `deriveDropState(drop, products, now)` (pure, unit-tested)
  implements `04` §5. Time-dependent UI is a client leaf fed by `useNow()` (a clock external store
  via `useSyncExternalStore`, server snapshot `null` → the server HTML shows only the absolute
  date). Pages stay static (`generateStaticParams`); a catalogue change is a commit + deploy.

## 4. Bag (client state, T4)

- **What:** lines `{ productSlug, size, quantity }`. Product details are looked up in a small
  catalogue index the server passes to the bag page as props.
- **Where:** a `BagProvider` (client, in the root layout) creates **one store per mount**
  (`useState(() => createBagStore())`), never a module-level singleton. The store is an external
  store over `localStorage` key `slow:sacola` (read lazily in the browser, `storage` event for
  other tabs). Components read it only through `useBag()`, `useBagCount()`, `useBagActions()`
  (`useSyncExternalStore` inside; server snapshot = empty bag).
- **Why not Zustand:** the bag changes on clicks, not every tick; three readers. The global rule
  reserves Zustand for high-frequency state. Why not a server cart: release 1 stores no customer
  data (`CLAUDE.md` §4), and there is no checkout server-side.
- Cap: quantity 1–10 per line `[confirm with client, 08 #7]`.

## 5. WhatsApp link (T3)

Verified 2026-11-09 against WhatsApp's FAQ (https://faq.whatsapp.com/5913398998672934):
`https://wa.me/<number>?text=<url-encoded text>`, number in full international format, **no `+`,
no leading zeros, no brackets or dashes** (example given: `https://wa.me/55XXXXXXXXXXX`).

```ts
// src/lib/whatsapp/build-url.ts
export function normalizeWhatsAppNumber(raw: string | undefined): string | null; // digits only, 10–15, else null
export function buildWhatsAppUrl(number: string, message?: string): string;
//   `https://wa.me/${number}` + (message ? `?text=${encodeURIComponent(message)}` : "")
// src/lib/whatsapp/format-message.ts
export function formatOrderMessage(input: {
  lines: { product: string; drop: string; size: string; quantity: number; price?: string }[];
  name?: string;
  single?: boolean;
}): string; // assembles 05 §8 exactly
```

- The number comes from `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER` (read in one place,
  `src/lib/config.ts`); missing/invalid → `null` → buttons not rendered, `B-SEM-NUMERO` shown.
- The link opens in the same tab (`<a href>`, no `window.open`); on phones it hands off to the app.
- Unit tests: encoding of `\n`, `/`, accents (`Olá`, `ç`), `&` and `?` in names; number
  normalisation (`+55 (21) 9…` → digits); single vs bag message; optional price and name.

## 6. Theme mechanics (T1)

- **State lives in the DOM**: `<html data-theme data-drop-accent>`; storage `localStorage`
  `slow:tema`. `src/lib/theme/theme-store.ts` exposes `subscribe`, `getSnapshot` (reads the
  attribute), `getServerSnapshot` (returns `null`), `applyTheme(theme)` (sets the attribute,
  writes storage, notifies). It touches `document` only inside functions, so it is safe to import
  on the server.
- **No-flash init**: `src/lib/theme/init-script.ts` exports a tiny IIFE string rendered as
  `<script dangerouslySetInnerHTML>` first in `<head>`; it reads storage and sets `data-theme`
  before paint. `<html suppressHydrationWarning>` because the attribute may differ from the
  server's. `[VERIFY in T1: no React warning for an inline <script> in the root layout's <head>
  on Next 15.5 / React 19.1; recheck in T2 on Next 16]`.
- **Why not next-themes:** it would do the same (attribute + storage + script), but has had no
  release since 2025-03-11 and React 19.2+ warns on scripts rendered inside client components
  `[VERIFY if next-themes is reconsidered]`. Ours is ~40 lines with no widget logic; the widget
  itself is native radios (`04` §3.3), which is what the "prefer a vetted library" rule protects.
- **Hook**: `useThemeSwitch()` in `src/hooks/use-theme-switch.ts` returns `{ theme, requested,
  select, wipeRef }`; it reads the store with `useSyncExternalStore`, owns the 600ms throttle and
  coalescing, and runs the wipe with the Web Animations API (`element.animate`) on the overlay.
  Reduced motion is read at call time with `matchMedia` (no effect needed). No GSAP for this.
- **Tokens** in `src/styles/tokens.css`, imported by `globals.css` after Tailwind and the legacy
  AlignUI tokens. Roles exposed to Tailwind with `@theme inline` as `--color-canvas`,
  `--color-content`, `--color-subtle`, `--color-accent` (names checked free in the legacy CSS).
  A plain unlayered `html[data-theme] body { … }` rule sets background, colour and font, because
  the legacy unlayered `body {}` rule in `globals.css` would otherwise beat Tailwind's layered
  utilities.
- `data-drop-accent` comes from `CURRENT_DROP_ACCENT` in `src/lib/theme/themes.ts` (`"vermelho"`,
  `02` §3.1) until T3, then from `getCurrentDrop()`.

## 7. Images and brand files

- Product and editorial images are **local files** in `public/catalogo/` and `public/editorial/`,
  produced by `scripts/images/prepare.py` (Pillow, run with the `.venv-ig` interpreter or any
  Python with Pillow): input = the list in `05` §9 (source path in `references/` or a client file),
  output = re-encoded JPEG (quality 85, long edge ≤ 2400px), **all EXIF/XMP/ICC metadata dropped
  except the sRGB profile**, neutral filenames. A check mode (`--check public/`) fails on any file
  with GPS or device tags. T5.
- `next/image` serves them (local, so `images.remotePatterns` is not needed: the Shopify and
  Nuvemshop hosts are removed in T8).
- Client brand files go to `public/brand/` by the same script with a `SOURCE.md` line per file.
  Stand-ins: every element with `data-standin` (today: the hero wordmark) is listed in
  `tasks/` of the task that created it.

## 8. Libraries, per task

| Library | Enters in | For | Rule |
| --- | --- | --- | --- |
| shadcn/ui (Radix) | T4 | `Sheet` (menu), maybe `Dialog` | `components.json` with `aliases.ui = "@/components/shadcn"` so it never writes into AlignUI's `src/components/ui`; `iconLibrary` set to Remix if the CLI supports it `[VERIFY: components.json iconLibrary values at T4]`, otherwise lucide imports are replaced by Remix at add time |
| @magicui, @react-bits, @canvas-ui registries | only when a task names a component | — | added with `pnpm dlx shadcn@4.23.0 add @magicui/<name>`; component name verified on the registry page first; reduced-motion fallback required |
| animate-ui | only when named | — | same |
| GSAP (+ ScrollTrigger), Lenis | T6/T9 if a scroll moment is specified | timelines, scroll-driven | Lenis off under reduced motion; never on the bag or product forms |
| AlignUI (`src/components/ui`) | not used by new code | — | **proposal:** release-1 UI is native elements + our tokens + shadcn where a widget is needed; AlignUI files and their CSS tokens are removed with the legacy pages in T8 if nothing new uses them **[Benito to confirm, changes `CLAUDE.md` §5]** |

**Icons: one set, Remix Icon** (`@remixicon/react` 4.6.0 installed; 4.9.0 latest). No
`lucide-react`. Release 1 needs very few icons (arrow out ↗ can be a text glyph).

## 9. Environment variables

| Var | Used by | Required | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `lib/config.ts` | for ordering | digits with country code, `08` #4; public by nature (it is in every link) |
| `SHOPIFY_*` (legacy) | `src/lib/shopify*.ts` | no | removed with T8 |

## 10. Tests

| Check | Runner | File | Task |
| --- | --- | --- | --- |
| contrast of every theme × accent | node | `scripts/check-contrast.mjs` (parses `src/styles/tokens.css`) | T1 |
| hero renders, three themes axe-clean, keyboard switch, persistence, reduced motion, throttle, no overflow at 320/1440 | Playwright + axe (chromium) | `e2e/hero.spec.ts` | T1 |
| WhatsApp URL + message | Vitest | `src/lib/whatsapp/*.test.ts` | T3 |
| drop state derivation, catalogue integrity | Vitest | `src/lib/catalog/*.test.ts` | T3 |
| bag store (add, merge, remove, cap, storage sync) | Vitest | `src/lib/bag/store.test.ts` | T4 |
| bag flow to a wa.me URL (fixture catalogue) | Playwright + axe | `e2e/bag.spec.ts` | T4 |
| product sizes (sold out struck + labelled), drop mode states with a mocked clock | Playwright + axe | `e2e/product.spec.ts`, `e2e/drop.spec.ts` | T5, T6 |
| EXIF check on `public/` | Python | `scripts/images/prepare.py --check` | T5 |

Playwright config: `webServer` runs `pnpm build && pnpm start --port 3100`, `baseURL`
`http://localhost:3100`, project chromium only in release 1 (browsers already cached on this
machine; `pnpm exec playwright install chromium` otherwise).

## 11. Legacy 2025 Shopify code: fate by task

| File(s) | Fate | Task |
| --- | --- | --- |
| `src/app/page.tsx`, `src/components/sections/hero.tsx` | `/` replaced by the new hero; old hero component unused | T1 (page), T8 (delete component) |
| `src/lib/shopify.ts`, `src/lib/shopify-data.ts` | replaced by `lib/catalog` (static provider); deleted | T3 (interface), T8 (delete) |
| `src/lib/cart.ts`, `src/app/actions/cart.ts`, `src/components/cart/add-to-cart-submit.tsx` | replaced by the client bag + WhatsApp; deleted (no server action, no cookie cart) | T4 (new), T8 (delete) |
| `src/app/produtos/[handle]/*` | rewritten as `produtos/[slug]` on the catalogue | T5 |
| `src/app/produtos/page.tsx`, `apparel`, `merch`, `new-drop`, `artists`, `carrinho` | deleted (IA `04` §1.1) | T8 |
| `src/app/contato/page.tsx` | rewritten | T7 |
| `src/components/layout/*`, `product/*`, `sections/*`, `example-table.tsx`, `src/data/sample-*.ts` | deleted when unused | T8 |
| `next.config.ts` `images.remotePatterns`, `eslint.ignoreDuringBuilds` | remove both (lint must pass in build) | T8 |
| `package.json` name `projetinhotodolist`, `README.md` | rename to `slowco`, rewrite README | T2 |
| `src/app/layout.tsx` `NotificationProvider`, `Toaster`, `dark` class | kept while legacy pages need them; removed in T8 (Inter and Geist Sans were unused and left in T1) | T1, T8 |
| legacy lint errors (10, in `src/components/ui/{checkbox,switch}.tsx`, `src/utils/{polymorphic,tv,recursive-clone-children}.ts*`) | deleted with AlignUI or fixed, so repo-wide `pnpm lint` exits 0 | T8 |

Until T8 the legacy pages still build and run; nobody extends them.

## 12. Deployment

Not in scope until `08` #11 (Vercel team, domain). No `vercel` command runs before that.

## 13. Open items

- AlignUI removal (§8) needs Benito's OK.
- TypeScript 7 and ESLint 10 adoption: revisit after T2.
