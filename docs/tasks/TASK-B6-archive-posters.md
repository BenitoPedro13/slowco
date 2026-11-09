# B6 — Archive poster wall

## Scenario and plan
Replace the plain archive list with campaign poster tiles, newest first, reusing only
existing public product photos as clearly provisional drop covers. Keep text on solid
canvas panels so photo opacity/duotone never affects contrast. Preserve state labels,
including upcoming drops. Count products that are actually purchasable (not units of stock).

Native radio filters TODOS / DISPONÍVEL / ESGOTADO use shareable `?estado=` values.
Unknown filters default to all. Filter navigation preserves scroll and back/forward state.
Animate surviving tiles using measured FLIP transforms, <=250ms, with cleanup and a still
reduced-motion equivalent. Photo duotone appears on hover/focus; no product photo tinting.

## Verification
Fail filter regression before implementation. Run archive/page and full regressions,
axe in all themes, keyboard filtering, URL reload, reduced motion/no overflow, screenshots,
matching JS/LCP samples, typecheck/lint/unit/build/diff checks. No new dependencies,
client facts, commits, staging or deployment. Existing launch blockers remain open.
