# TASK T2: stack bump + rename

## Current scenario

Next 15.5.4, React 19.1.0, Tailwind 4.1.13, TypeScript 5.9.2, ESLint 9.36 with `FlatCompat`;
`next.config.ts` has `eslint.ignoreDuringBuilds`; `package.json` is named `projetinhotodolist`;
`README.md` describes the Shopify prototype.

## Planned changes (`07` T2, `06` §1.1)

1. Exact pins: `next@16.4.5`, `react@19.3.1`, `react-dom@19.3.1`, `eslint-config-next@16.4.5`,
   `eslint@9.39.5`, `typescript@5.9.3`, `tailwindcss@4.3.5`, `@tailwindcss/postcss@4.3.5`,
   `@types/node@24`, latest `@types/react`/`@types/react-dom` 19.
2. `next.config.ts`: drop the `eslint` key (removed in Next 16; `next build` no longer lints,
   per https://nextjs.org/docs/app/guides/upgrading/version-16, read 2026-11-09).
3. `eslint.config.mjs`: native flat config from `eslint-config-next` 16 (no `FlatCompat`),
   same ignores.
4. No codemod: the app has no middleware, no `experimental.turbopack`, no `unstable_` cache APIs,
   and params are already awaited (legacy `produtos/[handle]` uses `await params`).
5. `package.json` name `slowco`; `README.md` rewritten (how to run, env var, docs map).

## Affected files

`package.json`, `pnpm-lock.yaml`, `next.config.ts`, `eslint.config.mjs`, `README.md`.

## Verification

T1 checks unchanged: contrast, typecheck, lint on new files, build (`/` static), `e2e/hero.spec.ts`.

## Result (2026-11-09)

- Installed: next 16.4.5, react/react-dom 19.3.1, eslint 9.39.5, eslint-config-next 16.4.5,
  typescript 5.9.3, tailwindcss + @tailwindcss/postcss 4.3.5, @types/node 24.19.2.
  `@eslint/eslintrc` removed (FlatCompat no longer needed).
- `next build` rewrote `tsconfig.json` itself: `jsx: "react-jsx"`, include `.next/dev/types/**/*.ts`.
- `pnpm typecheck` exit 0. ESLint on all new files exit 0. `pnpm build`: 11 routes, `○ /` static
  (Next 16 no longer prints sizes).
- `pnpm check:contrast`: all 36 pairs pass. `pnpm test:e2e e2e/hero.spec.ts` (fresh build):
  **12 passed (13.9 s)**.
- `pnpm lint` (repo): 16 problems (11 errors), all legacy. The new one is the v16 React hooks rule
  `set-state-in-effect` in legacy `src/hooks/use-tab-observer.ts`; deleted in T8.
