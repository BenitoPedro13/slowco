// Custom cursor (docs/04-UX-LAYOUT-AND-MOTION.md §6). Only with a fine hovering pointer and no
// reduced-motion preference; otherwise nothing happens and the native cursor stays.
// The effect syncs with the DOM (pointer events, a class on <html>) and cleans up after itself.

import { useEffect, useRef } from "react";
import { strings } from "@/content/strings";
import { useMediaQuery } from "./use-media-query";

const ENABLED_QUERY =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const INTERACTIVE = "a, button, label, summary, [role=button]";

/** Labelled modes, set with data-cursor on an element (TASK-B21). */
const LABELS = { ver: strings["CUR-VER"], pedir: strings["CUR-PEDIR"], arrastar: strings["CUR-ARRASTAR"] } as const;
type LabelMode = keyof typeof LABELS;
const isLabelMode = (v: string | undefined): v is LabelMode => v !== undefined && v in LABELS;

export type CursorMode = "dot" | "ring" | LabelMode;

export function useCustomCursor() {
  const enabled = useMediaQuery(ENABLED_QUERY);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");
    const label = el.querySelector<HTMLElement>(".custom-cursor__label");

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
      // The nearest of a labelled element or an interactive one wins: a link inside a rail keeps
      // the ring, a photo inside a link keeps VER (TASK-B21).
      const near = target?.closest<HTMLElement>(`[data-cursor], ${INTERACTIVE}`);
      const wanted = near?.dataset.cursor;
      const mode: CursorMode = isLabelMode(wanted) ? wanted : near ? "ring" : "dot";
      if (el.dataset.mode !== mode) {
        el.dataset.mode = mode;
        if (label && isLabelMode(mode)) label.textContent = LABELS[mode];
      }
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
