import { describe, expect, it } from "vitest";
import { deriveDropState, isPurchasable } from "./drop-state";
import { getCatalogIndex, getCurrentDrop, getDrops, getProducts, hasPlaceholderData } from "./index";
import { loadStaticCatalog, validateCatalog } from "./static-provider";

const drop = { releaseAt: "2025-08-24T00:00:00-03:00" };
const before = Date.parse("2025-08-23T23:59:59-03:00");
const at = Date.parse("2025-08-24T00:00:00-03:00");

describe("deriveDropState (04 §5)", () => {
  it("is em-breve before releaseAt, whatever the stock", () => {
    expect(deriveDropState(drop, [{ availability: "disponivel" }], before)).toBe("em-breve");
  });
  it("is disponivel at releaseAt when one product is", () => {
    expect(
      deriveDropState(drop, [{ availability: "esgotado" }, { availability: "disponivel" }], at),
    ).toBe("disponivel");
  });
  it("is esgotado when nothing is buyable (not-for-sale pieces do not count)", () => {
    expect(
      deriveDropState(
        drop,
        [{ availability: "esgotado" }, { availability: "disponivel", notForSale: true }],
        at,
      ),
    ).toBe("esgotado");
  });
  it("isPurchasable needs release, availability and sale", () => {
    expect(isPurchasable({ availability: "disponivel" }, drop, before)).toBe(false);
    expect(isPurchasable({ availability: "disponivel" }, drop, at)).toBe(true);
    expect(isPurchasable({ availability: "disponivel", notForSale: true }, drop, at)).toBe(false);
    expect(isPurchasable({ availability: "esgotado" }, drop, at)).toBe(false);
  });
});

describe("catalogue data and interface", () => {
  it("has no integrity problems", () => {
    expect(validateCatalog(loadStaticCatalog())).toEqual([]);
  });
  it("validateCatalog catches broken records", () => {
    const problems = validateCatalog({
      drops: [{ slug: "d", name: "D", releaseAt: "nope", accent: "vermelho" }],
      products: [
        {
          slug: "p",
          dropSlug: "missing",
          name: "P",
          sizes: [{ label: "A", availability: "esgotado" }],
          availability: "disponivel",
          images: [{ src: "https://x/y.jpg", alt: "", width: 1, height: 1 }],
        },
      ],
    });
    expect(problems).toHaveLength(5);
  });
  it("lists drops newest first", async () => {
    const times = (await getDrops()).map((d) => Date.parse(d.releaseAt));
    expect(times).toEqual([...times].sort((a, b) => b - a));
  });
  it("getCurrentDrop picks the newest drop due within 30 days", async () => {
    const now = Date.now();
    const current = await getCurrentDrop(now);
    const due = (await getDrops()).filter((d) => Date.parse(d.releaseAt) <= now + 30 * 86400000);
    expect(current?.slug).toBe(due[0]?.slug);
  });
  it("filters products by drop and availability", async () => {
    const all = await getProducts();
    const some = await getProducts({ availability: "esgotado" });
    expect(some.every((p) => p.availability === "esgotado")).toBe(true);
    expect(some.length).toBeLessThan(all.length);
  });
  it("flags placeholder data while the client catalogue is missing (08 #22)", async () => {
    const index = await getCatalogIndex();
    expect(await hasPlaceholderData()).toBe(index.some((e) => e.placeholder));
  });
});
