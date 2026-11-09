# TASK T6: drop page, drop mode, home sections

## Done (2026-11-09)

- `/drops/[slug]` (SSG, `revalidate = 60`): name, `DropStatus`, limited/no-restock labels only
  when the record says so, drop text if any, product grid (`CatalogCard`).
- `DropStatus` (client): `em-breve` shows `EM BREVE / {D-DATA}`, a `DD:HH:MM:SS` countdown
  (`aria-hidden`; screen readers get `D-CONTAGEM-ARIA`, minute precision) and a
  `PAUSAR/RETOMAR CONTAGEM` toggle (`aria-pressed`, WCAG 2.2.2). Flips to `DISPONÍVEL AGORA` /
  `ESGOTADO` in place on the client clock (`useDropState` → `useNow`). Reduced motion: one tick
  per minute, seconds hidden.
- Home: hero, photo band (`HOME_BAND`, only if the file exists), `DROP ATUAL` block,
  `AINDA DISPONÍVEL` (released older drops, buyable pieces), closing band `H-SLOW-MODE`.
- Placeholder data adjusted so every state exists: C em-breve (+3 d), B disponível, A esgotado.

## Checks run

typecheck 0, repo lint 0 errors, `pnpm build` ok (all routes static/SSG, 1 min revalidate).
Screenshots (headless Chromium): drop C at 1440 (countdown, drop theme), drop B at 375 (branco).

## Not run (Benito asked to test later, 2026-11-09)

`e2e/drop.spec.ts` (mocked clock: pause/resume, flip at `releaseAt`, axe per state) not written yet.
