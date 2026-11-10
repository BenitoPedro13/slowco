# B14 — "Slow Mode" motion switch

Source: `docs/10-IDEAS-AND-UX-REVIEW.md` §B14 (optional backlog, §D step 6). Started 2026-11-09.
Name and copy are **provisional** ([DECIDE] with Benito/the client, `10` §E question 2): the
brand already uses "Slow Mode" (00 §B; `M-FAIXA`), and "devagar e sempre" is its idea.

## Current scenario

Motion is either full or, with the OS `prefers-reduced-motion`, off. The marquee and the globe
each have their own pause button; there is no site-level control for people who want less
motion without changing an OS setting.

## Planned changes

1. **State** (`src/lib/motion/motion-store.ts`, like the theme store): `<html data-motion="slow">`
   + `localStorage["slow:modo"] = "1"`, applied before first paint by the existing init script,
   followed across tabs (`storage` event). Read with `useSyncExternalStore` in `useSlowMode()`
   (`hooks/`), server snapshot off.
2. **Effect when on:**
   - `--motion-scale: 2` on `<html>`; the motion tokens (`--dur-*`, `--stagger`) and the literal
     durations (hero photo settle, marquee loop, bag drawer, 404 fade, chapter flood) become
     `calc(… * var(--motion-scale))`. JS durations (theme wipe, page reveal, globe turn) read the
     same scale. Everything moves at half speed. The scroll-linked wordmark break is tied to
     scroll position, not time, and is unchanged. The entry loader plays before anyone can reach
     the switch, so it is unchanged.
   - Marquee and globe **start paused** (their own buttons still resume them).
3. **Reduced motion wins:** with the OS preference, motion is already off; the switch shows
   on, is disabled, and says why (`R-SLOW-MODE-SISTEMA`).
4. **Control:** `SlowModeSwitch`, a native `<input type="checkbox" role="switch">` with a visible
   label and state text (`LIGADO` / `DESLIGADO`), never colour alone. Placed in the mobile menu
   sheet (under the theme radios) and in the footer label (so desktop has it too). Both copies
   share the store.

## Content assumptions (provisional, not approved)

`R-SLOW-MODE` `SLOW MODE`, `R-SLOW-MODE-DESC` `Movimento mais lento; faixa e globo começam
pausados.`, `R-LIGADO` / `R-DESLIGADO`, `R-SLOW-MODE-SISTEMA` `Ligado pelo seu sistema
(menos movimento).` No client facts involved.

## Affected files

`src/lib/motion/motion-store.ts`, `src/hooks/use-slow-mode.ts`, `src/lib/theme/init-script.ts`,
`src/components/motion/slow-mode-switch.tsx`, `src/styles/tokens.css`, the CSS files with
literal durations, `src/hooks/{use-theme-switch,use-page-reveal,use-globe}.ts`,
`src/components/{marquee/marquee,globe/globe}.tsx` (via hooks), footer, menu sheet,
`src/content/strings.ts`, `docs/04`, `docs/05`, `e2e/slow-mode.spec.ts`.

## Verification

`e2e/slow-mode.spec.ts` red first: switch in footer turns `data-motion="slow"` on, persists
across reload before paint, doubles the marquee duration and starts marquee and globe paused
(and they can still be resumed); switch in the mobile menu reflects and changes the same state;
under reduced motion the switch is checked, disabled and explained; axe clean in three themes.
Full suite, unit, typecheck, lint, contrast. No dependency, commit, staging, push or deploy.

## Results (2026-11-09)

- `e2e/slow-mode.spec.ts`: 6 tests, all failed against the pre-B14 build (`red.log`), all pass.
- The first full run found a real, pre-existing marquee defect: `.marquee:focus-within` paused
  the band, and the only focusable thing inside is its own toggle, so after pressing
  `RODAR FAIXA` the band stayed paused while the button kept focus. Removed that rule (hover
  pause and the button remain; WCAG 2.2.2 is met by the button).
- `e2e/mobile-menu.spec.ts` updated for the new last focusable item in the sheet (the switch;
  disabled, so skipped, under reduced motion).
- Final, fresh production build: `pnpm test:e2e --workers=4` **117 passed (35.2s)**; unit 28;
  typecheck 0; lint 0 errors (1 pre-existing warning); contrast 36/36; `git diff --check` clean.
- Screenshots reviewed: footer switch on (branco, 1440) and menu switch off (preto, 390 touch).
- Not covered by a test: the doubled theme wipe / page reveal / globe speed (they read the same
  `motionScale()`); the CSS duration doubling is asserted on the marquee (40s → 80s).
- Chromium only. No dependency, commit, staging, push or deployment.
