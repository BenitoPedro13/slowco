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
