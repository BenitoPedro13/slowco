# 05 — Content

First version, 2026-11-09 (`tasks/TASK-definition.md`). **Every public string on the site**, by
ID, exactly as it ships (pt-BR). `04` places these IDs; this doc never places anything. Stored
case is the shipped case (`01` rule 4): no `text-transform` on these strings.

## 0. How to read the tables

**Source**:

- `L1`…`L18`: the client's own line (`01` §5), verbatim.
- `nova`: new UI copy written by Claude to `01` §6, a proposal; makes no claim.
- `fato`: a fact from the client (price, size, date, number…). **No fato value exists yet.**
- `nome`: the brand's name/handle as published (`08` #1).
- `catálogo`: filled from the catalogue record at render (`06` §3); the string here is the
  *format*, never a value.

**Gate** says what stops the string:

- `lançamento`: may render in local/preview builds; needs the client's approval (`08` #16)
  before the public launch. Logged in §11.
- `render #N`: a missing fact; the element **is not rendered at all** until `08` #N is answered
  (`04` §9). Never a placeholder.
- `—`: no gate.

**Placeholder catalogue** (`08` #22, default assumed by Claude): until the client sends products,
`src/content/catalog.ts` holds fake records (`DROP DE EXEMPLO A/B/C`, `PEÇA DE EXEMPLO 01–07`,
sizes `A/B/C`, no prices, no photos, dates relative to the build). They are not client facts,
are labelled on every page by `G-EXEMPLO`, and block the launch (`pnpm check:launch`).

Never shown anywhere: the 2023 price "R$199,90" seen on a Reel, sizes, stock numbers, delivery
areas, payment methods, phone numbers. They come from the client per release (`08` #4, #7, #8).

---

## 1. Global (`G-`)

| ID | String | Source | Gate | Notes |
| --- | --- | --- | --- | --- |
| G-NOME | `Slow Company` | nome | — | accessible name of any wordmark/stand-in (`01` rule 14) |
| G-WORDMARK | `SLOW` | nome | — | stand-in text (`02` §2.3), `aria-hidden` |
| G-TOPO | `SLOW COMPANY` | nome | — | **retired in T4**: the site header replaces the hero's top row |
| G-PULAR | `Pular para o conteúdo` | nova | lançamento | skip link |
| G-TEMA | `Tema` | nova | lançamento | radio group legend (visually hidden) |
| G-TEMA-PRETO | `Preto` | nova | lançamento | |
| G-TEMA-BRANCO | `Branco` | nova | lançamento | |
| G-TEMA-DROP | `Cor do drop` | nova | lançamento | |
| G-INSTAGRAM | `@slow_tm` | nome | — | link `https://www.instagram.com/slow_tm/`, same tab; accessible name `G-INSTAGRAM-ARIA` |
| G-INSTAGRAM-ARIA | `Slow Company no Instagram, @slow_tm` | nova | lançamento | |
| G-LEGAL-1 | `SLOW CREATIVE STUDIO AND INDUSTRY APPAREL` | L1 | lançamento | `lang="en"` |
| G-LEGAL-2 | `FOR PROFESSIONAL USE ONLY. ALL RIGHTS RESERVED.` | L2 | lançamento | `lang="en"` |
| G-NAV | `Navegação principal` | nova | lançamento | accessible name of the `<nav>` (header and menu sheet) |
| G-NAV-DROPS | `DROPS` | nova | lançamento | |
| G-NAV-ARQUIVO | `ARQUIVO` | nova | lançamento | |
| G-NAV-CONTATO | `CONTATO` | nova | lançamento | |
| G-MENU | `MENU` | nova | lançamento | |
| G-FECHAR | `FECHAR` | nova | lançamento | |
| G-SACOLA | `SACOLA` | nova | lançamento | header, with the counter |
| G-EXEMPLO | `DADOS DE EXEMPLO: drops, peças, tamanhos e datas deste site são fictícios até o catálogo da Slow Company chegar.` | nova | — (removed with the placeholder catalogue, `08` #22) | top-of-page note, `role="note"`, rendered while any placeholder record exists |
| G-SACOLA-ARIA | `Sacola, {n} itens` / `Sacola, 1 item` / `Sacola vazia` | nova | lançamento | `{n}` is the true count |

## 2. Home `/` (`H-`)

| ID | String | Source | Gate | Notes |
| --- | --- | --- | --- | --- |
| H-H1 | `Slow Company` | nome | — | visually hidden part of the `<h1>` (`04` §3.1) |
| H-LINHA | `DAS RUAS PARA O MUNDO` | L5 | lançamento | hero bottom row |
| H-DROP-ATUAL | `DROP ATUAL` | nova | lançamento | label above the current drop block (T6) |
| H-AINDA | `AINDA DISPONÍVEL` | nova | lançamento | pieces from older drops still on sale (T6) |
| H-SLOW-MODE | `SEJA BEM-VINDO AO SLOW MODE` | L8 | lançamento | closing band (T6) |

## 3. Drop `/drops/[slug]` (`D-`)

| ID | String | Source | Gate | Notes |
| --- | --- | --- | --- | --- |
| D-NOME | `{drop.nome}` | catálogo | render #14 | |
| D-EM-BREVE | `EM BREVE` | nova | lançamento | state `em-breve` |
| D-DATA | `{diaDaSemana}, {dd}/{mês}/{aaaa}, às {hh}h` | nova (format, `01` rule 9) | render #14 | format only; minutes appended as `{hh}h{min}` when not zero |
| D-CONTAGEM-ARIA | `Faltam {d} dias, {h} horas e {m} minutos` | nova | lançamento | accessible text of the countdown, updated per minute |
| D-PAUSAR | `PAUSAR CONTAGEM` | nova | lançamento | |
| D-RETOMAR | `RETOMAR CONTAGEM` | nova | lançamento | |
| D-DISPONIVEL | `DISPONÍVEL AGORA` | L11 | lançamento | state `disponivel` |
| D-ESGOTADO | `ESGOTADO` | nova | lançamento | state `esgotado` |
| D-LIMITADO | `PEÇAS LIMITADAS` | L17 (part) | render #14 | only if the drop record says `limitado: true` (`01` rule 17) |
| D-SEM-REPOSICAO | `SEM REPOSIÇÃO` | L17 (part) | render #14 | only if `semReposicao: true` |
| D-ABERTURA | `{drop.texto}` | catálogo | render #14 | the client's own drop text, if any |

## 4. Archive `/arquivo` (`A-`)

| ID | String | Source | Gate | Notes |
| --- | --- | --- | --- | --- |
| A-TITULO | `ARQUIVO` | nova | lançamento | |
| A-AINDA | `AINDA DISPONÍVEL` | nova | lançamento | per drop, count of buyable pieces is **not** shown |
| A-VER-DROP | `VER O DROP` | nova | lançamento | |
| A-ANO | `{aaaa}` | catálogo | render #14 | may use blackletter (`02` §4.1) |

## 5. Product `/produtos/[slug]` (`P-`)

| ID | String | Source | Gate | Notes |
| --- | --- | --- | --- | --- |
| P-NOME | `{produto.nome}` | catálogo | render #7 | |
| P-PRECO | `R$ {valor}` (e.g. format `R$ 0,00`) | catálogo, `01` rule 10 | render #7 | not rendered without a price |
| P-DESCRICAO | `{produto.descricao}` | catálogo | render #7 | the client's text |
| P-COR | `{produto.cor}` | catálogo | render #7 | |
| P-DO-DROP | `Do drop` | nova | lançamento | label before the drop link on a product page |
| P-TAMANHO | `Tamanho` | nova | lançamento | size radio group legend |
| P-TAM-ESGOTADO | `{tamanho}, esgotado` | nova | lançamento | accessible name of a sold-out size; visible: struck through + `ESGOTADO` |
| P-ESCOLHA | `Escolha um tamanho.` | nova | lançamento | error if adding without a size |
| P-ADICIONAR | `ADICIONAR À SACOLA` | nova | lançamento | |
| P-PEDIR-UMA | `PEDIR SÓ ESTA PEÇA` | nova | lançamento + render #4 | opens WhatsApp with one item (§8) |
| P-EM-BREVE | `EM BREVE` | nova | lançamento | product `em-breve` |
| P-ESGOTADO | `ESGOTADO` | nova | lançamento | product `esgotado` |
| P-NAO-VENDA | `NOT FOR SALE` | L16 | lançamento | for pieces shown but never sold, if the client wants them listed |
| P-GUIA | `GUIA DE TAMANHOS` | nova | render #7 | only if the client sends measurements |

## 6. Bag `/sacola` (`B-`)

| ID | String | Source | Gate | Notes |
| --- | --- | --- | --- | --- |
| B-TITULO | `SACOLA` | nova | lançamento | |
| B-VAZIA | `Sua sacola está vazia.` | nova | lançamento | |
| B-VER-DROP | `VER O DROP ATUAL` | nova | lançamento | from the empty bag |
| B-QTD | `Quantidade` | nova | lançamento | stepper label |
| B-MAIS | `Aumentar quantidade` | nova | lançamento | accessible name |
| B-MENOS | `Diminuir quantidade` | nova | lançamento | accessible name |
| B-REMOVER | `Remover` | nova | lançamento | |
| B-NOME | `Seu nome (opcional)` | nova | lançamento | the only input; goes into the message |
| B-NOTA | `O pedido é confirmado pelo WhatsApp: disponibilidade, pagamento e entrega são combinados na conversa.` | nova | lançamento + #8 | states how the site works (`01` rule 16); revised if the client publishes terms |
| B-ENVIAR | `PEDIR NO WHATSAPP` | nova | lançamento + render #4 | |
| B-ADICIONADO | `{produto}, tamanho {tamanho}, adicionado à sacola. Sacola com {n} itens.` | nova | lançamento | live region |
| B-ADICIONADO-1 | `{produto}, tamanho {tamanho}, adicionado à sacola. Sacola com 1 item.` | nova | lançamento | singular of B-ADICIONADO |
| B-REMOVIDO | `{produto} removido da sacola.` | nova | lançamento | live region |
| B-TAMANHO | `Tamanho {tamanho}` | nova | lançamento | size on a bag line |
| B-SEM-NUMERO | `Os pedidos pelo site ainda não estão abertos.` | nova | lançamento | shown when `NEXT_PUBLIC_WHATSAPP_NUMBER` is missing |

## 7. Contact `/contato`, 404 (`C-`, `X-`)

| ID | String | Source | Gate | Notes |
| --- | --- | --- | --- | --- |
| C-TITULO | `CONTATO` | nova | lançamento | |
| C-WHATSAPP | `FALAR NO WHATSAPP` | nova | lançamento + render #4 | opens a chat without a template |
| C-VIP | `ENTRE NO GRUPO VIP` | client (Reel 2024-06-25: "Entre no nosso grupo VIP") | render #15 | |
| C-VIP-TEXTO | `Acesso antecipado à coleção.` | client (same Reel) | render #15 | |
| C-ORIGEM | `De São Gonçalo pro mundo` | L6 | lançamento | |
| X-TITULO | `PÁGINA NÃO ENCONTRADA` | nova | lançamento | |
| X-VOLTAR | `VOLTAR PARA O INÍCIO` | nova | lançamento | |

## 8. WhatsApp message (`WA-`)

Link: `https://wa.me/<number>?text=<encodeURIComponent(message)>` (`06` §5). `<number>` is
`NEXT_PUBLIC_WHATSAPP_NUMBER`, digits only with country code; **never in this doc or in code**.
Whole template: gate `lançamento` + `08` #4 (number) and #5 (what it must contain). No emoji
(`01` rule 12).

| ID | String | Source | Notes |
| --- | --- | --- | --- |
| WA-ABERTURA | `Olá, Slow Company. Quero fazer um pedido pelo site:` | nova | first line |
| WA-ABERTURA-UMA | `Olá, Slow Company. Quero pedir esta peça pelo site:` | nova | single-piece order (`P-PEDIR-UMA`) |
| WA-ITEM | `- {produto} ({drop}) / tamanho {tamanho} / {quantidade} un.` | nova | one line per bag line |
| WA-ITEM-PRECO | ` / {preco}` | nova | appended to WA-ITEM only when the product has a price; `{preco}` per P-PRECO |
| WA-NOME | `Nome: {nome}` | nova | only when B-NOME is filled; trimmed, max 60 chars |
| WA-FECHO | `Pode confirmar a disponibilidade?` | nova | last line (`01` rule 16) |

Assembled (lines joined with `\n`, blank line after WA-ABERTURA and before WA-FECHO):

```
{WA-ABERTURA}

{WA-ITEM}{WA-ITEM-PRECO?}
{WA-ITEM}{WA-ITEM-PRECO?}
{WA-NOME?}

{WA-FECHO}
```

Placeholders: `{produto}` `produto.nome`; `{drop}` `drop.nome`; `{tamanho}` the size label as the
client writes it; `{quantidade}` integer ≥ 1; `{preco}` unit price formatted; `{nome}` the
visitor's input. No total line until the client confirms prices are final on the site (`08` #5).

## 9. Images and alt text (`IMG-`)

A file enters `public/` only when it is listed here with its source, by the prepare script
(`06` §7). 2026-11-09: Benito says the client agreed to the use of the @slow_tm photos and can
swap them later (`08` #9). The 15 picks are in `scripts/images/instagram-picks.tsv` (source post,
output name); alt texts are in `src/content/catalog.ts` and `src/content/editorial.ts`. They are
paired with the placeholder products only to show the layout. Until `pnpm images:import` is run,
drawn `FOTO DE EXEMPLO` images (`public/catalogo/exemplo/`, no people, made from scratch) stand in.

| ID | File (source) | Alt (pt-BR) | Consent | Gate |
| --- | --- | --- | --- | --- |
| IMG-IG-01…15 | `public/catalogo/slow-*.jpg` from `references/instagram/slow_tm/` (list in `scripts/images/instagram-picks.tsv`) | per file in `catalog.ts` / `editorial.ts` | client agreed, per Benito 2026-11-09; written confirmation still to file | lançamento |
| IMG-EX-01…07 | `public/catalogo/exemplo/*.jpg`, drawn by `scripts/images/make-placeholders.py` | `Imagem de exemplo: desenho de …` | no people | removed with 08 #22 |

Alt text rules: product photos describe the garment (`Camiseta preta com SLOW em branco nas
costas, vista de trás`); editorial photos describe the scene without naming people unless the
client approves the name; decorative textures `alt=""`.

## 10. Page metadata (`M-`)

| ID | String | Source | Gate |
| --- | --- | --- | --- |
| M-TITULO | `Slow Company` | nome | — |
| M-TITULO-MODELO | `%s · Slow Company` | nova | lançamento |
| M-DESCRICAO | `Slow Company: streetwear de São Gonçalo, RJ. Drops, arquivo e pedidos pelo WhatsApp.` | nova; "São Gonçalo, RJ" from the "SLOW CREATIVE STUDIO / São Gonçalo, RJ" title card in the 2023 Out of Time Reels (`00` §B.6) | lançamento + #4 |

## 11. Approval log

| Date | IDs | Approved by | Note |
| --- | --- | --- | --- |
| — | — | — | nothing approved yet (`08` #16) |
