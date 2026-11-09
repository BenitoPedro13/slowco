# TASK M4: wireframe globe object (design moment d)

The globe is the brand's recurring motif (00 §B: teaser film, back prints). The client's own
globe artwork is NOT traced or redrawn: this is a **generic procedural wireframe sphere**
(meridians and parallels, orthographic projection) on a 2D canvas, a placeholder stand-in
(`data-standin="globo"`, 05, 08 #23) until the client decides.

- Home closing band, next to `SEJA BEM-VINDO AO SLOW MODE`. Drawn in `--content`, accent equator.
- Rotates slowly (one turn ≈ 40 s); a `PAUSAR GLOBO` / `GIRAR GLOBO` toggle (2.2.2, it moves > 5 s);
  stops when off-screen (IntersectionObserver) and when the tab is hidden.
- Reduced motion: one still frame, no toggle. Canvas `aria-hidden` (decorative).
- No library (no ogl/three): ~100 lines.
- Test: e2e toggle + still under reduced motion.
