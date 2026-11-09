# TASK M1: entry loader (design moment a)

Technique (from 00 §C, OUTFIT: black screen, the word over stacked photo cards, a counter),
re-made with Slow's own material; no OUTFIT code, copy, layout or assets.

- Home only. Black (`--ink`) overlay: five client campaign photos (05 §9) stacked as cards, each
  revealed by a clip-path in turn; the `SLOW` stand-in wordmark over them; a 000→100 counter
  (CSS `@property` integer). Leaves with one upward wipe (≈2.2 s total).
- **Timing is pure CSS**: with no JS it still ends; the page is server-rendered underneath (never
  blocks content). Not a full-screen alternation (one wipe, no flashes; 2.3.1).
- Once per session: the head init script sets `html[data-entrada=vista]` when
  `sessionStorage` `slow:entrada` exists (or reduced motion), and writes the flag on the first
  visit. `[data-entrada=vista]` hides the loader before paint.
- Skip at any moment: `PULAR` button (focusable, first in the overlay), Escape, or a click.
- Reduced motion: never shown.
- Test: e2e (shown on first visit, gone after skip, not shown on reload in the same session, not
  shown under reduced motion).
