// Skip the entry loader at any moment: the button, Escape or a click anywhere on it
// (docs/tasks/TASK-M1-entry-loader.md). Syncs with the DOM; listeners removed on cleanup.

import { useEffect } from "react";

function skip() {
  document.documentElement.setAttribute("data-entrada", "vista");
}

export function useEntrySkip() {
  useEffect(() => {
    const loader = document.querySelector<HTMLElement>(".entry-loader");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    // When the CSS exit ends, mark it seen so a later client navigation home does not replay it.
    const onEnd = (e: AnimationEvent) => {
      if (e.target === loader && e.animationName === "entrada-sai") skip();
    };
    window.addEventListener("keydown", onKey);
    loader?.addEventListener("click", skip);
    loader?.addEventListener("animationend", onEnd);
    return () => {
      window.removeEventListener("keydown", onKey);
      loader?.removeEventListener("click", skip);
      loader?.removeEventListener("animationend", onEnd);
    };
  }, []);
  return skip;
}
