# B7 — Editorial product page

## Scenario
The product page stacks photographs beside sparse information. B1's visual composition
is implemented; its single-sample throttled LCP remains above 2.5s and is tracked separately.
Preserve all existing working-tree changes and catalogue/content gates.

## Plan and assumptions
Use only existing imported product images. Add native scroll-snap gallery with counter,
44px photo controls and a Radix lightbox (arrows, Escape, focus return). Abstract browser
synchronization in a gallery hook. Preserve browser zoom. Add quantity 1–99 to both bag
and direct order actions, sticky mobile actions with reserved space and safe-area padding,
sticky desktop information, honest missing-data block, garment legal label and same-drop
rail. No new client facts or dependencies. Missing measurements/fabric remain explicitly
unconfirmed; existing price gate remains intact.

## Files and verification
Product page/components/hooks/CSS, strings/content docs, e2e/product-editorial.spec.ts.
Prove new interaction checks fail before code. Run product tests, reduced motion,
keyboard/lightbox focus, mobile geometry, axe, unit tests, typecheck, lint, build, diff check.
Inspect screenshots at mobile/tablet/desktop and measure matching local JS/LCP samples.
Stop production servers before rebuilding. No staging, commits, push or deployment.

## Executed checkpoint
Initial new tests: 6 failed on the original page. First implementation exposed a WCAG
label-in-name problem (visible 01 vs accessible 1); changed visible selector to 1.
Product + editorial checks then passed: 15 passed (20.2s), including all existing product
checks, dialog axe/focus, mobile/tablet geometry and the direct-message quantity/99 cap.
Reviewed screenshots at 320/390/768/1440 and the mobile lightbox under /tmp/slowco-b7/.
Local matching throttled product samples: LCP 2160 → 1952ms, script bodies
696.61 → 701.83 KiB uncompressed. Single Chromium samples, not field percentiles.
Lint identified ref-object inference and implicit alt props; destructured the gallery hook
and made alt explicit. Final full validation will be recorded in STATUS.
