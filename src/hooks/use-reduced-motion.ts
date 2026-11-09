// prefers-reduced-motion as React state (docs/04-UX-LAYOUT-AND-MOTION.md §8). Server: false.

import { useMediaQuery } from "./use-media-query";

export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
