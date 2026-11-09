// Which nav item is the current page (aria-current, docs/04-UX-LAYOUT-AND-MOTION.md §2.1).

import { usePathname } from "next/navigation";

export function useIsCurrentSection() {
  const path = usePathname();
  return (prefix: string) => path === prefix || path.startsWith(`${prefix}/`);
}
