# 07 — Implementation plan

First version, 2026-11-09 (`tasks/TASK-definition.md`). Owns: the ordered tasks, their inputs,
outputs and runnable acceptance checks. Stack, files and tests: `06`. Behaviour: `04`. Values:
`02`. Strings: `05`. Open inputs: `08`.

Order (Benito delegated the choice of moments, STATUS 2026-11-09): **hero + theme switch first**,
then the bag counter, drop mode, cursor; the plumbing they need sits between them.

---

## 0. Rules for every task

1. Before starting: read the sections the task lists; write `docs/tasks/TASK-T<n>-<slug>.md`
   (scenario, steps, affected files, verification) as `CLAUDE.md` §7 requires.
2. Do exactly the task. No extra dependency, route, string or visual idea. Values from `02`,
   strings from `05` by ID; if one is missing or contradicts another doc, stop and report.
3. Never change a value in `02` to make a check pass; report the failing check with its output.
4. `[VERIFY]` items: check the named file/URL, record the finding in the task doc; if false, stop.
5. Stop when a check still fails after two honest attempts, when an `08` input is needed, or when
   an instruction conflicts with `CLAUDE.md`.
6. Done = every check passes, `git diff --check` clean, the task doc has a **Result** section
   (date, commands, numbers), one line in `STATUS.md` "Done". Commit only when Benito asks;
   **no `Co-Authored-By:`, no "Generated with"** (`CLAUDE.md` §7).
7. Never read, import, copy or serve `references/` (`CLAUDE.md` §4). Images reach `public/` only
   through `scripts/images/prepare.py` from `05` §9.
8. pnpm only. Code, comments, commits in English; UI strings from `05`.

## 1. Tasks

| # | Task | Depends on | Blocked by (`08`) | Delivers |
| --- | --- | --- | --- | --- |
| T1 | Hero + theme switch | — | — | `/` hero, three themes, wipe, tokens, contrast check, first e2e spec |
| T2 | Stack bump + rename | T1 | — | Next 16.4.5, React 19.3.1, Tailwind 4.3.5, package name, README |
| T3 | Core: catalogue interface, WhatsApp builder, drop state | T2 | — (empty catalogue is valid) | `lib/catalog`, `lib/whatsapp`, `deriveDropState`, Vitest |
| T4 | Header, bag counter, bag page | T3 | #4 for the live link only | header, menu sheet (shadcn), odometer counter, `/sacola`, `e2e/bag.spec.ts` |
| T5 | Product page + image pipeline | T4 | #7 for real products, #9 for people | `/produtos/[slug]`, `prepare.py`, `e2e/product.spec.ts` |
| T6 | Drop page, drop mode, home sections | T5 | #14 for real drops | `/drops/[slug]`, countdown with pause, home bands, `e2e/drop.spec.ts` |
| T7 | Archive, contact, 404 | T6 | #15 for the VIP link | `/arquivo`, `/contato`, `not-found` |
| T8 | Legacy removal | T5–T7 | #13 (old URLs) | `06` §11 deletions, `remotePatterns` and `ignoreDuringBuilds` removed |
| T9 | Cursor + page transitions | T8 | — | `04` §6, §7 |
| T10 | Launch gate | all | #2, #4, #5, #7, #8, #9, #11, #16 | approvals logged, full e2e + axe, Lighthouse, deploy plan |

T4–T7 can be built and tested against the fixture catalogue (`06` §3) before the client's data
arrives; they **ship** only with real data.

---

## T1 — Hero + theme switch

**Read:** `04` §3, §8; `02` §2.3, §3, §4, §5.3, §7; `05` §1, §2, §10; `06` §1.2, §6, §10.

**Inputs:** no `08` input. Strings with gate `lançamento` render in preview (`05` §0).

**Steps**

1. Repo hygiene: remove `pnpm-workspace.yaml` from `.gitignore` (`06` §1.1). Add scripts
   `typecheck`, `check:contrast`, `test:e2e`. Add dev deps `@playwright/test@1.65.0`,
   `@axe-core/playwright@4.14.0` (exact versions).
