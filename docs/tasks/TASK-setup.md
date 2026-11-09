# TASK: setup (repository guide, docs skeleton, collector)

## Current scenario

Existing repository (`main`, clean): a 2025 Next.js 15 + AlignUI + Shopify storefront for "Slow
Company", never finished. Benito wants to build it for a friend's clothing store, with the same
process as `../lunares` and `../desmolde`, no Shopify at first (WhatsApp message instead), and
very interactive design from site references he will send.

## Planned changes

1. `CLAUDE.md` adapted from `../desmolde/CLAUDE.md` (doc-set table, source hierarchy, consent,
   stack, a11y, work sequence, research tools), rewritten for a store.
2. `docs/` skeleton: `00-DISCOVERY.md`, `08-OPEN-INPUTS.md`, `STATUS.md`. `01`–`07` reserved.
3. `scripts/instagram/{console.js,collect.py}` copied from `../desmolde` (the newest, trimmed
   version): default handle removed, handle must be passed; doc references retargeted.
4. `references/{sites,client,instagram}/` created and gitignored, with `.venv-ig/`.

Rejected: copying lunares' `private/` layout (desmolde's single ignored `references/` is simpler);
running `shadcn init` and installing every library now (they enter per task, `CLAUDE.md` §5);
touching the legacy Shopify code before the definition says what survives.

## Not done here, planned next

- **T-wa: WhatsApp checkout plan.** Cart in the client (a small store or a cookie, decided in
  `05-ARCHITECTURE`), "Pedir no WhatsApp" builds `https://wa.me/<number>?text=<encoded template>`
  from items, sizes, quantities and an optional name. The number and template come from config and
  the content doc (`08` #4, #5). No server state, no customer data stored.
- **T-cat: catalogue interface.** One `getProducts()`/`getProduct(handle)` boundary with a static
  (JSON or TS) provider now and an optional Shopify provider later; the legacy `src/lib/shopify*.ts`
  moves behind it or goes.
- **T-libs: component libraries.** shadcn init compatible with the AlignUI folder, registries
  (`@magicui`, `@react-bits`, `@canvas-ui`), GSAP + Lenis, only the pieces a defined page uses.
- Rename `package.json` (`projetinhotodolist`) and rewrite `README.md` (still describes Shopify).

## Why

Research before definition: the client's branding and Benito's references decide the direction;
nothing about look or copy is fixed yet, and the guide says so.

## Affected files

| File | Change type | Notes |
| --- | --- | --- |
| `CLAUDE.md` | new | |
| `.gitignore` | edited | `references/`, `.venv-ig/` private |
| `docs/00-DISCOVERY.md`, `docs/08-OPEN-INPUTS.md`, `docs/STATUS.md` | new | |
| `docs/tasks/TASK-setup.md` | new | this file |
| `scripts/instagram/console.js`, `collect.py` | copied | handle required |
| `references/**` | new, ignored | empty folders |

## Verification

- `node --check scripts/instagram/console.js`; Python AST parse of `collect.py` (both pass).
- `git status` shows nothing under `references/`.
- A live Instagram run is Benito's browser check; not verified here.
- `git diff --check`.
