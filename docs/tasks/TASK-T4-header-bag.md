# TASK T4: header, bag counter, bag page

## Current scenario

Only `/` (hero with its own top row). No bag; the legacy `/carrinho` uses a Shopify cookie cart.

## Planned changes (`07` T4, `04` §2, §4, `05` §1, §6, `06` §4)

1. `src/lib/bag/store.ts`: pure line operations (add/merge, set quantity 1–10, remove) and
   `createBagStore(storage)`: an external store over `localStorage` `slow:sacola`, cross-tab
   `storage` sync, stable snapshots, empty server snapshot. Unit tests.
2. `BagProvider` (client, in the root layout): one store per mount (`useState`), plus a polite
   `role="status"` announcer. Hooks in `src/hooks/use-bag.ts`: `useBagLines`, `useBagCount`,
   `useBagActions`, `useAnnounce`. No component reads the context directly.
3. Header (server) in the root layout: wordmark stand-in link → `/`, nav `DROPS` (current drop),
   `ARQUIVO`, `CONTATO` (≥ 640px inline; below, a `MENU` sheet), theme switch, bag counter.
   The hero's own top row goes (the header replaces it).
4. Menu sheet: **Radix Dialog primitive directly** (`@radix-ui/react-dialog`, installed), not
   `shadcn init`: shadcn's init rewrites `globals.css` tokens, which would clash with `02`'s
   tokens and the legacy AlignUI block. Same primitive shadcn's `Sheet` wraps; recorded in `06` §8.
5. Bag counter: two-digit odometer (`04` §4), accessible name `G-SACOLA-ARIA`.
6. `/sacola`: lines with stepper and remove, optional name, note `B-NOTA`, `PEDIR NO WHATSAPP`
   (only with `NEXT_PUBLIC_WHATSAPP_NUMBER`; else `B-SEM-NUMERO`), empty state.
7. `e2e/bag.spec.ts` (bag seeded through `localStorage`; adding from a product page comes in T5);
   `e2e/hero.spec.ts` check 4 adapted to the header's tab order.

## Affected files

`src/lib/bag/*`, `src/components/bag/*`, `src/components/header/*`, `src/hooks/use-bag.ts`,
`src/content/{strings,fill}.ts`, `src/lib/whatsapp/format-message.ts`, `src/app/layout.tsx`,
`src/app/sacola/page.tsx`, `src/components/hero/hero.tsx`, `e2e/*`, docs `05`, `06`.

## Verification

`pnpm test`, typecheck, ESLint on new files, build, `e2e/bag.spec.ts` + `e2e/hero.spec.ts`,
screenshots at 320 / 375 / 1440.

## Result (2026-11-09)

- `pnpm test`: 4 files, **27 passed** (+6 bag store: merge/cap 10, clamp, defensive parse,
  lazy read + write-through + stable snapshot, cross-tab `storage` event, blocked storage).
- `pnpm typecheck` 0; ESLint on new files 0; `pnpm build` ok (`○ /sacola` static).
- `pnpm test:e2e` (fresh build, `NEXT_PUBLIC_WHATSAPP_NUMBER=15555550100`, a fictional number):
  **21 passed (30.8 s)**: hero 12 + bag 9 (empty state; stored lines, stepper, remove + live
  region, counter after reload; WhatsApp `href` decoded equals the 05 §8 message with a name
  containing `&` and `?`; cross-tab sync; menu sheet open/Escape/focus return at 375 px; nav and
  no overflow at 320 px; axe WCAG 2.2 AA on a filled `/sacola` in the three themes).
- Fixed during the run: axe `label-content-name-mismatch` on the counter (aria-label replaced
  by visually hidden text); `networkidle` waits replaced by a hydration check (Next 16 prefetches
  the nav routes, so idle is not a stable signal).
- Visual (headless Chromium screenshots; Chrome extension not connected): home 320/1440,
  `/sacola` 375 (branco) and 1440 (drop), menu sheet 375. Header fits at 320 (wordmark, three
  swatches, counter, MENU); theme name label shown from 1024 px only.
- Decisions: Radix Dialog used directly (no `shadcn init`), the hero's `G-TOPO` row removed
  (the header replaces it), WhatsApp opens in the same tab (no `target=_blank`: on phones wa.me
  hands off to the app), new strings `G-NAV`, `B-TAMANHO`, `B-ADICIONADO-1`, `G-SACOLA-ARIA-1/0`.
- Unverified: no-number state (`B-SEM-NUMERO`) only by code review, since the e2e build sets a number.
