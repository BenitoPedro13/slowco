import { strings } from "@/content/strings";

export type NavItem = { href: string; label: string; section: string };

/** DROPS goes to the current drop; without drops it falls back to the archive. */
export function navItems(currentDropSlug: string | null): NavItem[] {
  return [
    {
      href: currentDropSlug ? `/drops/${currentDropSlug}` : "/arquivo",
      label: strings["G-NAV-DROPS"],
      section: "/drops",
    },
    { href: "/arquivo", label: strings["G-NAV-ARQUIVO"], section: "/arquivo" },
    { href: "/contato", label: strings["G-NAV-CONTATO"], section: "/contato" },
  ];
}
