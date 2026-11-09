// Catalogue interface (docs/06-ARCHITECTURE.md §3). Called from Server Components only; client
// components receive what they need as props (e.g. getCatalogIndex for the bag).
// Async on purpose, so a remote provider is a drop-in replacement.

import { loadStaticCatalog } from "./static-provider";
import type { Availability, CatalogIndexEntry, Drop, Product } from "./types";

export type * from "./types";
export { deriveDropState, isPurchasable, isReleased } from "./drop-state";

const DAY = 24 * 60 * 60 * 1000;

function data() {
  return loadStaticCatalog();
}

const byNewest = (a: Drop, b: Drop) => Date.parse(b.releaseAt) - Date.parse(a.releaseAt);

export async function getDrops(): Promise<Drop[]> {
  return [...data().drops].sort(byNewest);
}

export async function getDrop(slug: string): Promise<Drop | null> {
  return data().drops.find((d) => d.slug === slug) ?? null;
}

export async function getProducts(filter?: {
  dropSlug?: string;
  availability?: Availability;
}): Promise<Product[]> {
  return data().products.filter(
    (p) =>
      (!filter?.dropSlug || p.dropSlug === filter.dropSlug) &&
      (!filter?.availability || p.availability === filter.availability),
  );
}

export async function getProduct(slug: string): Promise<Product | null> {
  return data().products.find((p) => p.slug === slug) ?? null;
}

/** Newest drop released by now + 30 days; else the newest drop; null if there are none. */
export async function getCurrentDrop(now = Date.now()): Promise<Drop | null> {
  const drops = await getDrops();
  return drops.find((d) => Date.parse(d.releaseAt) <= now + 30 * DAY) ?? drops[0] ?? null;
}

export async function getCatalogIndex(): Promise<CatalogIndexEntry[]> {
  const { drops, products } = data();
  const dropName = new Map(drops.map((d) => [d.slug, d.name]));
  return products.map((p) => ({
    slug: p.slug,
    name: p.name,
    dropName: dropName.get(p.dropSlug) ?? "",
    price: p.price,
    placeholder: Boolean(p.placeholder),
    image: p.images[0] ? { src: p.images[0].src, alt: p.images[0].alt } : undefined,
  }));
}

/** Render time, passed to client clocks as their server snapshot (src/hooks/use-now.ts). */
export async function getRenderTime(): Promise<number> {
  return Date.now();
}

export async function hasPlaceholderData(): Promise<boolean> {
  const { drops, products } = data();
  return drops.some((d) => d.placeholder) || products.some((p) => p.placeholder);
}
