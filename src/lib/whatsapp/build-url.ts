// wa.me click-to-chat link (docs/06-ARCHITECTURE.md §5). Format verified 2026-11-09 against
// https://faq.whatsapp.com/5913398998672934: full international number, digits only (no "+",
// no leading zeros, no brackets or dashes), message URL-encoded in `text`.

/** Digits only, 10–15 of them, no leading zero; anything else → null (buttons not rendered). */
export function normalizeWhatsAppNumber(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15 || digits.startsWith("0")) return null;
  return digits;
}

export function buildWhatsAppUrl(number: string, message?: string): string {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
