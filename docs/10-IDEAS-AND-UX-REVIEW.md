# 10 — UX review and ideas backlog for the next implementer

Written 2026-11-09 (end of the Claude session). Companion to `docs/09-HANDOFF-NEXT.md`: 09 says
what exists and the order of work; this file is the **backlog of improvements and new ideas**,
each detailed enough to implement without asking. Same rules as `CLAUDE.md` (no invented client
facts, `references/` private, no commit unless Benito asks, no AI attribution, WCAG 2.2 AA, pnpm).

Conventions: **[DATA]** needs client data (08 #…) so it ships with clearly marked placeholders;
**[DECIDE]** needs Benito; every idea has *What / Why (source) / Behaviour / Accessibility and
reduced motion / Files / Acceptance*. One `docs/tasks/TASK-*.md` before code. Respect the motion
cap Benito's direction implies: **max 2-3 animated moments on screen at once**; none may flash.

---

## Continuation checkpoint — 2026-11-09

A1/A2/A4 are verified and corrected; A3 photo selection/crop reviewed; B17 implemented and
validated following the user's additional request. See current `STATUS.md` for executed checks
and caveats. The historical "unverified" notes below describe the original handoff, not current
status. B1/B7/B6/B8 and the remaining creative backlog are still pending.
The duplicate-loader-photo and hidden-document transition errors reported during review are
fixed, with failing-before/passing-after regressions. The page reveal now uses Web Animations
on committed content, not React document snapshots. Do not reintroduce that error path.

## A. UX/UI problems Benito reported or I found (fix these first)

### A1. Mobile header is confusing (Benito, with a screenshot)
Seen at 390 px: `SLOW | ● ○ ◎ (three unlabeled colour dots) | [00] | MENU` plus a 2-line banner.
Problems: three dots with no text read as decoration; the theme control competes with the bag
and the menu for the same 390 px; the banner pushes content down by ~70 px; on desktop-emulation
the custom cursor ring sat on top of MENU.

**Done in the working tree (unverified visually):** below `sm` the header shows only
`SLOW | SACOLA [00] | MENU`; the theme switch is hidden there (`hidden sm:block`) and lives in the
menu sheet as a labelled list (`PRETO / BRANCO / COR DO DROP`, `ThemeSwitch name="tema-menu"
labeled`); the sample-data banner has a one-line mobile string (`G-EXEMPLO-CURTO`).
Files: `src/components/header/{site-header,menu-sheet}.tsx`, `src/components/theme/theme-switch.tsx`,
`src/app/layout.tsx`, `src/content/strings.ts`.

**To do / verify (important):** my headless mobile script timed out clicking `MENU`
(`locator.click` stuck at "scrolling into view"), and a screenshot showed the loader's photo
instead of the page. It may be only my script (loader overlay at that moment) **or a real bug**
where something intercepts taps. Reproduce with Playwright `isMobile: true, hasTouch: true`,
viewport 390×780, `sessionStorage["slow:entrada"]="1"`, wait 3.5 s, then click `MENU`; inspect
`document.elementFromPoint` at the button centre. Check `data-entrada` on `<html>`, the loader
z-index, `ViewTransition`, and `CustomCursor` (must not mount on touch). Then verify: menu opens,
focus trap, Esc closes, theme radios in the sheet change the theme and the wipe plays, the sheet
shows the current theme as checked, 44×44 px targets, nothing overflows at 320.
Acceptance: e2e at a mobile viewport for open menu → change theme → close → theme persisted.

Further header polish (do after the fix):
- Bag is the main action: label it `SACOLA` + count, 44 px min target, count badge uses the odometer.
- Sticky header hides on scroll down and returns on scroll up on mobile (saves ~56 px). Reduced
  motion: no slide, simply stays visible. Never hide while the menu is open or a field is focused.
- Active drop chip in the header on desktop (`DROP C · 03D 13H`) linking to the drop; hidden on
  mobile (the ticker below already shows it).

### A2. "DADOS DE EXEMPLO" banner
Keep it (it is honest) but slim: one line, 12 px minimum, dismissible per session is **not**
allowed (it must remain until real data exists). Remove it automatically when
`placeholder === false` (already computed in `layout.tsx`).

### A3. Desktop hero photo (Benito: "ruim", a thin strip cropping faces)
Changed: from `lg`, the photo box is `aspect-[16/9]`, `object-[50%_12%]` (`hero.tsx`). **Verify by
eye** at 1280, 1440, 1920, 2560. Better long-term: see idea B1 (full-bleed poster hero). Also
[DECIDE] the choice of hero photo: the current one (three people on a staircase) is arbitrary;
prefer a frame where the garment print or SLOW wordmark is readable (e.g. the white back print
"2025/SLOW APPAREL COMPANY" from the 2025-08-24 drop). Photo selection lives in
`src/content/editorial.ts`; all images go through `pnpm images:import`.

### A4. Quantity cap and WhatsApp
Cap raised 10 → 99 (`src/lib/bag/store.ts`, tests, `docs/06` §4). WhatsApp buttons need
`NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` (digits with 55, no `+`), then restart `pnpm dev`.
Product page now also shows "Os pedidos pelo site ainda não estão abertos" when the number is
missing. Add a **dev-only** hint (only when `NODE_ENV !== "production"`) naming the env var, so
nobody wonders why the button is missing.

### A5. Page-level gaps seen in review (details in `09` §3)
Product page sparse, archive a plain list, home a stack of grids. Specs in `09` §5.3-5.4 and
ideas B2-B6 below.

---

## B. Ideas (grounded in the client's Instagram, Reels and the three references)

Source facts (see `docs/00-DISCOVERY.md` §B): drops are **dated events with a place**
("Out of Time", 06/08, 11:00, kiosk in Itacoatiara, Niterói, first 20 get a gift); the globe film
motif; red crumpled-paper flyers with flame edges; collab tees carry the **artist's name** on the
back (FLACKO, OROCHI, AZZY, SAULIN); a **Premium** edition not for sale; a **VIP early-access
group**; vocabulary "Slow Mode", "Slow Racing Club", "Slow Vision", "Slow worldwide", "Das ruas
para o mundo"; yellow karaoke-style subtitles in street clips; VHS date-stamp aesthetic;
football jerseys ("Slow 10"); balaclavas with SLOW; blackletter SLOW on caps.

### B1. Poster hero, full-bleed (replaces the "ticker + strip + wordmark" stack)
- **What:** the hero is one viewport-tall composition: campaign photo edge to edge, the SLOW
  wordmark at the bottom crossing the photo with `mix-blend-mode: difference` *or* solid in the
  drop accent (choose after looking), the drop ticker pinned as a woven-label strip at the top.
- **Why:** OUTFIT's giant wordmark + Red and Green's photo-led pages; fixes A3.
- **Behaviour:** on load the photo scales 1.08 → 1 over 1.2 s (CSS, once); the wordmark letters
  already exist (M2: they break apart on scroll). Photo `object-position` per breakpoint comes from
  editorial data (`focal: {x,y}` per photo).
- **A11y/RM:** reduced motion: no scale. Text over photo needs a measured contrast ≥ 4.5:1
  (add a bottom scrim gradient; compute against the lightest part of the photo).
- **Files:** `src/components/hero/hero.tsx|css`, `src/content/editorial.ts`.
- **Acceptance:** screenshots at 390/768/1440/1920 show faces uncropped; axe clean; LCP < 2.5 s
  on a throttled profile (record the number).

### B2. Drop chapters on the home (one scroll chapter per drop)
- **What:** each drop is a full-viewport chapter: photo, drop name in the condensed face at
  120-200 px, state chip, date, "VER O DROP" and "PEDIR" actions, and its pieces as a horizontal
  rail. Current drop first, then "ainda disponível".
- **Behaviour:** vertical scroll between chapters; the rail scrolls horizontally with
  `scroll-snap-type: x mandatory` and arrow buttons (keyboard + pointer). Chapter background wipes
  to the drop's accent as it enters (one slow wipe, no repeat; see D2 for the flash rule).
- **A11y/RM:** each chapter is a `<section aria-labelledby>`; the rail is a `role="region"` with
  an accessible name and buttons "Anterior/Próxima"; reduced motion: instant background change.
- **Acceptance:** keyboard can reach every piece and the arrows; no horizontal page overflow.

### B3. "Evento do drop" block (the drop as an event, as Slow already does)
- **What:** on a drop page, a woven-label block `LOCAL · DATA · HORA · BRINDE` for the launch
  event (kiosk, party, in-person sale), with a "Adicionar ao calendário" (.ics download) and "Como
  chegar" (link to a map search built from the address string; no embedded map).
- **Why:** captions/Reels announce place and time; "primeiros 20 ganham brinde" is a real habit.
- **[DATA]** event place, time, perk come from the client (08 #14); until then the block is hidden
  (not faked). `.ics` generated client-side, no server.
- **A11y:** date/time in a `<time datetime>`; the `.ics` link has a name and file type in text.
- **Files:** `src/lib/catalog/types.ts` (`event?: {place, startsAt, note}`), `src/lib/ics.ts`,
  `src/components/drop/event-block.tsx`; unit test for the `.ics` output.

### B4. "Última peça / só nesta sacola" scarcity done honestly
- **What:** per size, a text state `ÚLTIMAS` / `ESGOTADO` and, when the bag holds a line, an
  inline note if the size has `stock <= 3`.
- **[DATA]** needs real stock (08 #7/#21); if the client does not track stock, **do not show
  scarcity at all** (claim discipline: "limitada" only if the client confirms).
- **A11y:** never colour alone; text labels; struck-through sizes keep `aria-disabled` + label.

### B5. Collab / artist back-print gallery ("Nas costas")
- **What:** a section on the product page and a page `/costas` listing pieces whose **back print
  names an artist or phrase** (FLACKO, OROCHI, AZZY, SAULIN were visible in the Reels). Hover/tap
  flips the card to the back photo.
- **[DATA]** only pieces the client confirms; names and permissions from the client (08 #9).
- **Behaviour:** card flip via CSS 3D, 400 ms; reduced motion: crossfade/instant swap; the
  back view is also reachable by a "Ver costas" button (not hover-only).

### B6. Archive as posters wall
- **What:** `/arquivo` = grid of poster tiles, one per drop, sorted newest first, each tile the
  drop's campaign photo, name in the condensed face, state chip and "N peças ainda disponíveis".
  Hover/focus reveals the duotone version (reuse the M3 component). Sold-out drops are quieter
  (lower contrast must still pass 4.5:1: use opacity only on the image, never on text).
- **Behaviour:** filter chips `TODOS / DISPONÍVEL / ESGOTADO` as a native radio group; the URL
  holds the filter (`?estado=`) so it is shareable; the grid animates reorder with FLIP at ≤ 250 ms
  (instant under reduced motion).
- **Acceptance:** keyboard filter works, no layout shift beyond the grid, axe clean.

### B7. Product page that carries itself without data
- **What:** left: a horizontal scroll-snap gallery of all slides (dots + counter `2/6`); right,
  a sticky column: drop chip, name (condensed, 56-96 px), a clearly marked placeholder block
  `PREÇO / MEDIDAS / TECIDO: A CONFIRMAR COM A SLOW`, sizes, quantity stepper, the two actions,
  a woven-label strip with the legal lines, and a "Do mesmo drop" rail.
- **Behaviour:** pinch/double-tap zoom on the image is the browser's; add a click-to-open
  lightbox (Radix Dialog) with arrow keys and Esc; focus returns to the opener.
- **Mobile:** the action bar (`ADICIONAR À SACOLA`, `PEDIR SÓ ESTA`) sticks to the bottom with
  `env(safe-area-inset-bottom)` padding and never covers the size chips (use `scroll-padding`).
- **Acceptance:** e2e: choose size → add → bag count 01; lightbox traps focus.

### B8. Bag as a drawer with the WhatsApp preview
- **What:** `SACOLA` opens a right-side drawer (Radix Dialog) from any page; shows lines,
  quantity steppers, remove, the **exact WhatsApp message preview** in a monospaced block (so the
  customer sees what will be sent), a name field, and `PEDIR NO WHATSAPP`.
- **Why:** the checkout is a message; showing it builds trust and removes surprise.
- **Behaviour:** drawer slides in 250 ms (instant under RM); `/sacola` stays as the full page and
  the drawer's "Ver sacola" link goes there. Message text comes from `src/lib/whatsapp`.
- **Acceptance:** preview text equals the URL-decoded `text` param in the link (unit test).

### B9. VIP early-access call to action
- **What:** a slim band "ENTRE NO GRUPO VIP: ACESSO ANTECIPADO AO DROP" on the home and drop pages
  linking to the group.
- **[DATA]** platform and invite link (08 #15); hidden until provided. External link opens in a
  new tab with the "(abre em nova aba)" sr-only text (already the pattern).
- **Extra:** when the drop is `em breve`, the countdown shows "Grupo VIP entra 1h antes" **only if
  the client confirms that rule**.

### B10. Notify-me for a drop without accounts
- **What:** on an `em breve` drop, button `AVISAR NO WHATSAPP` that opens a pre-filled message to
  the store: "Quero ser avisado do <drop>". No data is stored by the app.
- **Why:** consistent with "no server, no customer data" in release 1.
- **[DATA]** wording approved by the client (`05` §11).

### B11. Marquee that tells the truth
Replace the generic marquee text with live content: current drop name + countdown, "N peças
ainda disponíveis", and the brand lines. Rendering stays CSS; the pause button stays; the live
numbers update at most once per second and are `aria-hidden` (the same info exists as text
elsewhere on the page) to avoid screen-reader spam.

### B12. VHS / date-stamp "archive" texture (from the Out of Time Reel)
- **What:** a date-stamp overlay (`JUL 19 2023`, mono, tiny) in the corner of archive photos and
  an optional faint grain layer on the hero.
- **[DATA]** use the **real** drop dates only (08 #14).
- **Behaviour:** static CSS (no animated grain); grain is a pre-rendered tiny PNG tile, 3% opacity.
- **A11y:** decorative (`aria-hidden`), must not reduce text contrast below 4.5:1.

### B13. Karaoke-subtitle captions for any video we add (from the street clips)
If/when video is added (08 #24 sound, Reels): yellow subtitle style (`#FFE600` on a 70% black
bar, ≥ 4.5:1), **real captions** (WebVTT `<track>`) rather than burned-in text. Autoplay muted,
`playsinline`, paused when off-screen or under reduced motion, with a visible pause button.

### B14. "Slow Mode" on/off (a joke that is also an accessibility feature)
- **What:** a toggle in the menu: `SLOW MODE: ON` = all motion slowed 2× and the marquee/globe
  paused by default; `OFF` = default. It also respects `prefers-reduced-motion` (forces ON).
- **Why:** the brand idea is literally "slow and steady" ("Devagar e sempre"); gives users control.
- **Behaviour:** sets `data-motion="slow"` on `<html>`; CSS variables `--motion-scale`.
  Stored in localStorage `slow:modo`. Names and copy are provisional ([DECIDE] with the client).

### B15. Footer as a woven label
Footer styled like the garment's care/label tag: small caps lines, the two legal lines, social,
contact, and a tiny "ESTE SITE USA DADOS DE EXEMPLO" while `placeholder`. A "VOLTAR AO TOPO"
button (focusable, no smooth scroll under reduced motion).

### B16. Search/filter on the catalogue ("ACHAR")
Client-side filter by drop, state and size over the static provider; command-palette style
(`/` opens it; Radix Dialog + native input; results are links). Only if the catalogue exceeds ~25
pieces ([DATA] #7); otherwise skip (restraint).

### B17. Sharing: per-product and per-drop OG images
Generate Open Graph images with `next/og` (`ImageResponse`): drop name in the condensed face,
the accent colour, the campaign photo. Titles/descriptions from content strings. Verify the
`next/og` API in the installed Next docs first ([VERIFY]).

### B18. Photo credits
Instagram captions credit photographers (e.g. `@thmmoura`, `@hashibxd`). Add a "Créditos" line
on drop pages from `post.json` **only for photos actually used and only with the photographer's
and the client's OK** (08 #9). Data field `credit?: string` on the image record.

### B19. Home "Slow worldwide" strip
A text/flag-free (avoid emoji) strip listing cities where the brand appeared (London, Rio,
São Gonçalo, Scandinavia per the posts): rendered as a slow ticker with a pause control.
[DATA] the client confirms the list; do not claim distribution/stores.

### B20. 404 and empty states with personality
404: "SEM SINAL" in the condensed face over a dark photo with a link back to the current drop;
empty bag: "A SACOLA ESTÁ VAZIA. O PRÓXIMO DROP É <data>" (data only if real). Copy goes through
`strings.ts` and `docs/05`.

### B21. Cursor states beyond "VER"
`PEDIR` over buy buttons, `ARRASTAR` over rails, a compressed state on press; all in the drop
accent; hidden for coarse pointers and reduced motion; `cursor: auto` must remain on form fields.

### B22. Page transition polish
The curtain (`page-wipe`) uses the destination drop's accent when navigating to a drop. ≤ 450 ms
total; never on back/forward restores; skipped under reduced motion. Verify the React
`ViewTransition` behaviour in the installed React before relying on it.

### B23. Sound, last and optional (08 #24, deferred)
Only with client-supplied audio: a `SOM` toggle in the menu, default off, remembered, one short
loop, `Audio` created on first click, volume 0.4, stops on `visibilitychange`. No autoplay ever.

---

## C. Cross-cutting requirements for every item above

- **Accessibility:** WCAG 2.2 AA; targets ≥ 24×24 CSS px (aim 44); visible focus; no flash (more
  than 3 flashes/s or large red alternations); pause control for anything moving > 5 s; names for
  every control; no information by colour alone; headings in order; `lang="pt-BR"`, with `lang="en"`
  on the English label lines.
- **Reduced motion:** every animation has a still, complete equivalent; test with Playwright
  `reducedMotion: "reduce"`.
- **Performance:** record JS (KiB) and LCP before/after each item; no dependency without a written
  reason in `docs/06`; images through `pnpm images:import` only (EXIF stripped, `check:images`).
- **Content:** every public string in `src/content/strings.ts` and listed in `docs/05` with its
  blocker; never real prices/stock/dates/phone until the client provides them.
- **Tests:** a unit or e2e test per behaviour; make a new test fail first to prove it can fail.
- **Docs:** update `docs/04` (behaviour), `docs/05` (strings), `docs/08` (inputs), `docs/STATUS.md`.

## D. Suggested order (smallest risk, biggest visible gain first)

1. A1 verify + fix the mobile menu (blocker), A2, A4 dev hint.
2. B1 poster hero → B7 product page → B6 archive wall (fixes what Benito called weak).
3. B8 bag drawer, B11 truthful marquee, B15 footer label, B20 empty/404.
4. B2 drop chapters + D2 colour flood (the cinematic pass from `09` §5.4).
5. Data-dependent ideas as inputs arrive: B3 event block, B4 scarcity, B5 back prints, B9 VIP,
   B10 notify, B12 date stamps, B18 credits.
6. Optional: B14 Slow Mode toggle, B16 search, B17 OG images, B19 worldwide strip, B21-B23.

### D2. Rule for any colour flood or wipe
One wipe per chapter transition, ≥ 600 ms, never repeated on a timer, never red ↔ black
alternation faster than 3 per second, and skipped under reduced motion. Add an e2e that
records class/attribute changes over 3 s and asserts at most 3 full-screen state changes.

## E. Questions for Benito (batch them)

1. Hero photo: which frame? (a print/wordmark must be readable)
2. Is the "Slow Mode" accessibility toggle (B14) OK as a brand gesture, and the copy?
3. Which data-dependent ideas does the client already have data for (event place/time, stock,
   VIP link, credits)?
4. Is the 2-3 moments-per-screen motion cap right?
