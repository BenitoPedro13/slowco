# 09 — Handoff: what is built, what I saw, what to do next

Written 2026-11-09 for the next implementer (Codex or any model). Read this after `CLAUDE.md`
(binding) and `~/.claude/CLAUDE.md` (global rules, if you have it). This file is a plan, not a
spec: where it says "see doc N", doc N has the exact values. Where something is not in the docs,
it is marked **[DECIDE]** (needs Benito) or **[VERIFY]** (check before relying on it).

## 0. Hard rules (same as CLAUDE.md, repeated because they are the ones models break)

- **No invented client facts.** No prices, sizes, stock, drop names or dates, phone numbers,
  handles, quotes, logos. Everything of that kind in the code today is marked **DADOS DE EXEMPLO**
  (a banner sits on every page). Keep it that way until `docs/08-OPEN-INPUTS.md` #4, #7, #14,
  #21 arrive.
- **Do not redraw or trace the client's logo or globe artwork.** The wordmark is a typographic
  stand-in (`data-standin`), the globe is a generic procedural wireframe (08 #23).
- **`references/` is private**: never import, serve, commit or edit it. Photos reach `public/`
  only through `pnpm images:import` (reads `scripts/images/instagram-picks.tsv`, strips EXIF).
- **No `git commit`, no `git add`, no push, no deploy** unless Benito asks in that session.
  When he does, commits carry **no AI attribution** (no `Co-Authored-By`, no "Generated with").
- **pnpm only.** Docs, code, comments and commits in English; public UI copy in pt-BR.
- **Accessibility floor (WCAG 2.2 AA):** reduced motion gets a still, complete composition;
  anything moving > 5 s has a pause control; no flashes (no full-screen alternation faster than
  3/s, red especially); keyboard reachable with visible focus; colour never the only carrier of
  meaning; no autoplay audio; every intro skippable.
- **Never claim something works that you did not run.** Paste real command output into
  `docs/STATUS.md`.

## 1. Project in one paragraph

Online store for **Slow Company** (Instagram `@slow_tm`, Rio / São Gonçalo streetwear). Sells in
**drops with an archive**; availability is per product (`em breve` / `disponível` / `esgotado`);
pieces from old drops may still be on sale. **No Shopify in release 1**: the bag becomes a
pre-filled WhatsApp message (`https://wa.me/<number>?text=<encoded>`, number from
`NEXT_PUBLIC_WHATSAPP_NUMBER`, template in `src/content/strings.ts`, builder in `src/lib/whatsapp`).
Main creative reference: **OUTFIT® by ++hellohello**, with elements of Red and Green and Ethel
Vaughn where they fit what the Instagram shows (`docs/00-DISCOVERY.md` §B, §D.5). Agency:
Blessed Moon (`../blessed-moon`).

## 2. State of the repository (verified 2026-11-09)

Nothing is committed (144 changed/new paths in the working tree; `git diff --cached` empty).
Last verified by running: `pnpm typecheck` ok; `pnpm lint` 0 errors, 1 warning (unused `url` in
`scripts/instagram/console.js`); `pnpm test` 27/27; an agent reported `pnpm test:e2e` 49 passed
(I re-ran e2e at the end but did not read its summary: **re-run it before trusting it**).

Stack (pinned in `docs/06-ARCHITECTURE.md` §1, checked 2026-11-09): Next 16.4.5, React 19.3.1,
Tailwind 4.3.5, TypeScript 5.9.3, ESLint 9.39.5 flat config, Vitest, Playwright, pnpm 12
(`pnpm-workspace.yaml` lists the three approved build scripts: `@tailwindcss/oxide`, `sharp`,
`unrs-resolver`). Fonts Archivo + Geist Mono (OFL). Icons: Remix only.

Scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `test` (vitest), `test:e2e` (playwright,
builds and serves on port **3100** with a fictional WhatsApp number `15555550100`),
`check:contrast` (36 theme/accent pairs), `check:images` (no EXIF under `public/`),
`images:import`, `check:launch` (exits 1 and lists launch blockers: expected until the client
data arrives).

Routes (`src/app/`): `/` (entry loader, current-drop ticker, poster hero, drop split, "ainda
disponível" grid, marquee, globe + duotone photo), `/drops/[slug]`, `/produtos/[slug]`,
`/sacola`, `/arquivo`, `/contato`, `not-found`.

Code map: `src/components/{bag,cursor,drop,entry,footer,globe,header,hero,marquee,product,
theme,transitions}`, `src/hooks/*` (every hook is abstracted; components never call
`useEffect`/`useContext` inline), `src/lib/{catalog,bag,theme,whatsapp,format,config.ts,...}`,
`src/content/{catalog,editorial,fill,strings}.ts` (all copy and placeholder data live here),
`src/styles/{tokens,effects}.css`, `e2e/*.spec.ts`, `scripts/images/prepare.py`.

Storage keys: theme `slow:tema` (localStorage), entry loader `slow:entrada` (sessionStorage),
bag in localStorage (`src/lib/bag/store.ts`). The theme/entry init script runs before paint
(`src/lib/theme/init-script.ts`).

Docs: `00` discovery (client IG + 3 site references), `01` brand book, `02` visual identity
(provisional values), `04` UX/motion, `05` content, `06` architecture, `07` plan (T1-T10),
`08` open inputs (#1-#25), `STATUS.md`, `tasks/TASK-*.md` (T1-T10, M1-M6, setup, definition).
**`04` and `07` were not updated after M1-M6 and the design passes**: do that (see §5.1).

Setup to run: `pnpm install`; `pnpm images:import` (needs `.venv-ig` with Pillow, already
created; ignored by git); `.env.local` with `NEXT_PUBLIC_WHATSAPP_NUMBER=55DDDNUMBER`
(digits only, with 55, no +; without it the WhatsApp buttons are hidden); `pnpm dev`.

## 3. What I saw when I looked at the built site (static screenshots only)

I rendered the production build and captured 7 pages × 3 themes × (1440×900, 375×812) with
Playwright, and looked at desktop home (black and drop themes), drop, product and archive.
I did **not** look at the mobile captures, the loader image, the bag, contact or 404 in detail,
and I cannot judge motion from stills.

Good: giant italic SLOW over the campaign photo; the red/black/white palette and the theme switch;
the real photos in grids; the red duotone and greyscale-on-red photo; "DISPONÍVEL AGORA" drop
headline; marquee band; wireframe globe.

Verdict (Benito's brief is "very interactive, eye-catching, beautiful", "bem chamativa"):
**clean and competent, but too restrained.** It reads as a good streetwear shop, not an
experience. Concrete gaps:

1. **Home is a stack of grids.** No full-bleed photo sections, no text running across photos, no
   per-drop chapters. The Red and Green energy (colour flooding, paper shards, bold cursor) is
   barely present.
2. **Product page is sparse.** Giant stacked photos, a tiny info column with only name, sizes and
   two buttons; empty space below. No price, description, measurements (data missing: 08 #7/#21),
   but the layout should still carry the page.
3. **Archive is a plain 3-row text list** with a lot of empty page. It should be visual.
4. **Prototype feel:** the "DADOS DE EXEMPLO" banner is on every page (correct, keep it, but
   make it slimmer), and the mono labels look very small in the reduced screenshots (**[VERIFY]**
   real px size at 1440 and 375 before changing; floor 12 px for readable text).
5. The drop-theme duotone turns the photo to greyscale on red; fine, but check it never hides a
   garment's real colour on a product page (there is an e2e for "no duotone on product photos").

## 4. Decision needed from Benito before the big creative pass

Ask once, then proceed with the answer:

- **ANSWERED (Benito, 2026-11-09, one word: "animada"): direction A, animated/cinematic.** The
  motion cap (2-3 animated moments per screen) is still my proposal, not confirmed. Do §5.4.
- ~~[DECIDE] Direction:~~ (A) *cinematic / Red-and-Green-leaning* (full-bleed sections, shards,
  colour flood, bolder cursor) or (B) *keep OUTFIT's restraint* and only deepen product + archive.
  **My recommendation: A, with a hard cap of 2-3 animated moments per screen.**
- **[DECIDE] The 4 defaults the previous agent assumed** (recorded in `STATUS.md`, rows still
  open in `08`): red as the current-drop accent and no green; default theme black for everyone;
  AlignUI retired (already removed with the legacy pages); voice = "sacola", no emoji,
  "BEM-VINDO", "raízes".
- **[DECIDE] External links open in a new tab** (08 #25).

Order: §5.1-5.3 first (safe under both), then §5.4 (now approved).

## 5. Work plan (do in this order; one `docs/tasks/TASK-*.md` per item BEFORE code)

### 5.1 Make the docs true again (small, do first)

- Update `docs/04-UX-LAYOUT-AND-MOTION.md` and `docs/07-IMPLEMENTATION-PLAN.md` with what M1-M6
  and the design passes actually built: poster hero, current-drop ticker, woven-label block,
  catalog cards with sizes and second-photo hover, split drop section, duotone rules, marquee
  with pause, globe with pause, entry loader (~2.2 s, CSS-driven, `PULAR`/Esc/click, once per
  session, skipped with reduced motion), cursor with "VER" disc, external links in a new tab.
  Read the code and the `TASK-M*` docs; do not rewrite from memory.
- Mark `docs/STATUS.md` "Next" with this file.
- Re-measure the JS size of `/`: the last figure was 245.2 → 320.5 KiB uncompressed (10 → 11
  files) **before** the final small edits. Use `.next` output or `next build` stats; record the
  new number and which module added the most.

### 5.2 Verify what nobody verified

Run `pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e` and paste results. If the e2e
command hangs on port 3100: `pkill -f "next start --port 3100"; pkill -f next-server` first.
Then a full screenshot round of every page in the three themes at 1440 and 375 (script idea:
Playwright, init script sets `localStorage["slow:tema"]` to `preto|branco|drop` and
`sessionStorage["slow:entrada"]="1"` to skip the loader; pages `/`, `/drops/drop-de-exemplo-b`,
`/produtos/peca-de-exemplo-04`, `/sacola`, `/arquivo`, `/contato`, `/inexistente`). **Look at
the images** and list defects. Also: Firefox and WebKit via Playwright if installed
(`animation-timeline` is unsupported in older ones: the SLOW wordmark must stay a still word),
and Lighthouse/axe on `/`.

### 5.3 Product and archive pages (safe under A and B)

- **Product page:** make the layout carry the page without client data. Proposed: left, a
  horizontally scrolling or collage gallery (all slides of that piece, `object-fit` safe on
  mobile); right, a sticky column with the drop name and state chip, the product name in the
  big condensed face, **a clearly marked placeholder block** for price/description/measurements
  ("A CONFIRMAR COM A SLOW", flagged in `05`), size chips, quantity stepper, and the two actions
  (`ADICIONAR À SACOLA`, `PEDIR SÓ ESTA PEÇA`). Below: "Do mesmo drop" strip and "Ainda
  disponível" strip. Keep sold-out size struck through **plus** a text label (colour not the only
  signal).
- **Archive:** each drop becomes a large poster tile: its campaign photo, the drop name in the
  condensed face, state chip, date (placeholder), number of pieces still available. Hover/focus
  reveals the duotone version (already implemented for the archive photo: reuse that
  component). Sort newest first; `esgotado` drops stay but are visually quieter.
- Slim the "DADOS DE EXEMPLO" banner (single line, smaller) without removing it.
- Acceptance: e2e for both pages (extend `e2e/product.spec.ts`, `e2e/pages.spec.ts`), axe clean
  in all three themes, no horizontal overflow at 320 and 1440, screenshots reviewed.

### 5.4 The "cinematic" pass (Benito chose A, 2026-11-09)

Do each as its own TASK doc, with a still fallback and an e2e. Derived technique only; never copy
the references' code, copy or assets (`references/sites/` holds the saved pages and recordings:
OUTFIT, ETHEL_VAUGHN, redandgreen.jp, plus `.mov` files; see `docs/00-DISCOVERY.md` §D).

1. **Home as chapters.** Replace the "ticker + hero + split + grid" stack with: (1) entry (loader
   stays) → poster hero; (2) *Drop atual* full-bleed chapter: one campaign photo edge to edge,
   the drop name in giant condensed type overlapping the photo, countdown pinned; (3) *Ainda
   disponível* horizontal scroll of cards; (4) marquee; (5) *De São Gonçalo pro mundo* chapter
   with the duotone photo and the globe; (6) footer. Max 2-3 animated elements on screen at once.
2. **Colour flood between chapters.** The page background wipes to the current drop accent
   (red `#d4110d` default, see `02`) through a clip-path or a tall coloured band as the next
   chapter enters. It must not alternate colours faster than 3/s (WCAG 2.3.1): use one slow
   wipe per chapter, never a repeating pulse. Reduced motion: hard cut, no wipe.
3. **Paper-tear transitions** (Red and Green flavour): an irregular polygon edge between
   chapters (static SVG/CSS `clip-path` shapes, optionally parallaxed). No fragments flying.
   The shapes are ours (generic torn paper), not traced from any site.
4. **Cursor as brand gesture** (extends M6): the accent-coloured disc already shows "VER" on
   photos; add "PEDIR" on buy buttons and a compressed state on press. Fine pointers only.
5. **SLOW wordmark break on scroll** exists (M2, CSS `animation-timeline: view()`); verify it in
   Firefox/WebKit and on a real phone; keep the still fallback.
6. **Sound (M5)** stays deferred until the client supplies audio; if added: off by default,
   explicit button, never autoplay (08 #24).
7. **Performance budget:** record JS and LCP before/after each chapter; no new runtime
   dependency without a reason written in `06`. GSAP/Lenis are allowed by `06` only if CSS
   scroll-driven animation cannot do it; say why.

### 5.5 Before any launch (do not do without Benito)

`pnpm check:launch` must pass; it fails today by design. Blockers are in `08`: real catalogue
(#7, #14, #21), WhatsApp number and message approval (#4, #5, `05` §11), brand files (#2), model
consent (#9), domain/hosting (#11), the VIP group (#15). The old store `slowcompany.com.br` is
suspended ("A loja está temporariamente fora de serviço"); what happens to that domain is #13.

## 6. Gotchas learned the hard way

- `pnpm 12` refuses dependency build scripts until approved; they are in `pnpm-workspace.yaml`.
  A new clone needs that file (it is intentionally **not** gitignored).
- `references/` made ESLint read thousands of files once; the ignore is in `eslint.config.mjs`.
- Python for scripts: `.venv-ig/bin/python -I` (isolated). System Python 3.9 emits harmless
  LibreSSL warnings. Pillow is installed in `.venv-ig`.
- Instagram data: `references/instagram/slow_tm/` (60 posts, 338 slides, 13 reels in `reels/`).
  Three posts have no `.jpg` slide (2024-11-26, 2024-12-05 `DCzixfvSO30`, 2025-08-15: check for
  webp/video). Some posts are reposts from other accounts; tagged-user fields are empty, so photo
  consent is unrecorded (08 #9).
- The Chrome extension was not connected in earlier sessions: all visual checks used headless
  Playwright. If it is connected, check `tabs_context_mcp` once, then a real browser pass.
- A previous e2e test passed while testing nothing (the switch-limit one); when you write a test,
  make it fail first (remove the behaviour) to prove it can.

## 7. Questions to put to Benito, in this order

1. ~~Direction~~ answered: A. Still ask: is the 2-3 animated moments per screen cap acceptable?
2. Confirm the four defaults in §4 and the new-tab links.
3. What does he like in each reference (08 #3)? Which moments first?
4. From the client: logo files (vector), the real WhatsApp number and message wording, drops and
   pieces with names, prices, sizes, stock and dates, the VIP group, written consent of the
   people in the photos, and who owns domain and hosting.