2. `src/styles/tokens.css`: base colours, the theme × accent blocks of `02` §3.2 (selectors
   `[data-theme="…"][data-drop-accent="…"]`), motion tokens (`02` §7), `@theme inline` roles
   `canvas`/`content`/`subtle`/`accent`, font families, the unlayered `html[data-theme] body`
   rule, `:focus-visible` ring (`02` §5.3), `.sr-only` from Tailwind. Imported at the end of
   `globals.css`.
3. `scripts/check-contrast.mjs`: no dependencies; parses `tokens.css`, resolves every theme ×
   accent combination by applying matching blocks in source order, prints the `02` §3.3 matrix
   and exits 1 if any text role < 4.5 or `--accent` < 3.
4. `src/lib/theme/themes.ts` (theme list, default `preto`, storage key `slow:tema`,
   `CURRENT_DROP_ACCENT = "vermelho"`, throttle 600ms, half-wipe 280ms), `theme-store.ts`,
   `init-script.ts` (`06` §6).
5. `src/app/layout.tsx`: `lang="pt-BR"`, Archivo (variable, `axes: ["wdth"]`, normal + italic)
   and Geist Mono via `next/font/google` as CSS variables; `<html data-theme="preto"
   data-drop-accent="vermelho" suppressHydrationWarning>`; init script first in `<head>`; skip link
   `G-PULAR`; metadata `M-TITULO`, `M-DESCRICAO`. Keep `NotificationProvider`/`Toaster` for legacy
   pages (`06` §11).
