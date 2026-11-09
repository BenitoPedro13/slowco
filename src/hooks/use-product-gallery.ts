import { useRef, useState } from "react";
import { useReducedMotion } from "./use-reduced-motion";

export function useProductGallery(count: number) {
  const track = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);
  const reduced = useReducedMotion();
  return {
    track, index, zoom,
    select(next: number) {
      const el = track.current;
      if (el) el.scrollTo({ left: next * el.clientWidth, behavior: reduced ? "instant" : "smooth" });
    },
    onScroll() {
      const el = track.current;
      if (el?.clientWidth) setIndex(Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth))));
    },
    open(next: number, button: HTMLButtonElement) { opener.current = button; setZoom(next); },
    close() { setZoom(null); },
    restoreFocus() { opener.current?.focus({ preventScroll: true }); },
    step(delta: number) { setZoom(current => current === null ? null : (current + delta + count) % count); },
  };
}
