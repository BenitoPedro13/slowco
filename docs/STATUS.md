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
| 2026-11-09 | **Direction A: animated / cinematic** (Benito: "animada"); motion cap of 2-3 moments per screen proposed, unconfirmed | Benito | 09 §4, §5.4 |

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

## 2026-11-09 — A1/A2/A3/A4 + B17 continuation

Implemented and uncommitted (preserve all existing working-tree changes):

- Mobile header now visibly says SLOW / SACOLA + counter / MENU. The earlier bag label was
  still hidden at small widths. Shortened the sample notice to one line at 320px, keeping 12px
  text. Labelled theme radios remain inside the Radix menu.
- Exact mobile reproduction initially opened the menu. A later failure was traced to JS chunk
  HTTP 500s after `.next` changed under an old production server. Restarting against the current
  build restored hydration; no overlay/cursor input interception was reproduced. Touch e2e now
  covers open/theme/wipe/focus/Escape/close/reload/navigation, reduced motion and first-visit intro.
- A3 selects the existing white 2025/SLOW APPAREL COMPANY back-print photo, with focal point
  50%/27%. Viewed screenshots at 320/390/1280/1440/1920/2560. The 16:9 desktop photo can extend
  below the initial viewport at wide sizes: B1's viewport poster is **still pending**.
- Confirmed quantity 99 with disabled increase button in the browser. Missing-number product
  and filled-bag states now have a development-only WhatsApp configuration hint. Verified on
  the existing dev server at localhost:3000 (3300 could not start because that dev server exists).
- B17: OG routes for home/archive/contact/bag/every drop/every product; 404 inherits home.
  PNGs 1200×630, Twitter large-image metadata, visible sample-data notice, readable paper/ink
  text. Unknown product/drop image routes now return 404 (regression was 200 before correction).
  `NEXT_PUBLIC_SITE_URL` must be the actual origin before deployment; domain still open.
