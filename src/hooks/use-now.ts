// The clock for drop and product states (docs/04-UX-LAYOUT-AND-MOTION.md §5). A store, so the
// time is read the React way: the server snapshot is the time the page was rendered (hydration
// matches the HTML), then the browser's clock takes over and ticks every `intervalMs`.
// The snapshot is floored to the interval so it stays stable between ticks.

import { useSyncExternalStore } from "react";

export function useNow(renderedAt: number, intervalMs = 1000): number {
  return useSyncExternalStore(
    (onTick) => {
      const id = setInterval(onTick, intervalMs);
      return () => clearInterval(id);
    },
    () => Math.floor(Date.now() / intervalMs) * intervalMs,
    () => renderedAt,
  );
}
