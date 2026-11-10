// Drop state on the client clock (docs/04-UX-LAYOUT-AND-MOTION.md §5): flips em-breve →
// disponível in place at releaseAt, without a reload. Under reduced motion the clock ticks once
// a minute (the countdown then shows minutes).

import { useSyncExternalStore } from "react";
import { deriveDropState } from "@/lib/catalog/drop-state";
import type { Availability, DropState } from "@/lib/catalog/types";
import { useNow } from "./use-now";
import { useReducedMotion } from "./use-reduced-motion";

export type DropStateInput = {
  releaseAt: string;
  renderedAt: number;
  products: { availability: Availability; notForSale?: boolean }[];
};

export function useDropState({ releaseAt, renderedAt, products }: DropStateInput): {
  state: DropState;
  now: number;
  remainingMs: number;
  reducedMotion: boolean;
} {
  const reducedMotion = useReducedMotion();
  const releaseMs = Date.parse(releaseAt);
  const tick = reducedMotion ? 60_000 : 1000;
  const now = useNow(renderedAt, tick);
  // A minute tick can land up to 59 s after releaseAt; never show a countdown past zero.
  const state = deriveDropState({ releaseAt }, products, now);
  return { state, now, remainingMs: Math.max(0, releaseMs - now), reducedMotion };
}

/** Is the drop still to open, on the browser clock? Server snapshot false: nothing date-based is
 *  claimed before hydration (empty bag, B20). Re-checked once a minute. */
export function useIsUpcoming(releaseAt: string | null | undefined): boolean {
  return useSyncExternalStore(
    (onTick) => {
      const id = setInterval(onTick, 60_000);
      return () => clearInterval(id);
    },
    () => (releaseAt ? Date.now() < Date.parse(releaseAt) : false),
    () => false,
  );
}
