import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motionScale } from "@/lib/motion/motion-store";
import { WIPE_EASING, WIPE_HALF_MS } from "@/lib/theme/themes";

/** Drop curtain (TASK-B22): ≤ 450ms, at most one per second (flash rule D2). */
const CURTAIN_MS = 420;
const CURTAIN_GAP_MS = 1000;

// Animate the committed content without document snapshots. React's bundled ViewTransition
// reports Chromium's hidden-document cancellation as an error (TASK-A1, react/react#37669).
// TASK-B22: nothing on back/forward (popstate); a curtain in the destination drop's accent when
// the new <main> carries data-curtain-accent, instead of the plain reveal.
export function usePageReveal() {
  const path = usePathname();
  const previous = useRef(path);
  const traversal = useRef(false);
  const lastCurtain = useRef(-Infinity);
  const curtainRef = useRef<HTMLDivElement>(null);

  // Back/forward: the next path change is a restore, not a navigation.
  useEffect(() => {
    const onPop = () => {
      traversal.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (previous.current === path) return;
    previous.current = path;
    const restored = traversal.current;
    traversal.current = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const main = document.getElementById("conteudo");
    if (restored || document.hidden || reducedMotion.matches || !main?.animate) return;

    const accent = main.dataset.curtainAccent;
    const curtain = curtainRef.current;
    const now = performance.now();
    const useCurtain = Boolean(accent && curtain?.animate) && now - lastCurtain.current >= CURTAIN_GAP_MS;

    let animation: Animation;
    if (useCurtain && curtain && accent) {
      lastCurtain.current = now;
      curtain.dataset.accent = accent;
      animation = curtain.animate(
        [
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0 0 0 0)", offset: 0.45 },
          { clipPath: "inset(0 0 0 0)", offset: 0.55 },
          { clipPath: "inset(0 0 100% 0)" },
        ],
        { duration: CURTAIN_MS * motionScale(), easing: WIPE_EASING },
      );
    } else {
      animation = main.animate(
        [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }],
        { duration: WIPE_HALF_MS * motionScale(), easing: WIPE_EASING },
      );
    }
    const cancelIfHidden = () => {
      if (document.hidden) animation.cancel();
    };
    const cancelIfReduced = () => {
      if (reducedMotion.matches) animation.cancel();
    };
    document.addEventListener("visibilitychange", cancelIfHidden);
    reducedMotion.addEventListener("change", cancelIfReduced);
    return () => {
      animation.cancel();
      document.removeEventListener("visibilitychange", cancelIfHidden);
      reducedMotion.removeEventListener("change", cancelIfReduced);
    };
  }, [path]);

  return curtainRef;
}
