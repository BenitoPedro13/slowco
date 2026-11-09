# TASK M2: wordmark breaks apart on scroll (design moment b)

Technique (00 §C, OUTFIT: on scroll the letters break apart into shapes). Own implementation.

- CSS scroll-driven animation (`animation-timeline: view()`, range `exit`) on each hero letter:
  S, L, O, W each drift and rotate in their own direction as the hero leaves the viewport, and
  reassemble when scrolling back (scroll-linked, so it follows the user, nothing autoplays).
- No GSAP / Lenis: 06 §8 allows them only if needed; CSS covers this with zero JS.
- Fallback: `@supports not (animation-timeline: view())` and reduced motion: the still wordmark.
- Test: e2e checks the rule is inside `@supports` + `no-preference` and the letters are untransformed
  under reduced motion.
