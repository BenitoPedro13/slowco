# TASK T8: legacy removal

## Done (2026-11-09, working tree only, nothing staged)

Deleted per 06 §11: legacy routes (`/produtos` list, `/apparel`, `/merch`, `/new-drop`,
`/artists`, `/carrinho`, `app/actions`), `lib/{shopify,shopify-data,cart,format}.ts`,
`components/{ui,cart,layout,sections}`, `example-table.tsx`, legacy `product-card/grid`,
`src/data`, `src/utils`, `hooks/use-{notification,tab-observer}.ts`, the AlignUI block of
`globals.css` (712 lines), `NotificationProvider`/`Toaster`/`dark` in the layout,
`images.remotePatterns`. 26 unused dependencies removed; runtime deps are now `next`, `react`,
`react-dom`, `@radix-ui/react-dialog`.

## Checks run

- `pnpm lint` (repo-wide): **0 errors**, 1 warning (`scripts/instagram/console.js`, research
  tooling). The 10 + 1 legacy errors are gone.
- `rg "shopify|Shopify|mitiendanube" src`: no matches. typecheck 0. build ok.
