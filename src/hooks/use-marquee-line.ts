// The marquee's live line (docs/tasks/TASK-B11-B15-B20-truthful-surfaces.md, B11): current drop
// state + countdown and the number of pieces that can be bought right now, from the same rules
// as the hero ticker (deriveDropState) and the archive (isPurchasable). Ticks once a second, or
// once a minute under reduced motion (no seconds then), like useDropState.

import { fill } from "@/content/fill";
import { strings } from "@/content/strings";
import { deriveDropState, isPurchasable } from "@/lib/catalog/drop-state";
import type { Availability } from "@/lib/catalog/types";
import { splitRemaining } from "@/lib/format/date";
import { useNow } from "./use-now";
import { useReducedMotion } from "./use-reduced-motion";

type PieceState = { availability: Availability; notForSale?: boolean };

export type MarqueeInput = {
  renderedAt: number;
  drop: { name: string; releaseAt: string; products: PieceState[] } | null;
  /** Every piece in the catalogue, with its drop's release time. */
  pieces: (PieceState & { releaseAt: string })[];
};

const pad = (n: number) => String(n).padStart(2, "0");

export function useMarqueeLine({ renderedAt, drop, pieces }: MarqueeInput): {
  drop: { label: string; state: string; countdown: string | null } | null;
  available: string | null;
  brand: string;
} {
  const reducedMotion = useReducedMotion();
  const now = useNow(renderedAt, reducedMotion ? 60_000 : 1000);

  let dropLine = null;
  if (drop) {
    const state = deriveDropState(drop, drop.products, now);
    const r = splitRemaining(Date.parse(drop.releaseAt) - now);
    dropLine = {
      label: `${strings["H-DROP-ATUAL"]} ${drop.name}`,
      state:
        state === "em-breve"
          ? strings["D-EM-BREVE"]
          : state === "disponivel"
            ? strings["D-DISPONIVEL"]
            : strings["D-ESGOTADO"],
      countdown:
        state === "em-breve"
          ? `${pad(r.days)}D ${pad(r.hours)}H ${pad(r.minutes)}M${reducedMotion ? "" : ` ${pad(r.seconds)}S`}`
          : null,
    };
  }

  const n = pieces.filter((p) => isPurchasable(p, p, now)).length;
  const available =
    n === 0 ? null : (n === 1 ? strings["A-CONTAGEM-1"] : fill(strings["A-CONTAGEM"], { n })).toUpperCase();

  return { drop: dropLine, available, brand: strings["M-FAIXA"] };
}
