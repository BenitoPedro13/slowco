// Static provider: reads src/content/catalog.ts (docs/06-ARCHITECTURE.md §3). A future remote
// provider implements the same shape; nothing outside lib/catalog knows which one is used.

import { drops as drops_, products as products_ } from "@/content/catalog";
import { publicFileExists } from "@/lib/public-file";
import type { Drop, Product, ProductImage } from "./types";

export type CatalogData = { drops: Drop[]; products: Product[] };

const DRAWN = "/catalogo/exemplo/";

/** Keep images whose file is in public/; drawn stand-ins only when no real photo is there. */
function presentImages(images: ProductImage[]): ProductImage[] {
  const present = images.filter((i) => publicFileExists(i.src));
  const photos = present.filter((i) => !i.src.startsWith(DRAWN));
  return photos.length > 0 ? photos : present;
}

let cache: CatalogData | null = null;

export function loadStaticCatalog(): CatalogData {
  cache ??= {
    drops: drops_,
    products: products_.map((p) => ({ ...p, images: presentImages(p.images) })),
  };
  return cache;
}

/** Integrity problems in a catalogue (unit-tested on the real data). */
export function validateCatalog({ drops, products }: CatalogData): string[] {
  const problems: string[] = [];
  const dropSlugs = new Set<string>();
  for (const d of drops) {
    if (dropSlugs.has(d.slug)) problems.push(`duplicate drop slug ${d.slug}`);
    dropSlugs.add(d.slug);
    if (Number.isNaN(Date.parse(d.releaseAt))) problems.push(`bad releaseAt on ${d.slug}`);
  }
  const productSlugs = new Set<string>();
  for (const p of products) {
    if (productSlugs.has(p.slug)) problems.push(`duplicate product slug ${p.slug}`);
    productSlugs.add(p.slug);
    if (!dropSlugs.has(p.dropSlug)) problems.push(`${p.slug} points to missing drop ${p.dropSlug}`);
    if (p.sizes.length === 0) problems.push(`${p.slug} has no sizes`);
    const everySizeOut = p.sizes.every((s) => s.availability === "esgotado");
    if (everySizeOut && p.availability !== "esgotado") {
      problems.push(`${p.slug}: every size esgotado but product is ${p.availability}`);
    }
    if (p.price && (!Number.isInteger(p.price.cents) || p.price.cents <= 0)) {
      problems.push(`${p.slug}: price must be positive integer cents`);
    }
    for (const img of p.images) {
      if (!img.src.startsWith("/")) problems.push(`${p.slug}: image ${img.src} must be local`);
      if (!img.alt) problems.push(`${p.slug}: image ${img.src} has no alt`);
    }
  }
  return problems;
}
