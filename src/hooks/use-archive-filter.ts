import { useLayoutEffect, useRef, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "./use-reduced-motion";

export function useArchiveFilter(filter: string) {
  const router = useRouter();
  const [selected, setSelected] = useOptimistic(filter);
  const [, startTransition] = useTransition();
  const grid = useRef<HTMLOListElement>(null);
  const previous = useRef(new Map<string, DOMRect>());
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    const animations: Animation[] = [];
    if (!reduced) {
      for (const tile of grid.current?.querySelectorAll<HTMLElement>("[data-drop]") ?? []) {
        const before = previous.current.get(tile.dataset.drop!);
        if (!before) continue;
        const after = tile.getBoundingClientRect();
        const x = before.left - after.left;
        const y = before.top - after.top;
        if (x || y) animations.push(tile.animate([
          { transform: `translate(${x}px, ${y}px)` }, { transform: "none" },
        ], { duration: 240, easing: "ease-out" }));
      }
    }
    previous.current.clear();
    return () => animations.forEach(animation => animation.cancel());
  }, [selected, reduced]);
  return {
    grid, selected,
    select(next: string) {
      previous.current = new Map([...grid.current?.querySelectorAll<HTMLElement>("[data-drop]") ?? []]
        .map(tile => [tile.dataset.drop!, tile.getBoundingClientRect()]));
      const query = new URLSearchParams(window.location.search);
      if (next === "todos") query.delete("estado"); else query.set("estado", next);
      startTransition(() => {
        setSelected(next);
        router.push(`/arquivo${query.size ? `?${query}` : ""}`, { scroll: false });
      });
    },
  };
}
