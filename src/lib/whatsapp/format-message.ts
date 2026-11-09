// Order message, assembled exactly as docs/05-CONTENT.md §8 (WA-* strings).

import { fill } from "@/content/fill";
import { strings } from "@/content/strings";

export type OrderLine = {
  product: string;
  drop: string;
  size: string;
  quantity: number;
  /** Already formatted unit price (P-PRECO); omitted when the product has none. */
  price?: string;
};

export const MAX_NAME_LENGTH = 60;

export function formatOrderMessage(input: {
  lines: OrderLine[];
  name?: string;
  single?: boolean;
}): string {
  const opening = input.single ? strings["WA-ABERTURA-UMA"] : strings["WA-ABERTURA"];
  const items = input.lines.map(
    (l) =>
      fill(strings["WA-ITEM"], {
        produto: l.product,
        drop: l.drop,
        tamanho: l.size,
        quantidade: l.quantity,
      }) + (l.price ? fill(strings["WA-ITEM-PRECO"], { preco: l.price }) : ""),
  );
  const name = input.name?.trim().slice(0, MAX_NAME_LENGTH);
  const out = [opening, "", ...items];
  if (name) out.push(fill(strings["WA-NOME"], { nome: name }));
  out.push("", strings["WA-FECHO"]);
  return out.join("\n");
}
