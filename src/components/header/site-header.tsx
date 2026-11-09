// Site header (docs/04-UX-LAYOUT-AND-MOTION.md §2.1). Server Component; the switch, the counter,
// the nav (aria-current) and the menu sheet are client leaves.
//
// STAND-IN wordmark, as in the hero (08 #2).

import Link from "next/link";
import { BagCounter } from "@/components/bag/bag-counter";
import { ThemeSwitch } from "@/components/theme/theme-switch";
import { strings } from "@/content/strings";
import type { DropAccent } from "@/lib/theme/themes";
import { MenuSheet } from "./menu-sheet";
import { navItems } from "./nav-items";
import { NavLinks } from "./nav-links";

export function SiteHeader({
  accent,
  currentDropSlug,
}: {
  accent: DropAccent;
  currentDropSlug: string | null;
}) {
  const items = navItems(currentDropSlug);
  return (
    <header className="sticky top-0 z-30 border-b border-content bg-canvas text-content">
      <div className="flex h-14 items-center gap-3 px-4 sm:gap-6 sm:px-6 lg:h-16 lg:px-10">
        <Link href="/" className="inline-flex min-h-11 items-center">
          <span aria-hidden="true" data-standin="wordmark" className="type-wordmark text-[22px] lg:text-[26px]">
            {strings["G-WORDMARK"]}
          </span>
          <span className="sr-only">{strings["G-NOME"]}</span>
        </Link>
        <nav aria-label={strings["G-NAV"]} className="hidden sm:block">
          <NavLinks
            items={items}
            className="flex items-center gap-4 lg:gap-6"
            linkClassName="type-label inline-flex min-h-11 items-center underline-offset-4 hover:underline aria-[current=page]:underline aria-[current=page]:decoration-2"
          />
        </nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block">
            <ThemeSwitch accent={accent} />
          </div>
          <BagCounter />
          <div className="sm:hidden">
            <MenuSheet items={items} accent={accent} />
          </div>
        </div>
      </div>
    </header>
  );
}
