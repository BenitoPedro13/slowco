# slowco

Online store for Slow Company (`@slow_tm`), built by Blessed Moon. Release 1 sells through
WhatsApp: the bag becomes a pre-filled message to the store's number. No Shopify, no payments,
no customer data stored.

Read `CLAUDE.md` first; the definition lives in `docs/` (`01` brand → `07` plan, `08` open
inputs, `STATUS.md`).

## Run it

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

WhatsApp ordering needs the store's number (digits only, with country code, no `+`):

```bash
# .env.local (gitignored)
NEXT_PUBLIC_WHATSAPP_NUMBER=55XXXXXXXXXXX
```

Without it the site works, but the "Pedir no WhatsApp" buttons are not rendered.

Client photos (from the private `references/` folder, list in `scripts/images/instagram-picks.tsv`;
EXIF/GPS stripped, written to `public/catalogo/`):

```bash
pnpm images:import    # needs .venv-ig (Python + Pillow)
```

Without them the catalogue shows drawn "FOTO DE EXEMPLO" images.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test             # unit (Vitest)
pnpm check:contrast   # colour contrast of every theme
pnpm build
pnpm test:e2e         # Playwright + axe (builds and serves on :3100)
pnpm check:launch     # lists what still blocks the public launch
```

## Catalogue

`src/content/catalog.ts`. Until the client sends real products it holds **placeholder records**
(`placeholder: true`), which the site labels as example data (`docs/08-OPEN-INPUTS.md` #22).

Stack: Next.js 16, React 19, Tailwind 4, pnpm. Private research material in `references/` is
gitignored and never imported or served.
