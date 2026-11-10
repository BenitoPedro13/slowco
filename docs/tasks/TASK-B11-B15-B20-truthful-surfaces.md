# B11 / B15 / B20 — Truthful marquee, woven-label footer, 404 and empty bag

Source: `docs/10-IDEAS-AND-UX-REVIEW.md` §B11, §B15, §B20 and §D step 3. Direction A
(animated/cinematic). Started 2026-11-09.

## Current scenario

- **Marquee** (`src/components/marquee/`): one fixed brand line (`M-FAIXA`) looped four times.
  It says nothing about the store's state.
- **Footer** (`src/components/footer/site-footer.tsx`): two legal lines and two links in a plain
  row. No sample-data reminder, no way back to the top.
- **404** (`src/app/not-found.tsx`): label, `PÁGINA NÃO ENCONTRADA`, one link home. No photo,
  no route to the current drop.
- **Empty bag** (`BagView`): `Sua sacola está vazia.` plus `VER O DROP ATUAL`.

## Planned changes

1. **B11.** `Marquee` receives the current drop (name, `releaseAt`, piece states) and every
   piece's purchasability inputs from the home page. A new hook `useMarqueeLine` (hooks/) builds
   the moving line from the client clock: `DROP ATUAL <nome> / EM BREVE 03D 13H 22M 10S` (or
   `DISPONÍVEL AGORA` / `ESGOTADO`), `<n> PEÇAS AINDA DISPONÍVEIS` when n > 0 (singular for 1),
   then the existing brand line. It updates at most once a second (once a minute under reduced
   motion, no seconds), the moving copies stay `aria-hidden`, the one sr-only copy stays the
   brand line only (the same facts are already text in the hero ticker and the drop section,
   so the live numbers never spam a screen reader). Counts use `isPurchasable`, the same rule
   as the archive. Pause button and reduced-motion stillness unchanged. Also adds the singular
   `A-CONTAGEM-1` to the archive wall, which printed "1 peças".
2. **B15.** The footer becomes a woven care label: a bordered tag with a stitched inner edge
   (dashed outline, static), rows split by rules: `SLOW COMPANY`, the two legal lines
   (`lang="en"`), contact + Instagram, `ESTE SITE USA DADOS DE EXEMPLO` while
   `hasPlaceholderData()` is true, and `VOLTAR AO TOPO`. "Voltar ao topo" is a plain fragment
   link to `#topo` (`<body id="topo">`; a sticky header would not scroll): works without JS, moves the focus starting
   point, never smooth-scrolls (so nothing to switch off under reduced motion).
3. **B20 404.** "SEM SINAL" in the condensed face over a dark, desaturated client photo already
   in the manifest (`slow-2025-08-24-03.jpg`, the staircase frame, no longer used by the hero)
   with a static scanline texture and a black scrim (paper text, worst case > 10:1). Visible
   `404 · PÁGINA NÃO ENCONTRADA` label; actions `VER O DROP ATUAL` (only if a current drop
   exists) and `VOLTAR PARA O INÍCIO`. One 600 ms fade of the photo on load, none under
   reduced motion. No flicker / no animated noise (WCAG 2.3.1).
4. **B20 empty bag.** `A SACOLA ESTÁ VAZIA.` in the condensed face; when the current drop is
   still `em breve` on the browser clock: `O PRÓXIMO DROP, <nome>, ABRE <data>.` The date is the
   catalogue's `releaseAt`, the same value the hero ticker already shows. While the catalogue is
   placeholder data that date is an example date, covered by the global sample notice like
   every other date on the site (no new fact is introduced). Before hydration the line is not
   rendered (server snapshot `false`).

## Content assumptions (all provisional, `docs/05` status "nova", none approved)

New strings: `A-CONTAGEM-1` (singular count, shared by archive and marquee), `R-DADOS-EXEMPLO`,
`R-TOPO`, `X-SEM-SINAL`, `B-PROXIMO`. `B-VAZIA` changes to `A SACOLA ESTÁ VAZIA.`. No new
facts: names, dates and counts come from the catalogue.

## Affected files

`src/components/marquee/*`, `src/hooks/use-marquee-line.ts`, `src/app/page.tsx`,
`src/components/footer/site-footer.tsx` (+ css), `src/app/layout.tsx`,
`src/components/header/site-header.tsx`, `src/app/not-found.tsx` (+ css),
`src/components/bag/{bag-view,bag-drawer,bag-counter}.tsx`, `src/app/sacola/page.tsx`,
`src/hooks/use-drop-state.ts`, `src/components/archive/archive-wall.tsx`,
`src/content/strings.ts`, `src/content/editorial.ts`, `docs/04`, `docs/05`, e2e specs.

## Verification

- New e2e (`e2e/surfaces.spec.ts`) written first and run red: marquee shows the drop name and
  count, sr copy is brand-only; footer label + sample line + back-to-top moves to top; 404 has
  "SEM SINAL", the drop link and axe clean in three themes; empty bag shows the new line.
- Existing suites updated only where the copy intentionally changed (404 heading, empty bag).
- Full `pnpm test:e2e`, `pnpm test`, typecheck, lint, `check:contrast`, `git diff --check`.
- Screenshots at 390 and 1440 of footer, 404 and empty drawer, reviewed by eye.
- No dependency added. No commit, staging, push or deploy.

## Results (2026-11-09)

- `e2e/surfaces.spec.ts`: all 7 tests failed before the code (`red.log`), all pass after.
- Visual review found one more defect the tests had not covered: under reduced motion the still
  marquee showed only `DROP ATUAL DROP DE EXEMPLO` and the countdown/count sat off-screen. Fixed
  (one wrapped copy) and the reduced-motion test now asserts the countdown is fully in the
  viewport and the second copy hidden. That assertion was added after the fix, so its red run is
  the screenshot (`marquee-1440.png` of the first build), not a test log.
- Copy-driven test updates only: `bag.spec.ts` (empty-bag text), `pages.spec.ts` (404 h1 and
  the home link scoped to `main`, since the 404 now has two actions).
- Final: `pnpm test:e2e --workers=4` **104 passed (1.1m)** on a fresh production build;
  `pnpm test` 28 passed; typecheck 0; lint 0 errors (1 pre-existing warning in
  `scripts/instagram/console.js`); `check:contrast` 36/36; `git diff --check` clean.
- Screenshots reviewed (Chromium): 404 at 390/1440, footer at 390/1440, empty drawer at
  390/1440, marquee moving at 1440 and still at 390/1440. Files under the session scratchpad
  (temporary). Production server on 3100 stopped before each rebuild and at the end.
- No dependency added. No commit, staging, push or deployment.
