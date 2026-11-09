// Bag hooks (docs/06-ARCHITECTURE.md §4). The only place that reads BagContext. The rules that
// matter to the UI live here once: lines for products no longer in the catalogue are hidden and
// not counted; announcements use the 05 strings.

import { use, useSyncExternalStore } from "react";
import { BagContext, type BagServices } from "@/components/bag/bag-context";
import { fill } from "@/content/fill";
import { strings } from "@/content/strings";
import {
  addLine,
  countItems,
  removeLine,
  setLineQuantity,
  type BagLine,
} from "@/lib/bag/store";
import type { CatalogIndexEntry } from "@/lib/catalog/types";

export type ResolvedBagLine = BagLine & Omit<CatalogIndexEntry, "slug">;

function useServices(): BagServices {
  const services = use(BagContext);
  if (!services) throw new Error("Bag hooks need <BagProvider> (src/app/layout.tsx).");
  return services;
}

function resolve(lines: readonly BagLine[], index: BagServices["index"]): ResolvedBagLine[] {
  return lines.flatMap((l) => {
    const entry = index.get(l.slug);
    return entry ? [{ ...entry, ...l }] : [];
  });
}

export function useBagLines(): ResolvedBagLine[] {
  const { store, index } = useServices();
  const lines = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return resolve(lines, index);
}

export function useBagCount(): number {
  return countItems(useBagLines());
}

/** `G-SACOLA-ARIA` for a count. */
export function bagLabel(n: number) {
  if (n === 0) return strings["G-SACOLA-ARIA-0"];
  if (n === 1) return strings["G-SACOLA-ARIA-1"];
  return fill(strings["G-SACOLA-ARIA"], { n });
}

export function useBagActions() {
  const { store, index, announcer } = useServices();
  const nameOf = (slug: string) => index.get(slug)?.name ?? slug;
  const count = (lines: readonly BagLine[]) => countItems(resolve(lines, index));

  return {
    add(slug: string, size: string, quantity = 1) {
      const next = store.update((l) => addLine(l, { slug, size, quantity }));
      const n = count(next);
      const template = n === 1 ? strings["B-ADICIONADO-1"] : strings["B-ADICIONADO"];
      announcer.announce(fill(template, { produto: nameOf(slug), tamanho: size, n }));
    },
    setQuantity(slug: string, size: string, quantity: number) {
      store.update((l) => setLineQuantity(l, slug, size, quantity));
    },
    remove(slug: string, size: string) {
      store.update((l) => removeLine(l, slug, size));
      announcer.announce(fill(strings["B-REMOVIDO"], { produto: nameOf(slug) }));
    },
  };
}

export function useAnnouncement(): string {
  const { announcer } = useServices();
  return useSyncExternalStore(
    announcer.subscribe,
    announcer.getSnapshot,
    announcer.getServerSnapshot,
  );
}
