"use client";

// Bag context (docs/06-ARCHITECTURE.md §4). Holds stable instances only (the store, the catalogue
// index, the announcer), created once per mount: never a module-level store. Components read it
// through the hooks in src/hooks/use-bag.ts, never with useContext directly.

import { useState } from "react";
import { createAnnouncer } from "@/lib/announcer";
import { createBagStore } from "@/lib/bag/store";
import type { CatalogIndexEntry } from "@/lib/catalog/types";
import { BagContext, type BagServices } from "./bag-context";
import { LiveRegion } from "./live-region";

function browserStorage() {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function BagProvider({
  index,
  children,
}: {
  index: CatalogIndexEntry[];
  children: React.ReactNode;
}) {
  const [services] = useState<BagServices>(() => ({
    store: createBagStore(browserStorage(), typeof window === "undefined" ? undefined : window),
    index: new Map(index.map((e) => [e.slug, e])),
    announcer: createAnnouncer(),
  }));
  return (
    <BagContext value={services}>
      {children}
      <LiveRegion />
    </BagContext>
  );
}
