# B8 — Bag drawer and exact message preview

## Scenario and changes
The header navigates directly to /sacola and checkout text is hidden in the WhatsApp URL.
Open a right drawer from the header, retaining its real /sacola anchor as the no-JS fallback.
Reuse BagView for both surfaces, with compact styling in the drawer; /sacola remains reachable.
Show the exact shared formatOrderMessage output in a wrapping monospaced preview, beside
name and send action. No new message template, facts or data storage. Missing WhatsApp
configuration continues to gate sending. Use installed Radix Dialog for focus/Escape/inert
background, 250ms CSS entry, no animation under reduced motion. Close before internal navigation.

## Verification
Fail drawer regression before code. Compare preview to decoded link text (browser integration
and unit check against the shared builder), name/quantity/remove updates, focus trap and return,
mobile reduced motion, axe, full suite/typecheck/lint/unit/build, screenshots. Preserve all
existing changes. No commits, staging, push or deploy.

## Results
Both drawer tests failed before implementation. Final full suite: 97 passed (36.5s),
including preview/decoded URL equality, live name and quantity, focus trap/return, full-page
navigation and mobile reduced-motion empty state. Existing bag tests now scope product
headings to the product list because preview has its own heading. Unit URL round-trip
covers an order with multiple lines, 99 units, Unicode and literal percent signs.
Unit suite: 28 passed. Typecheck exit 0; lint only the pre-existing collector warning.
Screenshots: /tmp/slowco-review/. Final home throttled sample: LCP 2996ms, script bodies
651.38 KiB; product 1984ms / 659.53 KiB. Samples are diagnostic, not field percentiles.
No new dependency, commit, staging, push or deployment.
