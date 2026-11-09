"use client";

// Sizes, add to bag, order one piece (docs/04-UX-LAYOUT-AND-MOTION.md §5, 05 §5, §8).
// Sizes are native radios: arrows move, Space selects. A sold-out size stays focusable so it is
// read out ("A, esgotado") but can never become the selection.

import { useState } from "react";
import { fill } from "@/content/fill";
import { strings } from "@/content/strings";
import { useBagActions } from "@/hooks/use-bag";
import { useNow } from "@/hooks/use-now";
import { formatDropDate } from "@/lib/format/date";
import { isPurchasable } from "@/lib/catalog/drop-state";
import type { Availability, Size } from "@/lib/catalog/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-url";
import { formatOrderMessage } from "@/lib/whatsapp/format-message";

const primary =
  "type-label inline-flex min-h-12 cursor-pointer items-center justify-center bg-content px-6 text-canvas underline-offset-4 hover:underline";
const secondary =
  "type-label inline-flex min-h-12 cursor-pointer items-center justify-center border border-content px-6 underline-offset-4 hover:underline";

export function ProductPurchase({
  product,
  releaseAt,
  renderedAt,
  whatsappNumber,
}: {
  product: {
    slug: string;
    name: string;
    dropName: string;
    sizes: Size[];
    availability: Availability;
    notForSale: boolean;
    price?: string;
  };
  releaseAt: string;
  renderedAt: number;
  whatsappNumber: string | null;
}) {
  const now = useNow(renderedAt);
  const { add } = useBagActions();
  const [size, setSize] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const buyable = isPurchasable(product, { releaseAt }, now);
  const released = now >= Date.parse(releaseAt);

  if (!buyable) {
    const label = product.notForSale
      ? strings["P-NAO-VENDA"]
      : !released
        ? strings["P-EM-BREVE"]
        : strings["P-ESGOTADO"];
    return (
      <div className="flex flex-col gap-2 border-t border-content pt-6">
        <p className="font-display text-4xl font-extrabold [font-stretch:62%]" lang={product.notForSale ? "en" : undefined}>
          {label}
        </p>
        {!released && !product.notForSale ? (
          <p className="type-label">{formatDropDate(releaseAt)}</p>
        ) : null}
      </div>
    );
  }

  const choose = (label: string) => {
    const s = product.sizes.find((x) => x.label === label);
    if (s?.availability !== "disponivel") return;
    setSize(label);
    setError(false);
  };

  const requireSize = () => {
    if (size) return size;
    setError(true);
    return null;
  };

  const onAdd = () => {
    const s = requireSize();
    if (s) add(product.slug, s);
  };

  const onOrderOne = () => {
    const s = requireSize();
    if (!s || !whatsappNumber) return;
    const message = formatOrderMessage({
      single: true,
      lines: [
        { product: product.name, drop: product.dropName, size: s, quantity: 1, price: product.price },
      ],
    });
    // New tab, like every link that leaves the site (Instagram, WhatsApp); the shop stays open.
    window.open(buildWhatsAppUrl(whatsappNumber, message), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-6 border-t border-content pt-6">
      <fieldset aria-describedby={error ? "erro-tamanho" : undefined}>
        <legend className="type-label mb-3">{strings["P-TAMANHO"]}</legend>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => {
            const out = s.availability !== "disponivel";
            return (
              <label
                key={s.label}
                className={`relative inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 border border-content px-3 has-checked:bg-content has-checked:text-canvas has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-content ${out ? "cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name="tamanho"
                  value={s.label}
                  checked={size === s.label}
                  onChange={() => choose(s.label)}
                  aria-disabled={out || undefined}
                  className="sr-only"
                />
                {out ? (
                  <>
                    <span aria-hidden="true" className="line-through">
                      {s.label}
                    </span>
                    <span aria-hidden="true" className="type-label">
                      {strings["P-ESGOTADO"]}
                    </span>
                    <span className="sr-only">
                      {fill(strings["P-TAM-ESGOTADO"], { tamanho: s.label })}
                    </span>
                  </>
                ) : (
                  s.label
                )}
              </label>
            );
          })}
        </div>
        {error ? (
          <p id="erro-tamanho" role="alert" className="type-label mt-3">
            {strings["P-ESCOLHA"]}
          </p>
        ) : null}
      </fieldset>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" className={primary} onClick={onAdd}>
          {strings["P-ADICIONAR"]}
        </button>
        {whatsappNumber ? (
          <button type="button" className={secondary} onClick={onOrderOne}>
            {strings["P-PEDIR-UMA"]}
          </button>
        ) : null}
      </div>
    </div>
  );
}
