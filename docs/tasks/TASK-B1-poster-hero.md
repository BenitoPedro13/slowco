# B1 — Full viewport campaign poster

## Scenario and intent
The hero still stacks a ticker, a 16:9 photo and a wordmark; wide screens push the
wordmark below the first viewport. Preserve the imported back-print campaign image and
all existing content. No new client claims or assets.

## Changes
Compose the photo, woven ticker and wordmark inside a single viewport poster. Keep
supporting legal copy below the poster. Use solid paper text over a dark bottom scrim
instead of blend modes, which cannot guarantee contrast. Store mobile and desktop
focal points in editorial data. Add a single 1.2s photo settle, disabled with reduced
motion and delayed behind the first-visit loader. No dependencies or additional JS.

## Verification
First prove a viewport geometry regression fails on the existing layout. Run hero,
mobile and motion e2e checks, axe in all themes, typecheck, lint and unit tests.
Review screenshots at 390/768/1440/1920, including reduced motion. Measure transferred
script bodies and throttled LCP before/after using the same browser settings. Record
results and any limitations in STATUS. Never build under a running production server.

## Executed results

- Initial regression run: 5 failed because poster composition did not exist.
- Full suite after implementation: 76 passed, 2 failed on desktop viewport geometry.
  Browser inspection identified the existing desktop label size override (13px, line-height
  16.9px); accounted for its 33.9px notice height. Tablet uses the concise notice.
- Final focused production run: 5 passed (11.5s), fresh build successful. The preceding
  full run passed all 73 existing tests, including axe in three themes and mobile menus.
- Unit tests: 27 passed. Typecheck exit 0. Lint: 0 errors, the existing collector warning.
- Viewed screenshots at 390/768/1440/1920 with reduced motion. Artifacts under
  `/tmp/slowco-b1/`; screenshots were recaptured after the final desktop height correction.
- Same local Chromium mobile profile before/after: 150ms latency, 200000 B/s download,
  93750 B/s upload, CPU ×4, fresh browser, entry marked seen, one sample per build.
  LCP 3240ms → 2640ms; fetched script bodies 677.31 → 677.31 KiB (uncompressed).
  This is diagnostic, not Lighthouse or a field percentile: **the <2.5s target is not met**.
  No dependencies or client JS added. Cross-browser and physical-device review remain open.

The final campaign image explicitly requests high fetch priority; the 3192ms interim
sample became 2640ms after this change. The 2.5s target remains open.
