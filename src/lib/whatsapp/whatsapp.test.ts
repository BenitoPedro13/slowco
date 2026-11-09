import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl, normalizeWhatsAppNumber } from "./build-url";
import { formatOrderMessage } from "./format-message";

describe("normalizeWhatsAppNumber", () => {
  it("strips +, spaces, brackets and dashes", () => {
    expect(normalizeWhatsAppNumber("+55 (21) 91234-5678")).toBe("5521912345678");
  });
  it("rejects missing, short, long and leading-zero values", () => {
    expect(normalizeWhatsAppNumber(undefined)).toBeNull();
    expect(normalizeWhatsAppNumber("")).toBeNull();
    expect(normalizeWhatsAppNumber("123456789")).toBeNull();
    expect(normalizeWhatsAppNumber("1234567890123456")).toBeNull();
    expect(normalizeWhatsAppNumber("021912345678")).toBeNull();
  });
});

describe("buildWhatsAppUrl", () => {
  it("builds a bare chat link without a message", () => {
    expect(buildWhatsAppUrl("5521912345678")).toBe("https://wa.me/5521912345678");
  });
  it("encodes newlines, slashes, accents, & and ?", () => {
    const url = buildWhatsAppUrl("5521912345678", "Olá ç\nA/B & C?");
    expect(url).toBe("https://wa.me/5521912345678?text=Ol%C3%A1%20%C3%A7%0AA%2FB%20%26%20C%3F");
    expect(decodeURIComponent(new URL(url).searchParams.get("text")!)).toBe("Olá ç\nA/B & C?");
  });
});

describe("formatOrderMessage", () => {
  const line = { product: "PEÇA X", drop: "DROP Y", size: "A", quantity: 2 };

  it("assembles the bag message of 05 §8", () => {
    expect(formatOrderMessage({ lines: [line, { ...line, size: "B", quantity: 1 }] })).toBe(
      [
        "Olá, Slow Company. Quero fazer um pedido pelo site:",
        "",
        "- PEÇA X (DROP Y) / tamanho A / 2 un.",
        "- PEÇA X (DROP Y) / tamanho B / 1 un.",
        "",
        "Pode confirmar a disponibilidade?",
      ].join("\n"),
    );
  });

  it("uses the single-piece opening, the optional price and a trimmed name", () => {
    const msg = formatOrderMessage({
      lines: [{ ...line, quantity: 1, price: "R$ 10,00" }],
      name: "  Ana & Bia ?  ",
      single: true,
    });
    expect(msg.split("\n")).toEqual([
      "Olá, Slow Company. Quero pedir esta peça pelo site:",
      "",
      "- PEÇA X (DROP Y) / tamanho A / 1 un. / R$ 10,00",
      "Nome: Ana & Bia ?",
      "",
      "Pode confirmar a disponibilidade?",
    ]);
  });

  it("caps the name at 60 characters and drops an empty one", () => {
    expect(formatOrderMessage({ lines: [line], name: "x".repeat(80) })).toContain(
      `Nome: ${"x".repeat(60)}\n`,
    );
    expect(formatOrderMessage({ lines: [line], name: "   " })).not.toContain("Nome:");
  });
});
