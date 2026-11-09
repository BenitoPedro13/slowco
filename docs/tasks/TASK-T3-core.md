# TASK T3: core (catalogue, WhatsApp, drop state)

## Current scenario

No catalogue interface; product data only in the legacy Shopify modules and `src/data/sample-*`.
No unit-test runner. The client has sent no products (`08` #7, #14).

## Planned changes (`07` T3, `06` §3, §5)

1. Dev deps `vitest@5.1.0`, `vite@8.3.6` (required peer, checked on the registry 2026-11-09);
   `vitest.config.mts` with the `@` alias; script `test`.
2. `src/lib/catalog/{types.ts,static-provider.ts,index.ts,drop-state.ts}`: types of `06` §3
   plus `placeholder?: boolean`; `getDrops/getDrop/getProducts/getProduct/getCurrentDrop`,
   `getCatalogIndex` (light index for the bag), `hasPlaceholderData`; `deriveDropState`,
   `isPurchasable`.
3. `src/content/catalog.ts`: **placeholder catalogue** (default assumed, STATUS, `08` #22):
   three drops `DROP DE EXEMPLO A/B/C` with accents roxo/azul/vermelho, `releaseAt` relative to
   build time (−400 d, −60 d, +3 d), seven products `PEÇA DE EXEMPLO 01–07`, sizes `A/B/C`, no
   prices, no images, every record `placeholder: true`.
4. `src/lib/whatsapp/{build-url.ts,format-message.ts}`, `src/lib/config.ts`
   (`NEXT_PUBLIC_WHATSAPP_NUMBER`), `src/lib/format.ts` replaced by `src/lib/format/{price,date}.ts`
   only for new code (legacy `src/lib/format.ts` untouched until T8).
5. `data-drop-accent` on `<html>` from `getCurrentDrop()` (fallback: the T1 constant).
6. Strings `WA-*`, `G-EXEMPLO` (new, `05`).

Deviation from `06` §3, recorded there: no separate fixture catalogue / `CATALOG_SOURCE`
(the placeholder catalogue is already fake and labelled; e2e uses it), and no `server-only`
package (data is public; client components receive only the index through props).

## Affected files

`package.json`, `pnpm-lock.yaml`, `vitest.config.mts`, `src/lib/catalog/*`, `src/content/catalog.ts`,
`src/lib/whatsapp/*`, `src/lib/config.ts`, `src/lib/format/*`, `src/content/strings.ts`,
`src/app/layout.tsx`, docs `05`, `06`.

## Verification

`pnpm test` (cases of `06` §5, §10), T1 checks.

## Result (2026-11-09)

- `pnpm test`: **3 files, 21 tests passed** (WhatsApp number normalisation, URL encoding of
  `\n / & ? á ç`, bag and single messages, name trim/cap; drop state before/at release, not-for-sale,
  `isPurchasable`; catalogue integrity on the real file + a broken sample (5 problems found);
  newest-first, current drop, filters, placeholder flag; price and date formats incl. UTC → Rio).
- `pnpm typecheck` exit 0; ESLint on new files exit 0; `pnpm build` ok (`○ /`);
  `e2e/hero.spec.ts` 12 passed (14.3 s) with the accent now coming from `getCurrentDrop()`
  (`DROP DE EXEMPLO C`, vermelho) and the `G-EXEMPLO` note at the top of the page.
