# slowco Repository Guide

## 1. Project

`slowco` is an online clothing store for a friend of Benito's (Slow Company, Instagram `@slow_tm`,
https://www.instagram.com/slow_tm/; brand material is an **open input**, `docs/08-OPEN-INPUTS.md`). Benito is building it through his
agency, Blessed Moon (`../blessed-moon`).

The brief (Benito, 2026-11-09): a store that is **very interactive, eye-catching and beautiful**,
following the client's established branding but with our own creative direction (full freedom there),
with a few memorable interactions. Benito will supply website references (saved HTML and videos).

**No Shopify for now.** The first release sells by **WhatsApp**: the cart (or a single product)
becomes a pre-filled message template sent to the store's number. Shopify may return later, so the
product data sits behind one interface (`docs/06-ARCHITECTURE.md` §3) and the rest of the
app never imports a Shopify type.

## 2. Current phase: definition done, implementation starting (T1)

The repository started in 2025 as a Shopify storefront experiment (Next.js 15, AlignUI, Shopify
Storefront API, cart cookie, `src/lib/shopify*.ts`, `src/lib/cart.ts`). That code is **legacy
until a task replaces it**: don't extend it, don't delete it without a task.

Order of work:

1. Setup (this commit): guide, docs skeleton, Instagram collector, private `references/`.
2. Discovery: Benito runs the collector on the client's profile and drops the site references into
   `references/sites/`; `docs/00-DISCOVERY.md` records what they show.
3. Definition: brand book, visual identity, UX and motion, content, architecture, in that order.
4. Implementation, one task at a time.

| Doc | Owns | Status |
| --- | --- | --- |
| `docs/00-DISCOVERY.md` | what the client material, Instagram and site references show | written 2026-11-09 |
| `docs/01-BRAND-BOOK.md` | idea, voice, line bank, claim discipline | first version 2026-11-09, provisional |
| `docs/02-VISUAL-IDENTITY.md` | colour, type, spacing, motion tokens, photo and mark rules | first version 2026-11-09, provisional |
| `docs/03-DESIGN-SYSTEM.md` | — | not needed in release 1 (`04` intro) |
| `docs/04-UX-LAYOUT-AND-MOTION.md` | routes, behaviour, states, motion, accessibility | first version 2026-11-09 |
| `docs/05-CONTENT.md` | every public string by ID, WhatsApp template | first version 2026-11-09, nothing approved |
| `docs/06-ARCHITECTURE.md` | stack, catalogue interface, bag, theme, images, tests, legacy fate | first version 2026-11-09 |
| `docs/07-IMPLEMENTATION-PLAN.md` | ordered tasks T1–T10 with checks | first version 2026-11-09 |
| `docs/08-OPEN-INPUTS.md` | what the client or Benito still has to provide | updated 2026-11-09 |
| `docs/STATUS.md` | decisions log, what is done and next | updated 2026-11-09 |

The current task must have a document in `docs/tasks/` before work begins.

## 3. Source hierarchy

1. What the client tells Benito directly: messages, answers, approved files
2. Benito's brief and the decisions recorded in `docs/`
3. The client's own published material: the Instagram profile, newest post wins
4. Site references in `references/sites/`: **inspiration for interaction and craft only, never
   copied** (no code, copy, assets or identity lifted from them)
5. Benito's other projects (`../lunares`, `../desmolde`, `../unimeet`, `../blessed-moon`,
   `../meeting-of-styles-rio-2027`): process, technique and tooling only. **Never their look, copy
   or identity.**

## 4. Consent, privacy, claims

- **`references/` is private research.** Gitignored. Client files, Instagram downloads, saved HTML
  and videos of third-party sites live there. Never commit it, never import from it in app code,
  never serve it. Only files named in the content doc may be copied into `public/`, by a script.
- **No invented facts.** No product names, prices, sizes, stock, shipping terms, phone numbers,
  handles, URLs, testimonials or logos that the client didn't give us. Missing values go to
  `docs/08-OPEN-INPUTS.md`, never guessed.
- **People.** Models and customers in the client's posts appear on the site only with the client's
  confirmation that the person agreed.
- **WhatsApp.** The store's number is configuration (`NEXT_PUBLIC_WHATSAPP_NUMBER`), never
  hard-coded. The message template is a content string owned by the content doc. No tracking or
  customer data is stored by the app in release 1.
- Strip GPS and device EXIF from every image before it ships.

## 5. Stack and component libraries (snapshot, verify before use)

