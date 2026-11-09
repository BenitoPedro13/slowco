// Custom cursor (docs/04-UX-LAYOUT-AND-MOTION.md §6). Only with a fine hovering pointer and no
// reduced-motion preference; otherwise nothing happens and the native cursor stays.
// The effect syncs with the DOM (pointer events, a class on <html>) and cleans up after itself.

import { useEffect, useRef } from "react";
import { useMediaQuery } from "./use-media-query";

const ENABLED_QUERY =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const INTERACTIVE = "a, button, label, summary, [role=button]";

export type CursorMode = "dot" | "ring" | "ver";

export function useCustomCursor() {
  const enabled = useMediaQuery(ENABLED_QUERY);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let frame = 0;
    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    let placed = false;
    // Ease toward the pointer; the loop stops once it has arrived (no idle rAF).
    const paint = () => {
      cx += (x - cx) * 0.28;
      cy += (y - cy) * 0.28;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      frame = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(paint) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!placed) {
        cx = x;
        cy = y;
        placed = true;
      }
      el.dataset.visible = "true";
      const target = e.target instanceof Element ? e.target : null;
      const mode: CursorMode = target?.closest("[data-cursor=ver]")
        ? "ver"
        : target?.closest(INTERACTIVE)
          ? "ring"
          : "dot";
      el.dataset.mode = mode;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      el.dataset.visible = "false";
    };
    const onDown = () => {
      el.dataset.press = "true";
    };
    const onUp = () => {
      el.dataset.press = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      root.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  return { enabled, ref };
}
