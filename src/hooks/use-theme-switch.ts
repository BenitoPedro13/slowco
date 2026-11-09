"use client";

// Theme switch behaviour (docs/04-UX-LAYOUT-AND-MOTION.md §3.4–§3.5, docs/06-ARCHITECTURE.md §6):
// reads the DOM theme through useSyncExternalStore, coalesces requests, throttles applied
// changes to ≥ THEME_MIN_INTERVAL_MS (WCAG 2.3.1) and runs the wipe with the Web Animations API.

import { useRef, useState, useSyncExternalStore } from "react";
import {
  applyTheme,
  getServerSnapshot,
  getSnapshot,
  subscribe,
} from "@/lib/theme/theme-store";
import {
  THEME_MIN_INTERVAL_MS,
  WIPE_EASING,
  WIPE_HALF_MS,
  type Theme,
} from "@/lib/theme/themes";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useThemeSwitch() {
  const applied = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // The choice the visitor made last, shown immediately while the page catches up.
  const [requested, setRequested] = useState<Theme | null>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const control = useRef({ busy: false, pending: null as Theme | null, lastAppliedAt: -Infinity });

  async function pump() {
    const c = control.current;
    if (c.busy) return;
    c.busy = true;
    try {
      while (c.pending) {
        const target = c.pending;
        c.pending = null;
        if (target === getSnapshot()) continue;

        const wipe = wipeRef.current;
        const animate = !prefersReducedMotion() && wipe !== null && typeof wipe.animate === "function";
        // The theme is applied WIPE_HALF_MS after the wipe starts; wait so applies stay apart.
        const leadIn = animate ? WIPE_HALF_MS : 0;
        const wait = c.lastAppliedAt + THEME_MIN_INTERVAL_MS - (performance.now() + leadIn);
        if (wait > 0) {
          await sleep(wait);
          // A newer request may have arrived while waiting: take the latest.
          if (c.pending) continue;
        }

        if (!animate || !wipe) {
          applyTheme(target);
          c.lastAppliedAt = performance.now();
          continue;
        }

        wipe.dataset.theme = target;
        const timing = { duration: WIPE_HALF_MS, easing: WIPE_EASING, fill: "forwards" as const };
        await wipe.animate([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }], timing)
          .finished;
        applyTheme(target);
        c.lastAppliedAt = performance.now();
        await wipe.animate([{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 100% 0)" }], timing)
          .finished;
        for (const animation of wipe.getAnimations()) animation.cancel();
      }
    } finally {
      c.busy = false;
      setRequested(null);
    }
  }

  function select(theme: Theme) {
    setRequested(theme);
    control.current.pending = theme;
    void pump();
  }

  return { theme: requested ?? applied, select, wipeRef };
}
