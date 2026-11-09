# 08 — Open inputs

What the client or Benito still has to provide. Never invent these; an implementation task that
needs one stops until it arrives. Source sections are in `docs/00-DISCOVERY.md`.

| # | Input | Needed for | From | Source | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | The client's store name and Instagram handle | collector, brand, copy | Benito | C | **done** 2026-11-09: Slow Company, `@slow_tm`. Spelling on the profile: **Slow Company** (page title "Slow Company (@slow_tm)"; read 2026-11-09 from the public page, bio text not verified). Capitalization in running text still for the client to confirm |
| 2 | Logo (vector if any), colours, typefaces the client already uses | identity | client | A | open. Specifically (`02` §2.1): the italic SLOW wordmark, blackletter SLOW, globe, SC monogram, 2025 crest, as vectors; the colour of each drop; font names/files. Until then: Archivo stand-in and measured colours (`02`), all provisional |
| 3 | Site references: saved HTML + screen recordings + what Benito likes in each | creative direction | Benito | D | 3 refs + 3 recordings received 2026-11-09 (OUTFIT = Benito's pick); still open: what he likes in each (`00` §D.4) |
| 4 | WhatsApp number for orders (and whether one number or several) | checkout | client | C | open |
| 5 | WhatsApp message template: what it must contain (product, size, colour, quantity, name, delivery area?), tone, greeting | checkout | client + Benito | C | open |
| 6 | Catalogue source for release 1: who maintains it and where (a spreadsheet, a JSON in the repo, a CMS later?) and how products get photos | catalogue | Benito + client | C | open |
| 7 | Products: names, prices, sizes, colours, stock policy, photos, descriptions | catalogue | client | A, B | open |
| 8 | Shipping, payment (Pix? card link?), exchange and return terms, shown or only discussed on WhatsApp | content, legal | client | C | open |
| 9 | Consent of each identifiable person in photos | photos | client | B | open (2026-11-09: Benito says the client agreed and can change photos later; keep a written confirmation per model before launch) |
| 10 | Whether the 2025 structure (apparel / merch / new-drop / artists) fits the client | IA | Benito | E | open |
| 11 | Domain, hosting account (Vercel team) and who owns them | release | Benito + client | — | open |
| 12 | Whether Shopify returns later (decides how strict the catalogue interface must be) | architecture | Benito | C | open: assumed "maybe" |
| 13 | The existing site `slowcompany.com.br` (link in the Instagram bio): is it the current store, on what platform, and what happens to it when this one launches | release, IA, domain | Benito + client | B | open: Benito's screenshot (2026-11-09) shows the bio link answering "A loja está temporariamente fora de serviço" (store suspended, with an owner-admin link). So there is currently no working store; the 2025 prototype's Nuvemshop image host (`next.config.ts`) hints the old one was Nuvemshop, unconfirmed. Ask the client: reactivate, replace, or keep the domain for this site |
| 14 | Which pieces from past drops are still available, with stock/sizes, and the drop list with dates and names (Drop 1, Drop 2, 2023-08-06, Slow Racing Club, Slow Mode, ...) | catalogue, archive | client | B.2 | open |
| 15 | The VIP early-access group mentioned in a 2024 Reel: which platform (a WhatsApp group?), its invite link, and whether the site may promote it | drop mode, CTA | client | B.6 | open |
| 16 | Approval of the copy: the line bank `01` §5 (L1–L18, the client's own captions reused on the site) and every `nova` string in `05` (gate `lançamento`) | launch | client | `01`, `05` | open: nothing approved; strings render in previews only (`05` §0, §11) |
| 17 | Drop accents: is there a **neon green** in the brand? Not found on any garment in the 60 posts/13 Reels (only stage lighting and a jewel, `02` §3.1). Also confirm red as the current drop's colour and purple/blue for past drops | identity, drop mode | client | `02` §3.1 | open: red assumed current (2025), green unconfirmed and unused |
| 18 | Theme default: `preto` for everyone, ignoring the system light/dark preference (`04` §3.4) | UX | Benito | `04` §3.4 | open: proposal |
| 19 | Retire AlignUI from new code and remove it with the legacy pages in T8 (changes `CLAUDE.md` §5) | architecture | Benito | `06` §8 | open: proposal |
| 20 | Voice choices: `sacola` (not `carrinho`), no emoji on the site or in the WhatsApp message, `SEJA BEM-VINDO` hyphenated, `raízes` accented (`01` §5, §6) | copy | client | `01` | open: proposals |
| 21 | Size labels (P/M/G/GG or S–XL), max quantity per line, whether prices on the site are final or "a confirmar" | product, bag, WhatsApp template | client | `05` §5, §8; `06` §4 | open (part of #7) |
| 22 | Replace the **placeholder catalogue** (`src/content/catalog.ts`, every record `placeholder: true`: drops "Drop de exemplo A/B/C", products "Peça de exemplo N", sizes `A/B/C`, no prices, dates relative to the build) with the client's real drops and products (#7, #14, #21). `pnpm check:launch` fails while any placeholder remains | catalogue, launch | client | `06` §3 | open: placeholder data in use (default assumed by Claude, STATUS 2026-11-09) |
| 23 | **Globe stand-in**: the home globe is a generic procedural wireframe sphere drawn by our own code (`src/hooks/use-globe.ts`, `data-standin="globo"`), not the client's globe artwork. Replace with the client's own globe (file or approved redraw) or remove | home, brand | client | `docs/tasks/TASK-M4-globe.md` | open: stand-in in use (default assumed by Claude, not yet confirmed by Benito) |
| 24 | **Sound**: deferred. No sound file from the client. If wanted: off by default, explicit button, never autoplay | home | client | `docs/tasks/TASK-M5-sound.md` | open: deferred |
| 25 | **External links in a new tab** (Instagram, WhatsApp; the "PEDIR SÓ ESTA PEÇA" order too), announced to screen readers as "(abre em nova aba)". Internal links stay in the same tab | UX | Benito | `05` G-NOVA-ABA | open: default assumed by Claude, not yet confirmed by Benito |
