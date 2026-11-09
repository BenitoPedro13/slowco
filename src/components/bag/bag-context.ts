// Bag context: stable services only (docs/06-ARCHITECTURE.md §4). Read via src/hooks/use-bag.ts.

import { createContext } from "react";
import type { Announcer } from "@/lib/announcer";
import type { BagStore } from "@/lib/bag/store";
import type { CatalogIndexEntry } from "@/lib/catalog/types";

export type BagServices = {
  store: BagStore;
  index: ReadonlyMap<string, CatalogIndexEntry>;
  announcer: Announcer;
};

export const BagContext = createContext<BagServices | null>(null);
