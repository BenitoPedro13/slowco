"use client";

import Link from "next/link";
import { useIsCurrentSection } from "@/hooks/use-current-path";
import type { NavItem } from "./nav-items";

export function NavLinks({
  items,
  className,
  linkClassName,
  wrapLink,
}: {
  items: NavItem[];
  className?: string;
  linkClassName?: string;
  /** Lets the menu sheet close itself when a link is followed. */
  wrapLink?: (link: React.ReactElement) => React.ReactNode;
}) {
  const isCurrent = useIsCurrentSection();
  return (
    <ul className={className}>
      {items.map((item) => {
        const link = (
          <Link
            href={item.href}
            aria-current={isCurrent(item.section) ? "page" : undefined}
            className={linkClassName}
          >
            {item.label}
          </Link>
        );
        return <li key={item.section}>{wrapLink ? wrapLink(link) : link}</li>;
      })}
    </ul>
  );
}
