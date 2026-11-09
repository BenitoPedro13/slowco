# STATUS

## Decisions log

| Date | Decision | By | Recorded in |
| --- | --- | --- | --- |
| 2026-11-09 | Reuse the existing repository; no new folder, no `git init` | Benito | CLAUDE.md §1 |
| 2026-11-09 | **No Shopify in release 1**: checkout is a pre-filled WhatsApp message | Benito | CLAUDE.md §1, tasks/TASK-setup.md |
| 2026-11-09 | Creative direction is ours; client branding is the base, not a cage | Benito | 00 §C |
| 2026-11-09 | Component libraries as in `../desmolde` (shadcn + Magic UI + React Bits + canvasui + animate-ui, GSAP + Lenis); added per task, not wholesale | Benito | CLAUDE.md §5 |
| 2026-11-09 | Instagram collector copied from `../desmolde`; handle always explicit | Claude, for Benito | tasks/TASK-setup.md |
| 2026-11-09 | Client: Slow Company, Instagram `@slow_tm`; agency is Blessed Moon | Benito | CLAUDE.md §1 |
| 2026-11-09 | **Creative base: OUTFIT is the main reference; elements of Ethel Vaughn and Red and Green are used where they fit what `@slow_tm` shows** | Benito | 00 §D.4-D.5 |
| 2026-11-09 | **Site model: drops with an archive**; pieces from older drops may still be for sale, so availability is per product, not per drop | Benito | 00 §D.5 |
| 2026-11-09 | Instagram photos may be used on the site at the moments Claude judges best; consent of the people shown stays an open input before launch | Benito | 00 §B.3, 08 #9 |
| 2026-11-09 | **First moment to build: hero with theme switch**; then bag counter, drop mode, cursor | Claude, delegated by Benito | 00 §D.5 |
| 2026-11-09 | Definition docs `01`, `02`, `04`–`07` written; all values provisional until client files (`08` #2, #16) | Claude | tasks/TASK-definition.md |
| 2026-11-09 | Current drop accent = red `#d4110d` (2025 drops); neon green not found on garments, unused until the client names it | Claude, to confirm | 02 §3.1, 08 #17 |
| 2026-11-09 | Theme lives on `<html data-theme>` with our own init script, not next-themes; switch is native radios; changes throttled to ≥ 600ms (WCAG 2.3.1) | Claude | 04 §3, 06 §6 |
| 2026-11-09 | No Zustand / TanStack Query in release 1: catalogue read on the server, bag in a per-mount client store over localStorage | Claude | 06 §3, §4 |
| 2026-11-09 | Icons: Remix only (no lucide) | Claude | 06 §8 |
| 2026-11-09 | pnpm 12 build approvals committed in `pnpm-workspace.yaml` (no longer gitignored) | Claude | 06 §1.1 |
| 2026-11-09 | Benito: "continue until it's finished": T2–T10 run in order without stopping between tasks; no commits | Benito (via coordinator) | 07 |
| 2026-11-09 | Current drop accent **red**, **no green** | **default assumed by Claude, not yet confirmed by Benito** | 02 §3.1, 08 #17 (open) |
| 2026-11-09 | Default theme **preto for everyone**, system light/dark ignored | **default assumed by Claude, not yet confirmed by Benito** | 04 §3.4, 08 #18 (open) |
| 2026-11-09 | **Retire AlignUI** from new code; removed with the legacy pages in T8 | **default assumed by Claude, not yet confirmed by Benito** | 06 §8, 08 #19 (open) |
| 2026-11-09 | Voice: `sacola`, no emoji, `BEM-VINDO`, `raízes` | **default assumed by Claude, not yet confirmed by Benito** | 01 §5–6, 08 #20 (open) |
| 2026-11-09 | Client photos from @slow_tm used in the preview, paired with placeholder products | Benito (client agreed, per Benito) | 05 §9, 08 #9 |
| 2026-11-09 | Until the client sends products, the static catalogue holds **placeholder records** (`placeholder: true`), shown with a visible `DADOS DE EXEMPLO` notice, no prices, sizes labelled `A/B/C`, dates relative to the build | **default assumed by Claude, not yet confirmed by Benito** | 05 §0, 06 §3, 08 #22 (open) |

## Done

- 2026-11-09: setup (see `tasks/TASK-setup.md`).
- 2026-11-09: discovery of the Instagram (60 posts + 13 Reels, `00` §B) and the three site references (`00` §D).
- 2026-11-09: definition docs `01`, `02`, `04`, `05`, `06`, `07` (`tasks/TASK-definition.md`).
- 2026-11-09: T1 hero + theme switch, all checks pass, not committed (`tasks/TASK-T1-hero-theme.md`).
- 2026-11-09: T2 stack bump (Next 16.4.5, React 19.3.1, Tailwind 4.3.5, TS 5.9.3, ESLint 9.39.5 flat config), package renamed `slowco`, README rewritten. typecheck 0, build ok (`○ /`), contrast 36/36, `e2e/hero.spec.ts` 12 passed; repo lint 11 legacy errors (T8) (`tasks/TASK-T2-stack-bump.md`).
- 2026-11-09: T3 core: catalogue interface + static provider with **placeholder data** (08 #22), drop state, WhatsApp builder, price/date formats, Vitest 5.1.0. `pnpm test` 21/21, typecheck 0, build ok, hero e2e 12/12 (`tasks/TASK-T3-core.md`).
- 2026-11-09: T4 header + menu sheet (Radix Dialog) + bag (localStorage store, odometer counter, `/sacola`, WhatsApp link). unit 27/27, typecheck 0, build ok, e2e 21/21 incl. axe in 3 themes (`tasks/TASK-T4-header-bag.md`).
- 2026-11-09: T5 product page (`/produtos/[slug]`, sizes, add to bag, single-piece WhatsApp), `useNow` clock, `scripts/images/prepare.py` + `pnpm check:images`. product e2e 8/8, check:images exit 0 (`tasks/TASK-T5-product.md`).
- 2026-11-09: T6 drop page + drop mode (countdown, pause, in-place flip) + home sections; T7 `/arquivo`, `/contato`, 404, footer; T8 legacy removed (repo lint **0 errors**, 26 deps removed); T9 custom cursor, view-transition page wipe, focus on navigate; T10 `pnpm check:launch` (exit 1, lists blockers). typecheck 0, build ok. **E2E for T6–T9 not written/run**: Benito asked to test later, before committing.
- 2026-11-09: Photos: Benito wants the client's @slow_tm photos and says the client agreed (08 #9). 15 picks listed in `scripts/images/instagram-picks.tsv`; **`pnpm images:import` must be run by Benito** (the permission system blocked Claude from copying out of `references/`). Until then drawn `FOTO DE EXEMPLO` images are shown.
- 2026-11-09: Design pass (/frontend-design), within 02's system: hero top = live current-drop line (name, state, date, countdown chip); campaign photo fills the space above the giant wordmark (poster layout; the separate home photo band removed); garment legal lines set as a woven-label block; product cards show sizes (sold-out struck) and swap to the second photo on hover/focus (instant under reduced motion). typecheck 0, lint 0 errors, build ok, screenshots 1440/375. Photos were imported by Benito (`public/catalogo/slow-*.jpg` present).

- **2026-11-09: design moments + visual pass** (default assumed by Claude, not yet confirmed by Benito; TASK docs in `docs/tasks/TASK-M1…M6`):
  M1 entry loader (home, once per session, PULAR/Escape/click, CSS-timed ≈2.2 s, never under reduced motion);
  M2 wordmark breaks apart on scroll (CSS `animation-timeline: view()`, still fallback, no GSAP/Lenis);
  M3 duotone in the drop accent on editorial photos only (never product photos);
  M4 procedural wireframe globe stand-in (own canvas code, pause toggle, still under reduced motion; 08 #23);
  M5 sound deferred (08 #24); M6 eased cursor + accent VER disc + "SLOW MODE" marquee with pause toggle.
  Visual fixes: taller desktop hero photo, grid columns follow the item count, DROP ATUAL split layout,
  sticky product info, bag thumbnails, contact page with photo, archive hover photo, external links in a new tab (08 #25),
  horizontal overflow from the wordmark breakup clipped. JS on `/`: 245.2 KiB → 320.5 KiB uncompressed (11 files).
  Checks: `pnpm test:e2e` **49 passed**, `pnpm test` **27 passed**, `pnpm lint` 0 errors (1 warning in scripts/instagram/console.js), typecheck ok.

## Next

1. Benito: review T1 in a browser (`pnpm dev`), commit when happy.
2. Benito: answer `08` #18, #19; send `08` #3 notes; pass `08` #2, #4–#9, #14–#17, #20–#21 to the client.
3. T2 stack bump, then T3 core (`07`).
