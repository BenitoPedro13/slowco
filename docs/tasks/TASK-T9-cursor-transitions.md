# TASK T9: cursor + page transitions

## Done (2026-11-09)

- `CustomCursor` + `useCustomCursor`: only for `(hover: hover) and (pointer: fine) and
  (prefers-reduced-motion: no-preference)`; 12px accent dot, 32px ring over links/buttons/labels,
  72px disc with `VER` over product images (`data-cursor="ver"`); `aria-hidden`; text inputs keep
  the I-beam; position via `transform` in rAF only while the pointer moves.
- Page transitions: React `<ViewTransition default="page-wipe">` around the page content (Next
  16.3+ needs no config; `ViewTransition` exported by React 19.3 / `@types/react` 19.3.0); new page
  wipes up 280ms; header stays; off under reduced motion.
- `useFocusOnNavigate`: after a client navigation focus moves to `<main id="conteudo">`.

## Checks run

typecheck 0, lint 0 errors, build ok. Not run: cursor/transition e2e and a visual check of the
wipe (headless screenshots cannot show it). Unverified in Safari/Firefox.
