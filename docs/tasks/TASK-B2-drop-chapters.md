# B2 + D2 — Drop chapters on the home with a one-time colour flood

Source: `docs/10-IDEAS-AND-UX-REVIEW.md` §B2 and §D2, `docs/09-HANDOFF-NEXT.md` §5.4 items 1–2
(direction A, cinematic, approved by Benito). Started 2026-11-09.

## Current scenario

Between the poster hero and the marquee the home stacks two plain sections: `DROP ATUAL` (sticky
name + status on the left, a 2-column card grid on the right) and `AINDA DISPONÍVEL` (a card
grid). Nothing marks the move from one drop to the next; the drop accents (C vermelho,
B azul, A roxo in the placeholder catalogue) never appear on the home.

## Planned changes

1. **One chapter per drop** (`src/components/chapter/`): the current drop first, then one chapter
   per *older released* drop that still has purchasable pieces (as before, "ainda disponível").
   Each chapter is a `<section aria-labelledby>` with: a label row (`DROP ATUAL` or
   `AINDA DISPONÍVEL`) and `VER O DROP`; the drop's cover photo edge to edge (first real client
   photo among its pieces, the archive's rule), fading at the bottom into the chapter colour; the
   drop name in the condensed face at 64–224 px, overlapping the faded (solid) part of the photo
   so text contrast is always text-on-colour; for the current drop the existing `DropStatus`
   (countdown + pause); then the pieces as a horizontal rail.
2. **Rail** (`Rail`, client leaf + `useRail` hook): a native `<ul>` scroller with
   `scroll-snap-type: x mandatory`, inside a `role="region"` with an accessible name, and
   `ANTERIOR` / `PRÓXIMA` buttons (disabled at the ends, hidden when nothing overflows).
   Buttons scroll one card; smooth only without reduced motion. Cards stay links (keyboard
   reaches every piece; snap brings the focused card into view). No page-level horizontal
   overflow.
3. **Colour flood (D2)** (`FloodSection`, client leaf; ref callback with an
   `IntersectionObserver` and cleanup, no `useEffect`): the server renders every chapter already
   flooded (chapter tokens `--canvas` = the drop accent, `--content` = paper; ink for `verde`), so
   no-JS and reduced motion get the complete, still composition. After hydration, a chapter that
   is still below the viewport is set to `data-flood="pending"` (page colours); when its top
   passes 60 % of the viewport it flips to `in` **once** and is never reset: a top-to-bottom
   `clip-path` wipe of 900 ms, tokens swap at the midpoint (`allow-discrete` custom-property
   transition; instant swap where unsupported). In the `drop` theme the current drop floods to
   ink (its accent is already the page colour). Reduced motion: never pending, so no wipe.
   Flash rule: one state change per chapter per page view, ≥ 600 ms, never on a timer.
4. Home (`src/app/page.tsx`): the two old sections are replaced by the chapters. Hero, marquee,
   globe chapter, footer unchanged. Max animated things in view: flood (once), countdown, hover.

Not done here (separate items): paper-tear edges (09 §5.4.3), `PEDIR` action in the chapter
(needs a product choice; the cards already lead to ordering), cursor states (B21).

## Content assumptions

New provisional strings: `H-TRILHO` (`Peças de {drop}`, rail region name), `H-ANTERIOR` /
`H-PROXIMA` (`ANTERIOR` / `PRÓXIMA`, reusing the product-gallery wording). Names, dates,
accents and photos come from the catalogue and the image manifest; placeholder notice stays.

## Affected files

`src/components/chapter/{drop-chapter.tsx,flood-section.tsx,rail.tsx,chapter.css}`,
`src/hooks/use-rail.ts`, `src/hooks/use-flood.ts`, `src/app/page.tsx`, `src/content/strings.ts`,
`docs/04`, `docs/05`, `docs/06` (no dependency), `e2e/chapters.spec.ts`.

## Verification

- `e2e/chapters.spec.ts`, run red first: two chapters named by drop; rail region + arrows move the
  rail and disable at the end; keyboard reaches every card; no horizontal page overflow at 320;
  flood: chapter below the fold starts `pending`, becomes `in` once after scrolling, never flips
  back; ≤ 3 flood state changes in 3 s of scrolling (D2); reduced motion: no `pending`, no
  transition; axe clean in three themes.
- Full suite, unit, typecheck, lint, contrast; screenshots 390/1440 (moving and reduced);
  throttled home LCP/JS sample before/after (same script as B1).
- No dependency, no commit, staging, push or deployment.

## Results (2026-11-09)

- `e2e/chapters.spec.ts`: 7 tests, all failed against the pre-B2 build (`red.log`), all pass.
- The chapter cover rule gained an exclusion found while planning: the first photos of drops C
  and B are the home's `MUNDO` and hero photos, so the cover is the drop's first real photo not
  already shown big on the home (C → `slow-2025-12-30-05`, B → `slow-2025-08-24-05`), with its
  real alt text (those photos otherwise only appear as the cards' alt-less hover image).
- React Compiler lint flagged the rail hook's returned object as a ref (it fed `ref=`); fixed by
  removing `useRef` (the button finds its list via `closest`) and destructuring the hook result.
- After review, desktop photo capped at 60svh so the name starts in the chapter's first view.
- Final, fresh production build: `pnpm test:e2e --workers=4` **111 passed (40.7s)**; unit 28;
  typecheck 0; lint 0 errors (1 pre-existing warning); contrast 36/36; `git diff --check` clean.
- Throttled home samples (same script as B1: 390px, 150ms RTT, 200000 B/s, CPU ×4), three runs
  each: before 2748 / 2728 / 2716 ms, 651.65 KiB; after 2720 / 2708 / 2712 ms, 653.75 KiB
  (+2.1 KiB script). LCP is the hero photo and unchanged; **still above the 2.5s target**.
- Screenshots reviewed: chapters C and B at 390 and 1440 in preto (motion), branco (reduced
  motion, blue flood) and drop (reduced motion, current chapter on ink), plus a pre-wipe frame.
- Chromium only. No dependency, commit, staging, push or deployment.
