// Horizontal rail controls (docs/tasks/TASK-B2-drop-chapters.md): knows whether the list
// overflows and whether it sits at either end, and scrolls one card per press (smooth only
// without reduced motion). Measures on mount, on resize (ResizeObserver, from a ref callback
// with cleanup) and on scroll (the React onScroll handler). No Effect.
// Mouse drag-to-scroll (TASK-B21): mouse pointers only (touch and trackpads scroll natively),
// snap suspended while dragging, and the click that ends a drag of more than 6px is cancelled.

import { useRef, useState } from "react";
import { useReducedMotion } from "./use-reduced-motion";

type Edges = { overflow: boolean; atStart: boolean; atEnd: boolean };

const GAP = 16;
const DRAG_SLOP = 6;

export function useRail() {
  const [edges, setEdges] = useState<Edges>({ overflow: false, atStart: true, atEnd: false });
  const reducedMotion = useReducedMotion();
  const [measure] = useState(() => (el: HTMLElement) => {
    const max = el.scrollWidth - el.clientWidth;
    const next = { overflow: max > 1, atStart: el.scrollLeft <= 1, atEnd: el.scrollLeft >= max - 1 };
    setEdges((prev) =>
      prev.overflow === next.overflow && prev.atStart === next.atStart && prev.atEnd === next.atEnd ? prev : next,
    );
  });

  // Stable ref callback (created once), so React does not re-run it on every render.
  const [attach] = useState(() => (el: HTMLUListElement | null) => {
    if (!el) return;
    measure(el);
    const ro = new ResizeObserver(() => measure(el));
    ro.observe(el);
    return () => ro.disconnect();
  });

  const drag = useRef({ id: -1, startX: 0, startLeft: 0, moved: false });
  const endDrag = (event: React.PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (d.id !== event.pointerId) return;
    d.id = -1;
    delete event.currentTarget.dataset.dragging;
  };

  return {
    ...edges,
    dragHandlers: {
      onPointerDown(event: React.PointerEvent<HTMLElement>) {
        if (event.pointerType !== "mouse" || event.button !== 0) return;
        drag.current = { id: event.pointerId, startX: event.clientX, startLeft: event.currentTarget.scrollLeft, moved: false };
      },
      onPointerMove(event: React.PointerEvent<HTMLElement>) {
        const d = drag.current;
        if (d.id !== event.pointerId) return;
        const el = event.currentTarget;
        const dx = event.clientX - d.startX;
        if (!d.moved && Math.abs(dx) > DRAG_SLOP) {
          d.moved = true;
          el.setPointerCapture(event.pointerId);
          el.dataset.dragging = "true";
        }
        if (d.moved) el.scrollLeft = d.startLeft - dx;
      },
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onClickCapture(event: React.MouseEvent<HTMLElement>) {
        if (!drag.current.moved) return;
        drag.current.moved = false;
        event.preventDefault();
        event.stopPropagation();
      },
      // Links and images would start a native drag-and-drop instead.
      onDragStart(event: React.DragEvent<HTMLElement>) {
        event.preventDefault();
      },
    },
    /** Ref callback for the list. */
    attach,
    onScroll: (event: React.UIEvent<HTMLElement>) => measure(event.currentTarget),
    /** Scroll the rail that contains `from` (the pressed button) by one card. */
    scroll(direction: -1 | 1, from: HTMLElement) {
      const el = from.closest(".rail")?.querySelector("ul");
      const card = el?.firstElementChild;
      if (!el || !card) return;
      const step = card.getBoundingClientRect().width + GAP;
      el.scrollBy({ left: direction * step, behavior: reducedMotion ? "auto" : "smooth" });
    },
  };
}
