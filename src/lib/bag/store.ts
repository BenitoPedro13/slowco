// The bag (docs/06-ARCHITECTURE.md §4): lines of {product, size, quantity} kept in localStorage,
// read through useSyncExternalStore. No prices or names are stored: they come from the catalogue
// index at render time, so a stale bag never shows stale data.

export type BagLine = { slug: string; size: string; quantity: number };

export const BAG_STORAGE_KEY = "slow:sacola";
export const MAX_QUANTITY = 99;

const EMPTY: readonly BagLine[] = Object.freeze([]);

const clamp = (q: number) => Math.min(MAX_QUANTITY, Math.max(1, Math.trunc(q)));
const same = (l: BagLine, slug: string, size: string) => l.slug === slug && l.size === size;

export function addLine(lines: readonly BagLine[], add: BagLine): BagLine[] {
  const found = lines.some((l) => same(l, add.slug, add.size));
  if (!found) return [...lines, { ...add, quantity: clamp(add.quantity) }];
  return lines.map((l) =>
    same(l, add.slug, add.size) ? { ...l, quantity: clamp(l.quantity + add.quantity) } : l,
  );
}

export function setLineQuantity(
  lines: readonly BagLine[],
  slug: string,
  size: string,
  quantity: number,
): BagLine[] {
  return lines.map((l) => (same(l, slug, size) ? { ...l, quantity: clamp(quantity) } : l));
}

export function removeLine(lines: readonly BagLine[], slug: string, size: string): BagLine[] {
  return lines.filter((l) => !same(l, slug, size));
}

export function countItems(lines: readonly BagLine[]) {
  return lines.reduce((n, l) => n + l.quantity, 0);
}

/** Anything malformed in storage is dropped rather than trusted. */
export function parseBag(raw: string | null): readonly BagLine[] {
  if (!raw) return EMPTY;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return EMPTY;
    let lines: BagLine[] = [];
    for (const item of data) {
      if (
        item &&
        typeof item.slug === "string" &&
        typeof item.size === "string" &&
        typeof item.quantity === "number" &&
        Number.isFinite(item.quantity) &&
        item.quantity >= 1
      ) {
        lines = addLine(lines, { slug: item.slug, size: item.size, quantity: item.quantity });
      }
    }
    return lines;
  } catch {
    return EMPTY;
  }
}

type StorageLike = Pick<Storage, "getItem" | "setItem">;

export type BagStore = ReturnType<typeof createBagStore>;

export function createBagStore(storage: StorageLike | null, events?: EventTarget) {
  let lines: readonly BagLine[] = EMPTY;
  let loaded = false;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  const read = () => {
    try {
      lines = parseBag(storage?.getItem(BAG_STORAGE_KEY) ?? null);
    } catch {
      lines = EMPTY;
    }
    loaded = true;
  };

  // Another tab changed the bag (the `storage` event never fires in the tab that wrote).
  const onStorage = (e: Event) => {
    const key = (e as StorageEvent).key;
    if (key !== BAG_STORAGE_KEY && key !== null) return;
    read();
    emit();
  };

  return {
    subscribe(listener: () => void) {
      if (listeners.size === 0) events?.addEventListener("storage", onStorage);
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) events?.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot(): readonly BagLine[] {
      if (!loaded) read();
      return lines;
    },
    getServerSnapshot(): readonly BagLine[] {
      return EMPTY;
    },
    update(change: (current: readonly BagLine[]) => BagLine[]) {
      if (!loaded) read();
      lines = change(lines);
      try {
        storage?.setItem(BAG_STORAGE_KEY, JSON.stringify(lines));
      } catch {
        // storage full or blocked: the bag still works for this visit
      }
      emit();
      return lines;
    },
  };
}
