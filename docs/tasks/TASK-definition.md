# TASK: definition (docs 01, 02, 04, 05, 06, 07)

## Current scenario

Discovery done (`00`: 60 posts, 13 Reels, three site references). Benito's decisions are in
STATUS (2026-11-09): OUTFIT as the main reference, drops with an archive, per-product
availability, Instagram photos allowed with consent pending, first moment = hero + theme switch.
Docs `01`–`07` were reserved.

## Planned changes

1. `01-BRAND-BOOK.md`: idea (Slow Mode, "devagar e sempre"), essence, audiences, personality,
   line bank L1–L18 from the client's own captions, voice rules with do/don't from real captions,
   claim discipline.
2. `02-VISUAL-IDENTITY.md`: colours measured from slides (Pillow medians), tuned only for
   contrast; theme × accent contrast matrix computed by script; Archivo + Geist Mono (OFL),
   verified in next/font's data; spacing, grid, motion tokens; photo treatment; mark rules and the
   typographic stand-in.
3. `04-UX-LAYOUT-AND-MOTION.md`: IA, hero + switch in full, bag counter, drop mode, cursor,
   transitions, WCAG 2.2 AA decisions. `03` stays unwritten (stated in `04`).
4. `05-CONTENT.md`: every public string by ID, with gates (`lançamento` vs `render #N`), the
   WhatsApp template.
5. `06-ARCHITECTURE.md`: versions checked on the npm registry (2026-11-09), catalogue interface,
   bag, `wa.me` format (verified on WhatsApp's FAQ), theme mechanics, images, libraries, tests,
   legacy fate by task.
6. `07-IMPLEMENTATION-PLAN.md`: T1–T10, T1 fully specified.
7. `08` (#2 detailed, #16–#21 added), STATUS, `CLAUDE.md` doc table.

## Why

Definition before implementation (`CLAUDE.md` §2). T1 needs only `02`, `04` §3, `05` §1–2, `06` §6.

## Affected files

`docs/01-BRAND-BOOK.md`, `02-VISUAL-IDENTITY.md`, `04-UX-LAYOUT-AND-MOTION.md`, `05-CONTENT.md`,
`06-ARCHITECTURE.md`, `07-IMPLEMENTATION-PLAN.md` (new); `08-OPEN-INPUTS.md`, `STATUS.md`,
`CLAUDE.md` (edited); `pnpm-workspace.yaml` (created by `pnpm approve-builds`, needed to install).

## Verification

- Colour medians and contrast ratios: scratch Python scripts (session scratchpad, not in the
  repo); the shipped check is `pnpm check:contrast` from T1.
- Archivo axes: `node_modules/next/dist/compiled/@next/font/dist/google/font-data.json`.
- Registry versions: `https://registry.npmjs.org/<pkg>` `dist-tags.latest` + publish time.
- `wa.me`: https://faq.whatsapp.com/5913398998672934 (read 2026-11-09).
- Cross-doc task numbers reconciled (`04` routes table ↔ `07` T-list).

## Result (2026-11-09)

Written. Findings that changed the brief: **no neon green on any garment** (`08` #17); the 2025
drop is red + navy + white, so red is the current accent; the measured red `#e1100c` fails
4.5:1 with white text by a hair (4.50), so `#d4110d` is used (4.96).
