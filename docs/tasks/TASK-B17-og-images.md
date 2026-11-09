# B17 — Complete Open Graph images for every page

Date: 2026-11-09. Requested in the user's follow-up, after an interrupted implementation.

## Scenario and plan

Uncommitted image routes exist for home, archive, contact, bag, drops and products, plus a shared
`next/og` renderer and metadata base. The previous attempt received 404s against an old server.
Read installed Next API documentation, preserve this work, validate the generated metadata URLs
against a fresh production server, and repair any real rendering/content issues. All catalogue
placeholders must remain visibly identified in social cards; titles/alt text belong in content.
Use only existing public images and an environment-configured site origin (domain is still an
open input). Check 404 inheritance too. No invented domain/client facts, commits or deployment.

## Files and checks

`src/app/**/opengraph-image.tsx`, `src/lib/og/render.tsx`, metadata/config/content, relevant docs,
and `e2e/og.spec.ts`. Check actual metadata URLs, PNG content/type/dimensions, route-specific
images, Twitter summary cards, missing-photo fallback and visual previews. Run build, typecheck,
lint, full unit/e2e suite and diff check together with A1. Record actual outputs in STATUS.

## Completion checkpoint

Implementation and executed verification are recorded in `../STATUS.md` (2026-11-09 continuation).
Final suite: 73 e2e, 27 unit tests, successful production build/typecheck, lint 0 errors with one
existing warning, diff check clean. No commits. Remaining limitations and the next creative tasks
are explicit in STATUS; performance measurements precede the final page-reveal correction.
