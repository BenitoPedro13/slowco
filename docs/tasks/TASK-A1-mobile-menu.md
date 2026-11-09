# A1 — Verify mobile menu and unblock touch navigation

Date: 2026-11-09. Scope: `10` §D.1 (A1 menu, A2 sample banner, A4 development hint).

## Current scenario

The uncommitted mobile header moves theme radios into the menu and shortens the sample banner.
The previous mobile script timed out clicking MENU and captured the entry-loader photo.
No cause has been established. Existing changes belong to the user and must be preserved.

## Plan and rationale

1. Reproduce on a production build, Chromium touch/mobile 390×780, stored entry flag, 3.5 s wait.
   Inspect hit testing, loader state, cursor and view transitions; record evidence before fixes.
2. Add regression coverage for any demonstrated bug before changing application code. Verify
   tap → theme → close → persistence, keyboard focus containment/return, reduced motion,
   320 px reflow, 44 px primary targets and the one-line sample notice.
3. Fix demonstrated causes with the smallest change. Add the requested development-only
   WhatsApp configuration hint without exposing it in production.
4. Update behavior/content/status docs with executed checks and remaining work.

## Content assumptions

Existing placeholder catalogue and imported photos stay as supplied. No new client facts,
phone numbers, images or claims. The sample-data notice stays visible. No commits or deploys.
Hero redesign and the remaining backlog are subsequent tasks after this blocker is resolved.

## Expected affected files

`e2e/`, entry/header/theme/transition code as supported by reproduction, missing-number UI,
`src/content/strings.ts`, `docs/04-UX-LAYOUT-AND-MOTION.md`, `docs/05-CONTENT.md`,
`docs/STATUS.md`, and the review's A1–A4 verification notes.

## Verification

Run production browser reproduction and view screenshots. Record home JS and local LCP
(with environment caveat), run focused regressions followed by typecheck, lint, unit tests,
production build/full existing e2e suite and `git diff --check`. Do not claim checks not run.

## Follow-up errors reported during review

The hero photo change made the same source appear twice in the loader input, producing a React
key warning. Deduplicate the photo list before slicing; keep stable source-based keys.
The user also reported a recoverable ViewTransition InvalidStateError when the document is
hidden. Inspect the installed React/Next implementation and preserve usable navigation when
backgrounding a tab; add regression coverage for console errors and the visibility case.

The installed Next 16.4.5 vendored React DOM checks exact old cancellation messages, missing
Chromium's `. Document hidden` suffix (confirmed in its development bundle and upstream issue
https://github.com/react/react/issues/37669). Both follow-up regressions failed before fixes:
loader sources 4 unique / 5 total; navigation emitted the exact InvalidStateError.
Use a 280 ms Web Animations reveal on committed main content instead of document snapshots;
no first-load/reduced-motion/hidden-tab reveal, cancel on visibility or preference changes.
Keep route focus, avoid patching dependencies or globally filtering errors. Remove obsolete
snapshot CSS and update motion tests to verify the actual reveal and reduced-motion behavior.

## Completion checkpoint

Implementation and executed verification are recorded in `../STATUS.md` (2026-11-09 continuation).
Final suite: 73 e2e, 27 unit tests, successful production build/typecheck, lint 0 errors with one
existing warning, diff check clean. No commits. Remaining limitations and the next creative tasks
are explicit in STATUS; performance measurements precede the final page-reveal correction.
