// After a client-side route change, move focus to the new page's <main id="conteudo">
// (docs/04-UX-LAYOUT-AND-MOTION.md §7), so keyboard and screen-reader users start at the new
// content. Not on the first load: the skip link stays the first stop.

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function useFocusOnNavigate() {
  const path = usePathname();
  const previous = useRef(path);
  useEffect(() => {
    if (previous.current === path) return;
    previous.current = path;
    document.getElementById("conteudo")?.focus({ preventScroll: true });
  }, [path]);
}
