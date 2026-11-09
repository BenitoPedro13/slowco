# 04 — UX, layout and motion

First version, 2026-11-09 (`tasks/TASK-definition.md`). Owns: routes, page structure, behaviour,
states, motion and the accessibility decisions. Values come from `02`; strings are referenced by
ID from `05`; code locations from `06`.

`03` (design system) is **not written**: the token set in `02` and the few components named here
cover release 1. It is written if a second surface (e.g. a lookbook) needs a component library of
its own.

---

## 1. Information architecture

### 1.1 Routes (release 1)

| Route | Purpose | Data | Task |
| --- | --- | --- | --- |
| `/` | hero + theme switch; current drop; still-available pieces; VIP/contact | current drop, products | T1 (hero), T6 (rest) |
| `/drops/[slug]` | one drop: intro, drop mode state, its products | drop, products | T6 |
| `/arquivo` | every drop, newest first; per drop the pieces still on sale | drops, products | T7 |
| `/produtos/[slug]` | one product: photos, sizes, add to bag, order one piece by WhatsApp | product | T5 |
| `/sacola` | the bag; build the WhatsApp message | bag (client) | T4 |
| `/contato` | WhatsApp, Instagram, VIP group | config | T7 |
| `not-found` | 404 | — | T7 |

`/produtos/[slug]` keeps the path shape of the 2025 prototype and of Nuvemshop stores, so old
links may still resolve (`08` #13). Legacy routes `/produtos` (list), `/apparel`, `/merch`,
`/new-drop`, `/artists`, `/carrinho` are **removed** by T8 (`07`), not redirected, unless `08` #13
shows indexed URLs worth keeping.

### 1.2 Site map

```
/ ─┬─ /drops/[slug] ── /produtos/[slug]
   ├─ /arquivo ─────── /drops/[slug]
   ├─ /sacola ──────── wa.me (leaves the site)
   └─ /contato ─────── wa.me, instagram.com/slow_tm, VIP link (#15)
```

### 1.3 Flows

1. **Instagram bio → current drop → product → size → bag → WhatsApp.** The main flow; mobile first.
2. **Product → "Pedir só esta peça"** (`P-PEDIR-UMA`): a single-piece WhatsApp message without the bag.
3. **Archive → older drop → piece still available → bag.**
4. **Drop em breve → countdown → becomes "DISPONÍVEL AGORA"** in place, without a reload (§5).

## 2. Global elements

### 2.1 Header (all routes; T1 ships the hero's own top row only, the shared header comes in T4)

Left: the wordmark (stand-in, `02` §2.3) at `label` size → `/`. Right: theme switch (§3), bag
counter (§4). Mobile: the same three items; navigation (`DROPS`, `ARQUIVO`, `CONTATO`) moves into
a menu sheet (Radix Dialog via shadcn `Sheet`, T4). Sticky, height per `02` §5.2;
`scroll-padding-top` equals its height so focused elements are never hidden under it (2.4.11).

### 2.2 Footer

`@slow_tm` link, `CONTATO`, the legal-label lines L1/L2 (`G-LEGAL-1/2`), small print for
shipping/exchange when the client gives it (`08` #8).

### 2.3 Skip link

First focusable element on every page: `G-PULAR` → `#conteudo` (the `<main>`). Visible on focus.

## 3. The hero and the theme switch (T1)

### 3.1 Composition (`/`, first viewport)

```
┌──────────────────────────────────────────────┐
│ SLOW COMPANY (label)        ○ ○ ●  (switch)  │  top row, gutter padding
│                                              │
│                                              │
│  S L O W                                     │  wordmark stand-in, spans the
│  (giant, italic, wide, fills content width)  │  content width, bottom-aligned
│                                              │
│ SLOW CREATIVE STUDIO AND INDUSTRY APPAREL    │  label, L1
│ FOR PROFESSIONAL USE ONLY. ALL RIGHTS …      │  label, L2
│ DAS RUAS PARA O MUNDO            @slow_tm ↗  │  label L5 / Instagram link
└──────────────────────────────────────────────┘
```

- Height `100svh` (min 560px); the wordmark is bottom-aligned above the label rows, so on a phone
  the labels sit in the thumb zone and the word fills the width.
- `<h1>`: visible `SLOW` (stand-in, `aria-hidden`) + visually hidden `Slow Company` (`H-H1`).
- No photo in T1 (consent `08` #9 is open). A photo band comes in T6 when consent exists.
- No CTA to a drop in T1 (no drop data yet). The Instagram link gives a second keyboard target.

### 3.2 Entry motion

On first paint the four letters rise from below their line box (`translateY(100%)` → `0`, clipped
by the line, which clips below only so the italic overhang is never cut), `--dur-entry` with
`--stagger`, `--ease-out`. **Transform only, no opacity**: wherever the animation does not run
(reduced motion, no animation support) the letters are simply in place; CSS only, no JS needed.
Total < 1 s, plays once, never loops.
Reduced motion: no entry motion, letters in place.

### 3.3 The switch

- **Control:** a native radio group: `<fieldset>` with visually hidden `<legend>` (`G-TEMA`),
  three `<input type="radio" name="tema">` with labels `G-TEMA-PRETO`, `G-TEMA-BRANCO`,
  `G-TEMA-DROP`. Each radio is drawn as a 24×24 circle swatch filled with that theme's
  `--canvas`, with a 1px `--content` border so a swatch matching the page is still visible
  (1.4.11). The checked swatch gets a 2px ring at 3px offset (**shape, not only colour**).
  Visible text label: the checked theme's name next to the swatches in `label` style, so the
  state is readable without colour.
- **Keyboard (native):** Tab enters the group at the checked radio; ←/→ (↑/↓) move and select;
  Space selects. Tab leaves the group. Focus ring per `02` §5.3.
- **Pointer:** click/tap a swatch. Hover: the swatch grows 1→1.15 (`--dur-hover`).

### 3.4 Applying and persisting

- The theme lives on `<html data-theme="preto|branco|drop" data-drop-accent="vermelho|…">`.
  `data-drop-accent` is the current drop's accent (config in T1, catalogue from T3).
- The choice is stored in `localStorage` key `slow:tema`. An inline script in `<head>` applies
  it **before first paint** (no flash of the wrong theme). Storage unavailable → default `preto`.
- `prefers-color-scheme` is **not** followed: the default is the brand's black (`02` §3.2); the
  switch is a brand moment, not a system setting. **[confirm with Benito]**
- Changes in another tab (`storage` event) are applied to this tab without a wipe.

### 3.5 The wipe, and flash safety

- **Motion on:** a fixed full-screen layer painted in the *target* theme's `--canvas` sweeps up
  from the bottom (`clip-path: inset(100% 0 0 0)` → `inset(0)`, 280ms, `--ease-in-out`), the
  theme is applied underneath, then the layer leaves through the top (`inset(0)` → `inset(0 0
  100% 0)`, 280ms). A moving edge, not a full-screen blink.
- **Throttle (WCAG 2.3.1):** at most one theme change every **600ms**, in every mode. Requests that
  arrive during a wipe or inside the interval are **coalesced**: only the last one is applied when
  the interval ends. Holding an arrow key or tapping fast can therefore never produce more than
  ~1.7 full-screen colour changes per second (the limit is 3 flashes per second).
- **Reduced motion:** no layer, the theme changes instantly, with the same 600ms throttle.
- The radio reflects the *requested* choice immediately (so assistive tech hears the selection);
  the page follows within the throttle.
- No sound, no vibration.

### 3.6 States

| State | What shows |
| --- | --- |
| default (no stored choice) | `preto`, `preto` swatch checked |
| stored choice | that theme from first paint |
| JS disabled | the stored-theme script cannot run → `preto`; radios are still visible but inert (they change nothing without JS) **[accepted]** |
| storage blocked (private mode) | theme changes work for the visit, not persisted |

## 4. Bag counter (T4)

- In the header: `G-SACOLA` + a two-digit counter. Each digit is a vertical strip `0–9` that rolls
  to the new value (`--dur-count`, `--ease-out`); the strips are `aria-hidden`.
- Accessible text: the link's name is `Sacola, N itens` (`G-SACOLA-ARIA`), from the same number.
- Adding/removing announces once in a polite live region (`role="status"`): `B-ADICIONADO`.
- 0 items: shows `00`; ≥ 100 shows `99` and the accessible name says the true number.
- Reduced motion: digits swap without rolling.
- The bag is stored in `localStorage` (`slow:sacola`), restored on load, synced across tabs.

## 5. Drop mode (T6)

A drop has `releaseAt` (date-time, America/Sao_Paulo) and products with their own availability.

| Drop state | Condition | Shows |
| --- | --- | --- |
| `em-breve` | now < `releaseAt` | `D-EM-BREVE`, the absolute date and hour (`D-DATA`, always visible, the source of truth), a countdown `DD:HH:MM:SS` in `label`/`display-xl`, products as preview (no add to bag), VIP CTA if `08` #15 answered |
| `disponivel` | now ≥ `releaseAt` and ≥ 1 product `disponivel` | `D-DISPONIVEL` (L11), products buyable |
| `esgotado` | now ≥ `releaseAt` and no product `disponivel` | `D-ESGOTADO`; the drop lives on in `/arquivo` |

Product availability (from the catalogue, per product and per size): `em-breve`, `disponivel`,
`esgotado`. A sold-out size is **struck through and labelled** `P-TAM-ESGOTADO` in its accessible
name; it is not selectable (`aria-disabled`, still focusable so it can be read).

- **Countdown and 2.2.2:** it updates every second and lasts more than 5 s, so it has a
  `D-PAUSAR` / `D-RETOMAR` toggle next to it. Reduced motion: digits swap without animation and
  the countdown updates once per minute.
- At zero the page switches to `disponivel` **in place** (client clock vs `releaseAt`), and the
  server render after revalidation agrees (`06` §4). The countdown is not a promise of stock:
  availability still comes from the catalogue.
- No "últimas peças" or stock counts unless the client provides stock (`01` rule 17).

## 6. Cursor (T9)

- Only for `(hover: hover) and (pointer: fine)` **and** `prefers-reduced-motion: no-preference`.
  Otherwise the native cursor, untouched.
- A 12px `--accent` dot follows the pointer (position written with `transform` in a
  `requestAnimationFrame` loop that runs only while the pointer moves); over links and buttons it
  grows to a 32px ring; over a product image to a 72px disc with `CUR-VER` inside.
- `mix-blend-mode: difference` is **not** used (it fails on mid-tone photos); the dot has a 1px
  `--content` outline instead.
- The native cursor is hidden (`cursor: none`) only on `html` while the custom cursor is active;
  text inputs and textareas keep the native I-beam.
- The label is decorative (`aria-hidden`); links keep their own accessible names.
- Plain dot, not the client's S mark (§2.2 of `02`).

## 7. Page transitions (T9)

Route changes use the View Transitions API where available: the new page wipes in with the same
geometry as the theme wipe (280ms), else an instant swap. Reduced motion: instant.
`[VERIFY: Next.js App Router view-transition support at T9 time — next.config experimental
viewTransition and React <ViewTransition>; https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition]`.
Never blocks input; focus moves to the new page's `<h1>`.

## 8. Accessibility decisions (on top of `CLAUDE.md` §6)

| Criterion | Decision |
| --- | --- |
| 1.4.1 Use of colour | states as text (drop state, `ESGOTADO`, selected size); selected swatch/size has a ring, not only a colour |
| 1.4.3 / 1.4.11 Contrast | `02` §3.3 matrix, enforced by `pnpm check:contrast`; text on photos only on a solid `--canvas` block, never directly over the image |
| 1.4.10 Reflow | 320px without horizontal scroll; the wordmark is sized in `cqi`, not `vw`, so it never overflows |
| 2.1.1 Keyboard | everything reachable; native radios for theme and size; Radix Dialog for the menu sheet |
| 2.2.2 Pause, stop, hide | countdown has a pause toggle; no carousel autoplays; no marquee in release 1 |
| 2.3.1 Three flashes | theme changes throttled to ≥ 600ms; no strobe, no red/green alternation |
| 2.3.3 Animation from interactions | all non-essential motion off under `prefers-reduced-motion: reduce` |
| 2.4.7 / 2.4.11 Focus | 2px `--content` ring, 3px offset; sticky header + `scroll-padding-top` |
| 2.5.8 Target size | ≥ 24×24px; primary actions ≥ 44px tall |
| 3.3 Forms | the only input is the optional name in the bag; labelled, no required fields |
| 4.1.3 Status messages | bag add/remove and drop state change announced via `role="status"` |
| Language | `<html lang="pt-BR">`; English brand lines wrapped in `lang="en"` |

Motion with reduced motion on: hero letters static, wipe off, counter swaps, countdown per minute,
cursor native, page transitions instant. Everything stays usable: browse, pick size, send.

## 9. Missing content

A string or fact blocked in `05` is **not rendered**: no "R$ --", no "Em breve" invented for a
price, no fake sizes. Without `NEXT_PUBLIC_WHATSAPP_NUMBER` the WhatsApp buttons are not
rendered and the bag shows `B-SEM-NUMERO`.

## 10. Open items

- Theme default ignores `prefers-color-scheme` (§3.4): Benito to confirm.
- Header layout on mobile with the switch + counter + menu in 56px: checked in T4 at 320px.
- Whether `/arquivo` shows sold-out pieces (archive as memory) or only buyable ones: proposal is
  both, sold-out pieces struck through **and** labelled, at full text contrast (`08` #14).