- User-reported duplicate loader key fixed by deduplicating input photos before selecting five.
- User-reported hidden-document InvalidStateError reproduced with a deterministic browser-API
  rejection. Installed React's exact message matching misses Chromium's new suffix (upstream
  react/react#37669). Removed the document snapshot wrapper; `usePageReveal` keeps the 280ms
  content reveal, skips hidden/reduced-motion/first load and cancels on hide/preference change.
  No global error suppression or dependency upgrade. Both regression tests failed before fixes.

Executed validation (actual output, final code):

```text
pnpm test:e2e --workers=4
73 passed (37.8s)
# Playwright performed a fresh successful production build first.
pnpm test
Test Files  4 passed (4)
Tests  27 passed (27)
pnpm typecheck
$ tsc --noEmit
# exit 0
pnpm lint
1 problem (0 errors, 1 warning)
# pre-existing unused url in scripts/instagram/console.js:257
pnpm check:contrast
all 36 pairs pass
pnpm check:images
checked 16 image(s) under public: 0 with metadata
git diff --check
# no output
```

Browser checks were Chromium emulation, not physical phones/Firefox/WebKit. Axe checks passed
in the existing suite and mobile menu tests. No Lighthouse/throttled LCP run. Local unthrottled
390px LCP before/after photo change: 64ms/224ms; home script bodies 690.92/691.20 KiB over 13
script URLs. These were captured **before** the final snapshot-to-content-reveal correction,
so do not treat them as final performance numbers or compare them to historical chunk counts.
Screenshots and logs from this session are in `/tmp/slowco-a1/` (temporary, not committed).
The OG missing-file fallback was not separately exercised; normal routes and unknown slugs were.
Production test servers were stopped; the pre-existing dev server on port 3000 was left alone.
Never rebuild `.next` under `next start`; stop/restart to avoid stale manifests/chunk failures.

## Next

1. Read `CLAUDE.md`, `09`, this current STATUS and `10`; current STATUS supersedes older claims
   that A1/OG remain unverified. Task records: A1 mobile menu, A3 hero photo and B17 OG images.
2. B7/B6/B8 are implemented (latest checkpoint below). Continue performance follow-up, then B11/B15/B20;
   then B11/B15/B20, B2 cinematic chapters and the remaining backlog in order.
3. Direction is animated/cinematic. Do not invent client facts; preserve the example-data labels
   and gates. Data-dependent blocks remain hidden until inputs arrive; no fabricated dates,
   stock, event venues, VIP links, prices, credits or phone numbers.
4. Finish remaining visual review/performance/cross-browser checks as relevant to each change.
   Every implementation task needs its own task doc before code. No commits, staging, push or
   deployment unless Benito explicitly asks.

- **Handoff:** `docs/09-HANDOFF-NEXT.md` (older state; use this update where it differs).
- **Backlog:** `docs/10-IDEAS-AND-UX-REVIEW.md` (detailed specs and ordered improvements).

## 2026-11-09 — B1 poster continuation

Implemented in `tasks/TASK-B1-poster-hero.md`: viewport campaign poster with overlaid
woven drop ticker and SLOW wordmark, per-breakpoint focal points, one 1.2s photo settle
and still reduced-motion composition. Supporting legal copy remains below. Solid paper
text over a bounded black scrim provides a worst-case contrast of approximately 11.6:1.
The existing example notice uses its concise version below 1280px, remains persistent,
and keeps the current catalogue/consent/content blockers intact. No new dependencies.

Actual validation:

```text
pnpm test:e2e --workers=4
76 passed, 2 failed (35.2s)
# All 73 existing tests passed. Two new desktop geometry checks exposed the 13px label override.
# Corrected the poster calculation for the actual 33.9px desktop notice.
pnpm test:e2e e2e/poster.spec.ts --workers=4
5 passed (11.5s)
# Fresh successful production build; final geometry and reduced-motion checks passed.
pnpm test
Tests 27 passed (27)
pnpm typecheck
# exit 0
pnpm lint
# 0 errors, 1 pre-existing unused-url warning in scripts/instagram/console.js
```

Viewed campaign screenshots at 390/768/1440/1920 in Chromium with reduced motion;
files/logs under `/tmp/slowco-b1/` (temporary). Screenshots were recaptured after the desktop height correction and reviewed. Existing axe checks passed in all themes in the full run.
Local throttled mobile sample (150ms RTT, 200000 B/s down, CPU ×4): LCP 3240 → 2640ms;
uncompressed script bodies unchanged, 677.31 KiB. **B1's <2.5s LCP target remains unmet**;
these single samples are not field measurements or Lighthouse scores. No cross-browser or
physical-phone validation. Production servers stopped before every build; no staging,
commits, push or deployment. B7 and the subsequent creative backlog remain unimplemented.

The final campaign image explicitly requests high fetch priority; the 3192ms interim
sample became 2640ms after this change. The 2.5s target remains open.

## 2026-11-09 — B7, B6, B8 and reported sticky overlap

Implemented and uncommitted:
- B7: native snap gallery, counter/selectors, Radix lightbox with arrows/Escape/focus return,
  quantity 1–99 for bag/direct WhatsApp, sticky mobile actions, honest missing-data block,
  legal label and same-drop rail. Initial product tests: 15 passed.
- User screenshot exposed sticky information overlapping related cards when scrolled.
  Added TASK-B7-sticky-boundary and 6 regressions (all failed before the correction).
  Main gallery/info now has its own containing grid; related rail is outside it. Reviewed
  the matching scrolled position in all three themes at 2048px; all 6 regressions passed.
- B6: archive poster wall, provisional existing-photo covers, real derived state/count,
  native URL filters, optimistic selection, 240ms FLIP, still reduced-motion state.
- B8: header drawer, shared BagView, name/quantity/remove, exact message preview and
  full-page link. Missing WhatsApp configuration still gates sending.

Final executed validation:
```text
pnpm test:e2e --workers=4
# Fresh successful production build; initial full run exposed test assumptions about
# added preview headings and the changing bag accessible name, corrected in tests.
PW_REUSE=1 pnpm test:e2e --workers=4
97 passed (36.5s)
# Reused the same current production build after test-only corrections.
pnpm test
Test Files 4 passed (4)
Tests 28 passed (28)
pnpm typecheck
# exit 0
pnpm lint
# 0 errors, 1 pre-existing unused-url warning in scripts/instagram/console.js:257
git diff --check
# no output
```

Screenshots/logs in /tmp/slowco-b7/, /tmp/slowco-b6/, /tmp/slowco-review/.
Reviewed product at 320/390/768/1440, mobile lightbox, scrolled sticky boundary at 2048
in three themes, archive posters and drawer. Browser checks remain Chromium emulation.
Matching local throttled product samples: LCP 2160 → 1952ms, JS 696.61 → 701.83 KiB
before/after B7. Final combined build: product 1984ms / 659.53 KiB, archive 3796ms /
655.25 KiB, home 2996ms / 651.38 KiB. Uncompressed script bodies; single local samples
(150ms latency, 200000 B/s download, CPU ×4), not Lighthouse or field percentiles.
No pre-change archive sample. **Home B1 <2.5s target remains open; archive performance
also needs follow-up.** Do not claim performance acceptance or cross-browser coverage.

Next: performance follow-up, then B11/B15/B20, B2 cinematic chapters; data-dependent
ideas stay gated. B7/B6/B8 are now implemented and supersede their older pending notes.
No staging, commits, push or deployment. Stop any owned production server before rebuilding.

Final browser closeout: filled drawer fits horizontally at 320/390/1440px, with bounds
0–900px in the 900px viewport. Reviewed the 320px viewport capture and scrolled white-theme
product capture. Owned production server on 3100 stopped; no build was changed underneath it.
Contrast: all 36 pairs pass. Image metadata: 16 images checked, 0 with metadata.

## 2026-11-09 — B11 / B15 / B20 (new session)

The previous working tree had been committed by Benito (`4f8f3c4`). Implemented, uncommitted,
in `tasks/TASK-B11-B15-B20-truthful-surfaces.md`:
- B11 marquee carries the live current-drop line + countdown and the purchasable-piece count
  (aria-hidden; sr copy brand-only); still and complete under reduced motion.
- B15 footer as a woven care label with the sample-data line and `VOLTAR AO TOPO`.
- B20 404 `SEM SINAL` over the greyscale staircase photo with links to the drop and home;
  empty bag names the next drop and date while it is still to open.
- Archive count singular fixed (`1 peça ainda disponível`).

Executed validation:
```text
pnpm test:e2e --workers=4   104 passed (1.1m)   # fresh production build
pnpm test                   28 passed
pnpm typecheck              exit 0
pnpm lint                   0 errors, 1 pre-existing warning (scripts/instagram/console.js)
pnpm check:contrast         all 36 pairs pass
git diff --check            clean
```
Chromium only; no new performance sample (no image or script weight change on first load
beyond the marquee hook). **Still open:** home LCP < 2.5 s (B1) and archive LCP follow-up.

B2 followed in the same session (next section).

## 2026-11-09 — B2 drop chapters + D2 flood

Implemented, uncommitted, in `tasks/TASK-B2-drop-chapters.md`: the home's two card sections are
replaced by one full-bleed chapter per drop (cover photo, giant name, live status for the current
drop, scroll-snap rail with arrows) with a one-time colour flood in the drop's accent (D2: once
per chapter, 900ms, never on a timer; none under reduced motion; server-rendered complete).
No new dependency (CSS + IntersectionObserver/ResizeObserver from ref callbacks).

