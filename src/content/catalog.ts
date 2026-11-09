// PLACEHOLDER CATALOGUE (docs/08-OPEN-INPUTS.md #22). Nothing here is a fact about Slow Company:
// names say "EXEMPLO", sizes are A/B/C (not the client's size scheme), no prices. Photos are the
// client's own @slow_tm posts (05 §9, imported by `pnpm images:import`), paired with these fake
// products only to show the layout: the pairing says nothing about what the pieces are. Without
// the imported files the drawn FOTO DE EXEMPLO images are used instead;
// and release dates are computed relative to the build so every drop state can be seen:
// C opens in 3 days (em-breve), B is open with pieces left (disponivel), A is sold out.
// The site shows a "DADOS DE EXEMPLO" notice whenever these records render, and
// `pnpm check:launch` fails while any record has `placeholder: true`.
// Replace the whole file with the client's drops and products (08 #7, #14, #21).

import type { Drop, Product, ProductImage, Size } from "@/lib/catalog/types";

const DAY = 24 * 60 * 60 * 1000;
const BUILT_AT = Date.now();

/** A placeholder date: `days` from build time, on the hour, in -03:00. */
function relativeDate(days: number, hour: number) {
  const d = new Date(BUILT_AT + days * DAY);
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  return `${ymd}T${String(hour).padStart(2, "0")}:00:00-03:00`;
}

const KINDS: Record<string, string> = {
  "01": "camiseta",
  "02": "moletom",
  "03": "camiseta",
  "04": "camiseta",
  "05": "moletom",
  "06": "camiseta",
  "07": "moletom",
};

/** Client photo from public/catalogo (05 §9), 1080×1440 as posted. */
const photo = (name: string, alt: string): ProductImage => ({
  src: `/catalogo/${name}.jpg`,
  alt,
  width: 1080,
  height: 1440,
});

/** Drawn example image, used only when the photos were not imported (08 #22). */
const exampleImage = (n: string): ProductImage => ({
  src: `/catalogo/exemplo/peca-de-exemplo-${n}.jpg`,
  alt: `Imagem de exemplo: desenho de ${KINDS[n]}, não é foto de uma peça real.`,
  width: 1080,
  height: 1350,
});

const PHOTOS: Record<string, ProductImage[]> = {
  "01": [
    photo("slow-2025-12-30-04", "Modelo de óculos escuros com camiseta preta de estampa redonda branca, num mirante sobre o mar."),
    photo("slow-2025-12-30-05", "Camiseta preta com estampa em vermelho e branco, vestida num beco com grafite."),
  ],
  "02": [
    photo("slow-2025-12-30-08", "Camiseta branca com estampa grande em preto e branco, vista numa quadra cercada por alambrado."),
    photo("slow-2025-12-30-02", "Camiseta branca com estampa em vermelho e preto, modelo sentado diante de um muro grafitado."),
  ],
  "03": [
    photo("slow-2025-08-21-04", "Camiseta branca vista de costas com 2025/SLOW APPAREL COMPANY em azul, modelo segurando uma bola."),
    photo("slow-2025-08-24-05", "Camiseta branca com logo SLOW no peito e bermuda azul, modelo com o pé sobre uma bola numa encosta verde."),
  ],
  "04": [
    photo("slow-2025-08-21-08", "Camisa azul-marinho número 23 com bermuda vermelha escrita Slow Mode, modelo segurando uma bola."),
    photo("slow-2025-08-24-06", "Camisa azul-marinho com Slow Mode em vermelho no peito e bermuda vermelha, modelo de óculos escuros."),
  ],
  "05": [
    photo("slow-2025-08-24-04", "Camiseta preta com logo SLOW no peito, modelo equilibrando uma bola diante de um muro grafitado."),
    photo("slow-2025-08-21-10", "Camisa preta escrita Slow Company e bermuda preta, modelo cobrindo os olhos diante de um muro pichado."),
  ],
  "06": [
    photo("slow-2025-08-24-01", "Agasalho preto com bordados brancos, jaqueta e calça, modelo num galpão abandonado."),
    photo("slow-2025-08-21-03", "Jaqueta preta com detalhes brancos, modelo agachado de óculos escuros sob céu azul."),
  ],
  "07": [
    photo("slow-2025-08-24-09", "Camiseta preta com o monograma SC em branco no peito, modelo num ambiente escuro."),
    photo("slow-2025-08-24-10", "Boné preto e jaqueta preta com o monograma SC e o logo SLOW em branco."),
  ],
};

/** Photos first; the provider drops files that are not in public/ (and the drawing if a photo is). */
const images = (n: string) => [...PHOTOS[n], exampleImage(n)];

const sizes = (a: Size["availability"], b: Size["availability"], c: Size["availability"]) => [
  { label: "A", availability: a },
  { label: "B", availability: b },
  { label: "C", availability: c },
];

export const drops: Drop[] = [
  {
    slug: "drop-de-exemplo-c",
    name: "DROP DE EXEMPLO C",
    releaseAt: relativeDate(3, 18),
    accent: "vermelho",
    placeholder: true,
  },
  {
    slug: "drop-de-exemplo-b",
    name: "DROP DE EXEMPLO B",
    releaseAt: relativeDate(-60, 18),
    accent: "azul",
    placeholder: true,
  },
  {
    slug: "drop-de-exemplo-a",
    name: "DROP DE EXEMPLO A",
    releaseAt: relativeDate(-400, 20),
    accent: "roxo",
    placeholder: true,
  },
];

export const products: Product[] = [
  {
    slug: "peca-de-exemplo-01",
    dropSlug: "drop-de-exemplo-c",
    name: "PEÇA DE EXEMPLO 01",
    sizes: sizes("disponivel", "disponivel", "disponivel"),
    availability: "disponivel",
    images: images("01"),
    placeholder: true,
  },
  {
    slug: "peca-de-exemplo-02",
    dropSlug: "drop-de-exemplo-c",
    name: "PEÇA DE EXEMPLO 02",
    sizes: sizes("disponivel", "disponivel", "esgotado"),
    availability: "disponivel",
    images: images("02"),
    placeholder: true,
  },
  {
    slug: "peca-de-exemplo-03",
    dropSlug: "drop-de-exemplo-b",
    name: "PEÇA DE EXEMPLO 03",
    sizes: sizes("disponivel", "disponivel", "disponivel"),
    availability: "disponivel",
    images: images("03"),
    placeholder: true,
  },
  {
    slug: "peca-de-exemplo-04",
    dropSlug: "drop-de-exemplo-b",
    name: "PEÇA DE EXEMPLO 04",
    sizes: sizes("disponivel", "esgotado", "disponivel"),
    availability: "disponivel",
    images: images("04"),
    placeholder: true,
  },
  {
    slug: "peca-de-exemplo-05",
    dropSlug: "drop-de-exemplo-b",
    name: "PEÇA DE EXEMPLO 05",
    sizes: sizes("esgotado", "esgotado", "esgotado"),
    availability: "esgotado",
    images: images("05"),
    placeholder: true,
  },
  {
    slug: "peca-de-exemplo-06",
    dropSlug: "drop-de-exemplo-a",
    name: "PEÇA DE EXEMPLO 06",
    sizes: sizes("esgotado", "esgotado", "esgotado"),
    availability: "esgotado",
    images: images("06"),
    placeholder: true,
  },
  {
    slug: "peca-de-exemplo-07",
    dropSlug: "drop-de-exemplo-a",
    name: "PEÇA DE EXEMPLO 07",
    sizes: sizes("esgotado", "esgotado", "esgotado"),
    availability: "esgotado",
    images: images("07"),
    placeholder: true,
  },
];
