import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

type SiteShellProps = {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
};

export function SiteShell({
  children,
  showHeader = true,
  showFooter = true,
}: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {showHeader ? <SiteHeader /> : null}
      <main className="flex-1">{children}</main>
      {showFooter ? <SiteFooter /> : null}
    </div>
  );
}
