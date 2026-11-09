# TASK T1: hero + theme switch

## Current scenario

`/` is the 2025 Shopify prototype's home (Shopify fetch with sample fallback, AlignUI sections).
No tokens from `02` exist in code. `pnpm-workspace.yaml` is gitignored, so a fresh clone cannot
install with pnpm 12 (build scripts unapproved).

## Planned changes

Exactly `07` T1 steps 1–11:

1. `.gitignore` stops ignoring `pnpm-workspace.yaml`; scripts `typecheck`, `check:contrast`,
   `test:e2e`; dev deps `@playwright/test@1.65.0`, `@axe-core/playwright@4.14.0`.
2. `src/styles/tokens.css` (`02` §3.2, §4, §5.3, §7), imported from `src/app/globals.css`.
3. `scripts/check-contrast.mjs`.
4. `src/lib/theme/{themes.ts,theme-store.ts,init-script.ts}`.
5. `src/app/layout.tsx`: pt-BR, Archivo + Geist Mono, data attributes, init script, skip link,
   metadata.
6. `src/content/strings.ts` (T1 IDs only).
7. `src/hooks/use-theme-switch.ts`, `src/components/theme/theme-switch.tsx`.
8. `src/components/hero/hero.tsx`.
9. `src/app/page.tsx` → hero only.
10. `playwright.config.ts`, `e2e/hero.spec.ts`.
11. Wordmark measurement.

Content assumptions: strings with gate `lançamento` render in preview (`05` §0). The wordmark is
the Archivo stand-in (`02` §2.3) with `data-standin="wordmark"`. Current accent `vermelho` is a
provisional constant (`08` #17).

## Affected files

| File | Change |
| --- | --- |
| `.gitignore`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `eslint.config.mjs` | edited / new (ESLint now ignores `references/`, `.venv-ig/`, Playwright output) |
| `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css` | edited |
| `src/styles/tokens.css`, `src/content/strings.ts` | new |
| `src/lib/theme/*`, `src/hooks/use-theme-switch.ts`, `src/components/theme/theme-switch.tsx`, `src/components/hero/hero.tsx`, `src/components/hero/hero.css` | new |
| `scripts/check-contrast.mjs`, `playwright.config.ts`, `e2e/hero.spec.ts` | new |

Stand-ins created: `src/components/hero/hero.tsx` (`data-standin="wordmark"`).

## Verification

`07` T1 checks + manual look (375 / 1440, three themes, keyboard, reduced motion).

## Result (2026-11-09)

All `07` T1 checks run on this machine (macOS, Node 24.22.2, pnpm 12.15.0, Next 15.5.4):

| Check | Outcome |
| --- | --- |
| `pnpm install --frozen-lockfile` | "Lockfile is up to date"; lockfile adds only `@playwright/test`, `playwright`, `playwright-core` 1.65.0, `@axe-core/playwright`, `axe-core` 4.14.0 (no other version changed) |
| `pnpm check:contrast` | 12 rows, "all 36 pairs pass"; identical to `02` §3.3 |
| `pnpm typecheck` | exit 0 |
| `pnpm exec eslint` on every T1 file | exit 0 |
| `pnpm lint` (repo) | 14 problems (10 errors, 4 warnings), **all in untouched legacy files** (`src/components/ui/checkbox.tsx`, `switch.tsx`, `src/utils/*`, `example-table.tsx`, `src/hooks/use-*.ts`, `scripts/instagram/console.js`). Before T1: 12,322 problems, because ESLint read `references/`. Legacy errors are owned by T8 (`06` §11) |
| `pnpm build` | `○ /` static, 1.58 kB, First Load JS 103 kB |
| `pnpm test:e2e e2e/hero.spec.ts` (fresh build via `webServer`) | **12 passed** (19.6 s): h1 name, pt-BR, default ink bg `rgb(11, 11, 11)`, axe 0 violations in preto/branco/drop (tags wcag2a/aa, 21a/aa, 22aa), keyboard skip link → radio group → ArrowRight selects Branco, stored theme set at DOMContentLoaded, throttle, reduced motion, no overflow at 320×640 and 1440×900, Instagram href |
| `git diff --check` (incl. untracked) | clean (after removing one trailing space in `00-DISCOVERY.md` line 226) |

Measurements (headless Chromium via Playwright, production server):

- Wordmark at `25.5cqi`: 87.5px font, letters 16→344px in a 16→359px box at 375px; 346.8px font,
  40→1339px in a 40→1400px box at 1440px. `font-stretch` computes to `125%`. The first value
  tried, `27.5cqi`, overran the box (369px at 375, 1441px at 1440); the W's italic corner was
  cut until the letter clip changed from `overflow: hidden` to a bottom-only `clip-path`.
- Throttle: 8 ArrowRight presses at 50ms intervals produced 2 applied changes (branco at +295ms,
  drop 599ms later) and ended on the last request. A first version of the spec observed `<html>`
  before it existed and passed vacuously; it now observes `document` and asserts ≥ 1 change.
- Mid-wipe screenshot at +150ms: the red layer covers the lower 79% of the black page, radio
  already on "Cor do drop".
- Dev server (`next dev`): console shows only React's DevTools info line; no hydration warning
  and no warning about the inline `<script>` in `<head>` (`06` §6 `[VERIFY]` resolved for
  Next 15.5.4 / React 19.1.0; recheck in T2).

Looked at (screenshots, not a human eye on a real device): 375×812 and 1440×900 in preto, branco
and drop. Not verified: Safari/Firefox, a real phone, VoiceOver/NVDA reading the radio group,
the OS-level reduced-motion setting (only Playwright's emulation), and the Chrome extension route
(not connected in this session).

Stand-ins: `src/components/hero/hero.tsx` `data-standin="wordmark"`.
