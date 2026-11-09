// Drop and product state (docs/04-UX-LAYOUT-AND-MOTION.md §5). Pure: the clock is a parameter.

import type { Drop, DropState, Product } from "./types";

export function isReleased(drop: Pick<Drop, "releaseAt">, now: number) {
  return now >= Date.parse(drop.releaseAt);
}

export function deriveDropState(
  drop: Pick<Drop, "releaseAt">,
  products: Pick<Product, "availability" | "notForSale">[],
  now: number,
): DropState {
  if (!isReleased(drop, now)) return "em-breve";
  const anyAvailable = products.some((p) => !p.notForSale && p.availability === "disponivel");
  return anyAvailable ? "disponivel" : "esgotado";
}

/** Can this product be added to the bag right now? */
export function isPurchasable(
  product: Pick<Product, "availability" | "notForSale">,
  drop: Pick<Drop, "releaseAt">,
  now: number,
) {
  return isReleased(drop, now) && !product.notForSale && product.availability === "disponivel";
}