```text
pnpm test:e2e --workers=4   111 passed (40.7s)   # fresh production build
pnpm test                   28 passed
pnpm typecheck              exit 0
pnpm lint                   0 errors, 1 pre-existing warning
pnpm check:contrast         all 36 pairs pass
git diff --check            clean
home throttled (3 runs)     before 2716–2748 ms / 651.65 KiB; after 2708–2720 ms / 653.75 KiB
```
Chromium only. **Open:** home LCP still ≈ 2.7 s on this profile (the hero photo; B1 target
2.5 s); archive LCP follow-up; Firefox/WebKit/real-phone checks of the scroll-driven moments.

Next (`10` §D): optional/no-data items such as B14 Slow Mode toggle, B21 cursor states, B22
transition polish, 09 §5.4.3 paper-tear edges; data-gated items (B3, B4, B5, B9, B10, B12, B18)
stay hidden until the client's inputs arrive. No staging, commits, push or deployment.

## 2026-11-09 — B14 Slow Mode

Implemented, uncommitted, in `tasks/TASK-B14-slow-mode.md`: a site-level "Slow Mode" switch
(mobile menu + footer) that halves the speed of all motion and starts the marquee and globe
paused; OS reduced motion forces it on. Name/copy provisional (`10` §E question 2). Also fixed a
pre-existing marquee bug (focus on its own toggle kept it paused after `RODAR FAIXA`).

