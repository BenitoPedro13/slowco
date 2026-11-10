// One-time colour flood for a home chapter (docs/tasks/TASK-B2-drop-chapters.md, rule D2 in
// docs/10 §D2). The server renders the chapter already flooded (complete without JS). After
// hydration, a chapter still below the fold is set to data-flood="pending"; when its top passes
// 60% of the viewport it becomes "in" once, and is never reset. Reduced motion, or a chapter
// already in view: left alone (no wipe). Synchronises with IntersectionObserver, an external
// system, from a ref callback with cleanup (React 19), so no Effect and no React state.

function floodOnEnter(el: HTMLElement | null) {
  if (!el || typeof IntersectionObserver === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (el.dataset.flood === "in") return;
  if (el.getBoundingClientRect().top < window.innerHeight * 0.6) return;
  el.dataset.flood = "pending";
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      el.dataset.flood = "in";
      io.disconnect();
    },
    { rootMargin: "0px 0px -40% 0px" },
  );
  io.observe(el);
  return () => io.disconnect();
}

/** Ref callback for the chapter element. Module-level, so its identity is stable. */
export function useFlood() {
  return floodOnEnter;
}
