import { describe, expect, it } from "vitest";
import {
  BAG_STORAGE_KEY,
  addLine,
  countItems,
  createBagStore,
  parseBag,
  removeLine,
  setLineQuantity,
} from "./store";

const a = { slug: "p1", size: "A", quantity: 1 };

describe("bag line operations", () => {
  it("merges the same product+size and caps at 99", () => {
    let lines = addLine([], a);
    lines = addLine(lines, { ...a, quantity: 2 });
    lines = addLine(lines, { ...a, size: "B" });
    expect(lines).toEqual([
      { slug: "p1", size: "A", quantity: 3 },
      { slug: "p1", size: "B", quantity: 1 },
    ]);
    expect(addLine(lines, { ...a, quantity: 500 })[0].quantity).toBe(99);
    expect(countItems(lines)).toBe(4);
  });
  it("sets quantity within 1–99 and removes", () => {
    expect(setLineQuantity([a], "p1", "A", 0)[0].quantity).toBe(1);
    expect(setLineQuantity([a], "p1", "A", 120)[0].quantity).toBe(99);
    expect(removeLine([a], "p1", "A")).toEqual([]);
  });
  it("parses storage defensively", () => {
    expect(parseBag(null)).toEqual([]);
    expect(parseBag("{nope")).toEqual([]);
    expect(parseBag('{"slug":"x"}')).toEqual([]);
    expect(
      parseBag(JSON.stringify([a, { slug: 1 }, { ...a, quantity: -2 }, { ...a, quantity: 2 }])),
    ).toEqual([{ slug: "p1", size: "A", quantity: 3 }]);
  });
});

describe("createBagStore", () => {
  const memory = () => {
    const m = new Map<string, string>();
    return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), m };
  };

  it("reads lazily, writes through, keeps snapshots stable", () => {
    const s = memory();
    s.setItem(BAG_STORAGE_KEY, JSON.stringify([a]));
    const store = createBagStore(s);
    const first = store.getSnapshot();
    expect(first).toEqual([a]);
    expect(store.getSnapshot()).toBe(first);
    store.update((l) => addLine(l, a));
    expect(JSON.parse(s.m.get(BAG_STORAGE_KEY)!)).toEqual([{ ...a, quantity: 2 }]);
    expect(store.getServerSnapshot()).toEqual([]);
  });

  it("follows other tabs through the storage event", () => {
    const s = memory();
    const events = new EventTarget();
    const store = createBagStore(s, events);
    let calls = 0;
    const off = store.subscribe(() => calls++);
    s.setItem(BAG_STORAGE_KEY, JSON.stringify([{ ...a, quantity: 4 }]));
    const e = new Event("storage") as Event & { key: string };
    e.key = BAG_STORAGE_KEY;
    events.dispatchEvent(e);
    expect(calls).toBe(1);
    expect(countItems(store.getSnapshot())).toBe(4);
    off();
  });

  it("survives blocked storage", () => {
    const store = createBagStore({
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    });
    expect(store.getSnapshot()).toEqual([]);
    expect(store.update((l) => addLine(l, a))).toEqual([a]);
  });
});
