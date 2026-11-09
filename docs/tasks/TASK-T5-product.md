# TASK T5: product page + image pipeline

## Current scenario

Legacy `src/app/produtos/[handle]` renders Shopify products (conflicts with the new `[slug]`).
No image pipeline; `public/` holds only the create-next-app SVGs. No approved photos (`05` §9).

## Planned changes (`07` T5, `04` §5, `05` §5, `06` §7)

1. Delete `src/app/produtos/[handle]/` (legacy, Shopify). The legacy list `/produtos` stays
   until T8.
2. `src/app/produtos/[slug]/page.tsx` (server, `generateStaticParams`, `revalidate = 60`,
   `notFound()`): name (h1), drop link, price only if present, client fields only if present,
   photos only if present (none today: no box, no "no photo" placeholder, `05` §0 gate rule).
3. `ProductPurchase` (client leaf): native radio group for sizes (`P-TAMANHO`); sold-out sizes
   struck through, visible `ESGOTADO`, accessible name `P-TAM-ESGOTADO`, `aria-disabled` and
   still focusable, never selectable; `ADICIONAR À SACOLA` (bag + live region); `PEDIR SÓ ESTA
   PEÇA` (single-piece wa.me message, only with a number); `P-ESCOLHA` as an alert when no size.
   States `em-breve` (with `D-DATA`), `esgotado`, `NOT FOR SALE` show their label, no actions.
4. `useNow(renderedAt, intervalMs)` (`src/hooks/use-now.ts`): a clock store whose server
   snapshot is the render time, so a page built before `releaseAt` unlocks itself in the browser
   at `releaseAt` without a reload (reused by T6).
5. `scripts/images/prepare.py`: `prepare SRC… --out DIR` (JPEG q85, long edge ≤ 2400, sRGB
   only, every other metadata dropped) and `--check DIR` (fails on EXIF/XMP/GPS/device tags).
   Script `pnpm check:images`.

## Verification

`pnpm test`, typecheck, ESLint, build, `check:images` (and a self-test on a generated JPEG with
GPS EXIF in the scratchpad), `e2e/product.spec.ts` + earlier specs, screenshots.

## Result (2026-11-09)

- typecheck 0; ESLint on new files 0 (the v16 `react-hooks/purity` rule rejected `Date.now()`
  in render: the time now comes from `getRenderTime()` in `lib/catalog`).
- `pnpm check:images` (`--check public`): `checked 0 image(s) under public: 0 with metadata`,
  exit 0. Self-test in the scratchpad: a 3000×2000 JPEG with GPS, make/model, orientation 6
  and a comment fails `--check` (exit 1); after `prepare` it is 1600×2400 (rotation applied),
  0 EXIF tags, only the sRGB ICC left, and `--check` exits 0.
- `pnpm test:e2e`: 26 passed in the full run, then `e2e/product.spec.ts` **8 passed** after the
  selector fixes (sold-out size struck + `B, esgotado` + `aria-disabled`; `P-ESCOLHA` error;
  add → `Sacola, 1 item` + announcement; `PEDIR SÓ ESTA PEÇA` request URL decoded equals the
  single-piece message; em-breve shows `D-DATA`, esgotado shows no actions; unknown slug 404;
  axe in 3 themes with the error showing).
- Legacy `src/app/produtos/[handle]/` deleted (working tree only, nothing staged).
