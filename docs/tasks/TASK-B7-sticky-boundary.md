# B7 — Contain sticky product information

## Report and cause
User screenshot shows the sticky information column overlapping the same-drop rail after
scrolling. Both sections share the main grid's containing block, so the sticky column can
travel into the related section. This was missed by the initial top-of-page screenshots.

## Fix and verification
Wrap only the gallery and information column in their own grid/containing block. Keep the
same-drop section after that block. Add a regression that scrolls related products into view
and asserts that sticky information ends before the related section, in all themes and at
wide desktop sizes. Confirm the regression fails before fixing code. Inspect the scrolled
screenshots and rerun product/related/full checks with the current drawer/archive changes.
No new copy, assets, dependencies, staging, commits or deployment.

## Results
All 6 new scrolled regressions failed before the boundary fix and passed after it.
Viewed scrolled captures matching the user's 2048px report in all three themes.
Final complete e2e suite: 97 passed (36.5s). No overlay remains in these tested cases.