6. `src/content/strings.ts`: the T1 IDs from `05` §1, §2, §10, verbatim.
7. `src/hooks/use-theme-switch.ts` (`06` §6) and `src/components/theme/theme-switch.tsx`
   (client leaf: fieldset + three native radios + visible current-theme label + the wipe overlay
   carrying the target's `data-theme`/`data-drop-accent`).
8. `src/components/hero/hero.tsx` (server): top row (`G-TOPO`, switch), `<h1>` with the stand-in
   wordmark (`data-standin="wordmark"`, letters as `aria-hidden` spans, `H-H1` visually hidden),
   bottom rows `G-LEGAL-1`, `G-LEGAL-2` (`lang="en"`), `H-LINHA`, `G-INSTAGRAM` link. Wordmark
   sized in `cqi` on a `container-type: inline-size` box; letter entry per `04` §3.2 in a
   `prefers-reduced-motion: no-preference` block.
9. `src/app/page.tsx`: `<main id="conteudo" tabIndex={-1}>` with the hero only (the legacy home
   sections and Shopify fetch leave `/`).
10. `playwright.config.ts` and `e2e/hero.spec.ts` (checks below).
11. Measure the wordmark: record the final `cqi` value and the rendered width at 320/1440 in the
    task doc.

**Checks** (all must pass; paste outputs into the task doc)

```bash
pnpm install --frozen-lockfile
pnpm check:contrast          # prints 12 rows, exit 0
pnpm exec eslint <every file T1 adds or edits>   # exit 0
pnpm lint                    # only the 10 pre-existing legacy errors (06 §11, T8)
pnpm typecheck               # exit 0
pnpm build                   # exit 0, "/" prerendered as static (○)
pnpm test:e2e e2e/hero.spec.ts
git diff --check
```

`e2e/hero.spec.ts` asserts:

1. `/` has one `<h1>` whose accessible name is `Slow Company`; `html[lang="pt-BR"]`.
2. Default `data-theme="preto"`; computed `body` background is `rgb(11, 11, 11)`.
3. For each theme (`preto`, `branco`, `drop`): axe (`wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`)
   reports **0 violations**.
4. Keyboard: Tab from the top reaches the skip link, then the theme group; ArrowRight selects
   `branco`; within 1 s `data-theme="branco"`; the visible label reads `Branco`.
5. Persistence: after selecting `drop` and reloading, `data-theme="drop"` is set **before**
   hydration (checked on `DOMContentLoaded` via `page.evaluate` in an init script).
6. Throttle: with a MutationObserver recording `data-theme` changes, pressing ArrowRight 8 times
   at 50ms intervals yields **≤ 3 changes in the first 1500ms** and ends on the last requested
   theme.
7. Reduced motion (`page.emulateMedia({ reducedMotion: "reduce" })`): selecting a theme applies
   it with no overlay animation (`document.getAnimations()` empty for the overlay) and the hero
   letters have `animation-name: none`.
8. No horizontal overflow at 320×640 and 1440×900 (`scrollWidth <= clientWidth`), and the
   wordmark's bounding box fits inside the viewport at both.
9. The Instagram link has `href="https://www.instagram.com/slow_tm/"`.

**Manual look (report what was seen):** dev server, 375px and 1440px wide, each theme, keyboard
only, reduced motion on (macOS setting or DevTools emulation).

**Out of scope:** header for other pages, bag, cursor, any photo, GSAP/Lenis, Next upgrade.

---

## T2 — Stack bump + rename

**Read:** `06` §1. Steps: bump to the targets in `06` §1.1 (re-check the registry the same day;
record dates), migrate `eslint.config.mjs` to the Next 16 flat config `[VERIFY:
https://nextjs.org/docs/app/api-reference/config/eslint]`, run the Next 16 codemod only if the
upgrade guide says it applies `[VERIFY: https://nextjs.org/docs/app/guides/upgrading/version-16]`,
rename the package to `slowco`, rewrite `README.md`. Checks: T1's full list, unchanged results;
`/` still static.

## T3 — Core

**Read:** `06` §3, §5; `05` §8. Steps: Vitest (+ peer), `lib/catalog` types/functions/static
provider with an empty `content/catalog.ts`, fixture provider for tests, `deriveDropState`,
`lib/whatsapp`, `lib/config.ts`; `data-drop-accent` from `getCurrentDrop()` with the T1 constant
as fallback. Checks: `pnpm test` (cases listed in `06` §5 and §10), T1 checks.

## T4 — Header, bag counter, bag page

**Read:** `04` §2, §4; `05` §1, §6; `06` §4, §8. Steps: shadcn init with the aliases of `06` §8,
add `sheet`; header; `BagProvider` + hooks; odometer counter; `/sacola` with stepper, name input,
`PEDIR NO WHATSAPP`. Checks: unit tests for the store; `e2e/bag.spec.ts` (fixture catalogue: add
two lines, counter shows `02`, accessible name `Sacola, 2 itens`, live region text, link equals
`buildWhatsAppUrl` output, axe 0 violations, reduced motion swaps digits without animation).

## T5 — Product page + image pipeline

**Read:** `04` §5 (sizes), `05` §5, §9, `02` §6, `06` §7. Checks: `prepare.py --check public/`
exits 0; `e2e/product.spec.ts` (sold-out size struck **and** labelled, not selectable, error
`P-ESCOLHA` announced, `PEDIR SÓ ESTA PEÇA` URL, axe).

## T6 — Drop page, drop mode, home sections

**Read:** `04` §1.1, §5; `05` §2, §3. Checks: `e2e/drop.spec.ts` with a mocked clock
(`page.clock`): `em-breve` → countdown pause/resume works → at `releaseAt` flips to
`DISPONÍVEL AGORA` without reload; `esgotado` when every product is; axe in each state.

## T7 — Archive, contact, 404

Checks: e2e for `/arquivo` order (newest first), VIP block absent while `08` #15 is open,
404 status and `X-VOLTAR` link; axe.

## T8 — Legacy removal

Delete per `06` §11. Checks: `rg -n "shopify|Shopify|mitiendanube" src` returns nothing;
`pnpm build` with `ignoreDuringBuilds` removed; all e2e specs.

## T9 — Cursor + page transitions

**Read:** `04` §6, §7. Checks: e2e: custom cursor absent under reduced motion and on
`hover: none`; present and `aria-hidden` otherwise; native cursor on inputs; transitions off
under reduced motion; full suite.

## T10 — Launch gate

All approvals in `05` §11; every `render` gate resolved or its element absent; full e2e + axe;
Lighthouse mobile on `/`, a drop and a product (targets set by Benito); `08` #11 for deploy.