Current `package.json`: Next 15.5.4, React 19.1, Tailwind 4, pnpm, AlignUI components already in
`src/components/ui`, Radix primitives, TanStack Table. Bumping Next/React is a task of its own
(check current versions first, don't assume).

Component sources, as in Benito's other projects (`../desmolde/CLAUDE.md` §5). They enter **only
when a task needs them**, through their CLI/registry, never wholesale; verify component names and
props against the live docs, never invent one:

- **AlignUI** (already in `src/components/ui`): the base kit. (Benito calls it "AlignY".)
- **shadcn/ui** (Radix, `pnpm dlx shadcn@latest`), with registries `@magicui`
  (`magicui.design/r/{name}`), `@react-bits` (`reactbits.dev/r/{name}.json`), `@canvas-ui`
  (`canvasui.dev/r/{name}.json`); **animate-ui** where it fits.
- **GSAP + Lenis** for scroll and timeline motion; **Motion** where a library expects it.
- WebGL (ogl or similar) only if the definition asks for it and a fallback is written.
- Icons: `@remixicon/react` is installed; adopting `lucide-react` (shadcn default) is a decision
  for the architecture doc, so two icon sets don't coexist by accident.
- **pnpm** only, never npm.
- Server Components by default; `'use client'` only at the leaves. Every hook abstracted in
  `hooks/` or a feature-local `hooks.ts`. No `useMemo`/`useCallback`/`React.memo` without a measured
  reason. `useEffect` only to sync with an external system, always with cleanup. Server state
  (when there is one) is TanStack Query. All per `~/.claude/CLAUDE.md`.
- **Never invent an API.** If a signature is uncertain, the doc says `[VERIFY: …]` and names the
  file or URL to check.

## 6. Motion and accessibility

WCAG 2.2 AA is the floor, in every definition, not added later:

- `prefers-reduced-motion: reduce` gets a still, complete composition. The store must be fully
  usable (browse, pick a size, send the WhatsApp message) with motion off.
- Anything that moves for more than 5 seconds can be paused. No flashes (WCAG 2.3.1).
- Keyboard reachability, visible focus, text alternatives for canvases and product images, colour
  never the only carrier of meaning (e.g. sold-out, selected size). No autoplay audio.
- Interactions are a layer over a plain, fast, indexable store, not a replacement for it.
  Any intro is skippable at any moment and never blocks content.

## 7. Work sequence

Before work:

1. Read the relevant `docs/` sections and `references/` material.
2. Write or update `docs/tasks/TASK-*.md`: current scenario, planned changes, why, affected files,
   verification.
3. State content assumptions explicitly.

After work: update the affected docs and this guide when a decision changes, run
`git diff --check`, and commit coherent changes once they are verified. Docs, code, comments and
commits are in English. Public UI copy is pt-BR.

**Never add AI attribution to commits or PRs**: no `Co-Authored-By:` trailer, no "Generated with …"
line (Benito, 2026-11-02, `~/.claude/CLAUDE.md`).

## 8. Research tools

- `scripts/instagram/console.js` + `scripts/instagram/collect.py`: the Instagram collector, copied
  from `../desmolde` (itself the lunares 2026-11-04 repair). Output:
  `references/instagram/<handle>/`. A tool run by hand by Benito, never by the app or CI. Usage at
  the top of each file; the handle is always passed explicitly. Setup (once):
  `/usr/bin/python3 -m venv .venv-ig && .venv-ig/bin/pip install 'instaloader==4.15.3' 'browser-cookie3==0.20.1'`
  (route 2, the browser console, needs no packages).
- **Reels: `scripts/instagram/reels-links.js`** (browser console on `instagram.com/slow_tm/reels/`,
  scrolls the tab and downloads `reels.txt`), then the `yt-dlp` command in its header. Background: `console.js` collects photo posts (every carousel slide + caption)
  and skips Reels on purpose; `collect.py --videos` (instaloader) can fetch them but Instagram
  refused it with `feedback_required` on desmolde. What worked there: copy the Reel links from the
  profile's Reels tab into `references/instagram/slow_tm/reels.txt`, then
  `.venv-ig/bin/pip install yt-dlp` and
  `.venv-ig/bin/yt-dlp --cookies-from-browser chrome -a references/instagram/slow_tm/reels.txt --write-info-json --write-thumbnail`
  (Homebrew's yt-dlp fails with `No module named expat`). Needs Benito's logged-in browser.
- First run: open https://www.instagram.com/slow_tm/ logged in, paste `console.js`, then
  `/usr/bin/python3 scripts/instagram/collect.py --from-json ~/Downloads/ig-slow_tm.json`.
- Site references: `references/sites/<name>/` holds, per reference, the saved page
  (`page.html` or a "Save as, complete" folder), screen recordings (`*.mp4`/`*.mov`) and a
  `notes.md` saying what Benito likes about it. `docs/00-DISCOVERY.md` summarises them.
