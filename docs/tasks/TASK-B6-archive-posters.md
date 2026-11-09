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

## Results
Initial 4 regressions failed before implementation. Iteration corrected radio hit areas,
immediate optimistic selection and the filter label. Back-navigation test now waits for
the outgoing URL to commit before requesting back. Final suite: 97 passed (36.5s), including
all archive and prior page tests, axe in three themes and reduced motion. Poster screenshots
reviewed at desktop; mobile captures in /tmp/slowco-b6/. No pre-change archive performance
sample was captured. Final local throttled sample: LCP 3796ms, script bodies 655.25 KiB;
performance remains a follow-up, not a passed target. All launch gates remain intact.
