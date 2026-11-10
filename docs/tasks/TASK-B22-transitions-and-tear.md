# B22 + paper tear — Drop-accent curtain, no reveal on back/forward, torn chapter edges

Source: `docs/10-IDEAS-AND-UX-REVIEW.md` §B22, `docs/09-HANDOFF-NEXT.md` §5.4 item 3, rule D2.
Started 2026-11-09.

## Current scenario

`usePageReveal` clip-reveals `main#conteudo` (280 ms) after **every** path change, including
browser back/forward (B22 says never on restores). Navigating to a drop looks the same as any
other page. Chapters (B2) meet each other with straight edges.

## Planned changes

1. **Back/forward:** the hook listens to `popstate` (effect with cleanup) and skips the reveal
   for the path change that follows it.
2. **Drop curtain:** drop pages mark their `<main>` with `data-curtain-accent=<accent>`. On an
   in-app navigation to such a page, a fixed, aria-hidden curtain (`RouteFocus` renders it) in
   that drop's accent sweeps up over the viewport and off the top: one Web Animation, 420 ms
   (≤ 450 ms; Slow Mode doubles it), instead of the plain content reveal. The drop theme uses
   ink when the accent equals the page colour. Flash rule: at most one curtain per 1000 ms
   (rapid navigation gets the plain reveal), never under reduced motion, never in a hidden tab,
   never on back/forward. The page is already committed underneath; focus handling unchanged.
3. **Paper tear (static):** each chapter's bottom edge hangs a 16 px torn strip in the chapter's
   own colour over the next section (`::after`, a fixed irregular `clip-path` polygon of our
   own; no fragments, no motion, so nothing to change under reduced motion). Chapters get a
   descending `z-index` so each tear sits over the following chapter/marquee, below the sticky
   header (z 30). The next section's top padding (≥ 24 px) keeps content clear of the strip.
   Parallax skipped (optional in 09; restraint).

## Affected files

`src/hooks/use-page-reveal.ts`, `src/components/transitions/route-focus.tsx` (+ css),
`src/app/drops/[slug]/page.tsx`, `src/components/chapter/{flood-section,drop-chapter}.tsx`,
`src/components/chapter/chapter.css`, `src/app/page.tsx`, `docs/04`, `e2e/transitions.spec.ts`.

## Verification

`e2e/transitions.spec.ts` red first: navigating archive → drop B runs one curtain animation in
`azul` with duration ≤ 450 ms and no content reveal; back returns without any reveal or
curtain; reduced motion: no curtain; two drop navigations within 1 s give one curtain; chapter
`::after` is a polygon hanging below the chapter. Existing T9 reveal/focus tests must still
pass. Full suite and checks; screenshot of the tear between chapters and of a mid-curtain frame.

## Results (2026-11-09)

- `e2e/transitions.spec.ts`: the curtain, throttle and tear tests failed before the code
  (`red.log`); the reduced-motion test passed before too (it guards that nothing animates, which
  was already true) and still passes.
- Mid-curtain frame reviewed (archive → drop B: blue sweeping up over the committed page);
  junctions C→B and B→marquee reviewed in preto and branco with the torn strip in each
  chapter's colour. Review also tightened the still marquee's wrapped leading (1.05) so accents
  no longer touch the line above.
- Final, fresh production build: `pnpm test:e2e --workers=4` **124 passed (39.9s)** (existing
  T9 reveal/focus/hidden-tab tests unchanged and passing); unit 28; typecheck 0; lint 0 errors
  (1 pre-existing warning); contrast 36/36; images 0 with metadata; diff check clean.
- Slow Mode doubles the curtain to 840 ms by design (the visitor asked for slower motion).
- Chromium only. No dependency, commit, staging, push or deployment.