```text
pnpm test:e2e --workers=4   117 passed (35.2s)   # fresh production build
pnpm test                   28 passed
pnpm typecheck              exit 0
pnpm lint                   0 errors, 1 pre-existing warning
pnpm check:contrast         all 36 pairs pass
git diff --check            clean
```
Chromium only. Open items unchanged (home LCP ≈ 2.7 s throttled, archive LCP, cross-browser).
Next: B21 cursor states, B22 transition polish, paper-tear edges (09 §5.4.3); data-gated items
stay hidden. No staging, commits, push or deployment.

## 2026-11-09 — B21 cursor states + rail drag

Implemented, uncommitted, in `tasks/TASK-B21-cursor-states.md`: `PEDIR` cursor disc on the two
WhatsApp order actions, `ARRASTAR` on the chapter rails, which now also scroll by mouse drag
(click after a drag cancelled). Final fresh build: e2e **120 passed**, unit 28, typecheck 0,
lint 0 errors (1 pre-existing warning), contrast 36/36, diff check clean. Chromium only.
Next: B22 transition polish, paper-tear edges (09 §5.4.3), then performance (home LCP ≈ 2.7 s
throttled, archive LCP). No staging, commits, push or deployment.

## 2026-11-09 — P1 performance, B22 transitions, paper tear

Implemented, uncommitted:
- `tasks/TASK-P1-first-load-weight.md`: fonts preload only `latin` (401 → 211 KB) and images
  serve AVIF. Throttled lab LCP: home 2.72 → **1.38–1.40 s**, archive 3.88 → **1.89–1.90 s**,
  product **1.01–1.08 s**. The B1 < 2.5 s target is met on this profile (lab, Chromium only).
- `tasks/TASK-B22-transitions-and-tear.md`: no page reveal on back/forward; drop-accent curtain
  (420 ms, ≤ 1 per second, none under reduced motion) when navigating to a drop; static torn
  edge at the bottom of each home chapter.

```text
pnpm test:e2e --workers=4   124 passed (39.9s)   # fresh production build
pnpm test                   28 passed
pnpm typecheck              exit 0
pnpm lint                   0 errors, 1 pre-existing warning
pnpm check:contrast         all 36 pairs pass
pnpm check:images           16 images, 0 with metadata
git diff --check            clean
```

**Everything in `10` §D that does not need client data is now implemented.** Remaining:
- Data-gated, hidden until inputs arrive (`08`): B3 event block, B4 scarcity, B5 back prints,
  B9 VIP, B10 notify, B12 date stamps, B18 credits; B16 search only past ~25 pieces; B19
  worldwide strip and B23 sound need client confirmation/audio.
- Decisions for Benito (`10` §E): hero photo, Slow Mode name/copy, which data exists, motion cap;
  plus the provisional defaults in the decisions log (accent red, default theme, voice).
- Verification gaps: Firefox/WebKit/real phones (scroll-driven wordmark break, flood
  `allow-discrete` swap, drag rails), field performance after deploy.
- Launch blockers unchanged (`pnpm check:launch`): catalogue, WhatsApp number, domain/hosting.
No staging, commits, push or deployment.
