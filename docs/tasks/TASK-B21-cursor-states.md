# B21 — Cursor states beyond VER (+ mouse drag on rails)

Source: `docs/10-IDEAS-AND-UX-REVIEW.md` §B21, `09` §5.4 item 4 (cursor as brand gesture).
Started 2026-11-09.

## Current scenario

The decorative cursor (`useCustomCursor`, fine hovering pointer, no reduced motion) has three
modes: dot, ring over interactive elements, and an accent `VER` disc over product photos
(`data-cursor="ver"`). It squeezes on press. Mode is chosen by `closest("[data-cursor=ver]")`
first, so any `data-cursor` on a large container would override the links inside it.

## Planned changes

1. **Generic labelled modes.** `data-cursor="ver" | "pedir" | "arrastar"`; the cursor shows the
   accent disc with `VER` / `PEDIR` / `ARRASTAR` (`CUR-*` strings, label set imperatively on the
   aria-hidden element). Mode = the *nearest* of `[data-cursor]` or an interactive element, so a
   link inside a rail keeps the ring and a photo inside a link keeps `VER`.
2. **`PEDIR`** on the two actions that open an order in WhatsApp: `PEDIR SÓ ESTA PEÇA` (product)
   and `PEDIR NO WHATSAPP` (bag page and drawer). `ADICIONAR À SACOLA` keeps the ring (it does
   not order).
3. **`ARRASTAR`** on the chapter rails (`<ul>` of B2). The label must be true, so the rails get
   mouse drag-to-scroll in `useRail`: pointer events for `pointerType === "mouse"` only, snap
   suspended while dragging and restored after (so it settles on a card), and a click after a
   drag of more than 6 px is cancelled (no accidental product navigation). Touch and trackpad
   keep native scrolling; keyboard keeps the cards and the arrows. Works whether or not the
   custom cursor is shown (reduced motion only hides the cursor; dragging is not motion).
4. Press squeeze stays; native `cursor: text` stays on text fields (unchanged rule).

## Content assumptions

`CUR-PEDIR` `PEDIR`, `CUR-ARRASTAR` `ARRASTAR` (provisional, decorative, aria-hidden).

## Affected files

`src/hooks/use-custom-cursor.ts`, `src/components/cursor/custom-cursor.{tsx,css}`,
`src/hooks/use-rail.ts`, `src/components/chapter/{rail.tsx,chapter.css}`,
`src/components/product/product-purchase.tsx`, `src/components/bag/bag-view.tsx`,
`src/content/strings.ts`, `docs/04`, `docs/05`, `e2e/cursor-states.spec.ts`.

## Verification

`e2e/cursor-states.spec.ts` red first: `PEDIR` over the product's WhatsApp button and the bag's
send link; `ARRASTAR` over the rail gap, ring over a card title inside it, `VER` over a card
photo; mouse drag scrolls the rail and does not navigate; a plain click on a card still
navigates; cursor still absent under reduced motion / touch (existing tests). Full suite and
checks. No dependency, commit, staging, push or deployment.

## Results (2026-11-09)

- `e2e/cursor-states.spec.ts`: 3 tests, all failed against the pre-B21 build (`red.log`), all
  pass. The drag test proves the rail scrolls > 100px under a mouse drag that started on a
  product photo link, the URL stays `/`, and a plain click on a card still navigates.
- Visual review: the first `PEDIR` disc (centred, 72px) covered the button's own label. Moved
  it above-right of the pointer for that mode only; recaptured and reviewed. `ARRASTAR` uses an
  88px disc for the longer word.
- Known limitation: the disc is the page accent; over a chapter flooded with the same accent it
  is separated only by its 1px canvas outline. Acceptable for a decorative cursor; revisit if
  Benito finds it weak.
- Final, fresh production build: `pnpm test:e2e --workers=4` **120 passed (35.3s)**; unit 28;
  typecheck 0; lint 0 errors (1 pre-existing warning); contrast 36/36; `git diff --check` clean.
- Chromium only. No dependency, commit, staging, push or deployment.
