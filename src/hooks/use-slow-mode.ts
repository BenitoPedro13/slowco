// Slow Mode as React state (docs/tasks/TASK-B14-slow-mode.md). The OS reduced-motion preference
// wins: motion is already off, so the switch reads as on and cannot be turned off (`forced`).

import { useSyncExternalStore } from "react";
import { applySlowMode, getServerSnapshot, getSnapshot, subscribe } from "@/lib/motion/motion-store";
import { useReducedMotion } from "./use-reduced-motion";

export function useSlowMode() {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const forced = useReducedMotion();
  return { on: stored || forced, forced, set: applySlowMode };
}

/** A pause toggle whose default follows Slow Mode until the visitor presses it. */
export function usePausedBySlowMode(override: boolean | null) {
  const { on } = useSlowMode();
  return override ?? on;
}
