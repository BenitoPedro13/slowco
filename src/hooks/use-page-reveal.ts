import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { WIPE_EASING, WIPE_HALF_MS } from "@/lib/theme/themes";

// Animate the committed content without document snapshots. React's bundled ViewTransition
// reports Chromium's hidden-document cancellation as an error (TASK-A1, react/react#37669).
export function usePageReveal() {
  const path = usePathname();
  const previous = useRef(path);

  useEffect(() => {
    if (previous.current === path) return;
    previous.current = path;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const main = document.getElementById("conteudo");
    if (document.hidden || reducedMotion.matches || !main?.animate) return;

    const animation = main.animate(
      [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }],
      { duration: WIPE_HALF_MS, easing: WIPE_EASING },
    );
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
}
