"use client";

// The chapter's <section> (TASK-B2): carries the drop accent and the one-time flood (D2).
// Children are rendered on the server.

import { useFlood } from "@/hooks/use-flood";
import type { DropAccent } from "@/lib/theme/themes";

export function FloodSection({
  accent,
  labelledBy,
  layer,
  children,
}: {
  accent: DropAccent;
  labelledBy: string;
  /** Stacking order: earlier chapters sit above later ones, so each torn edge overlaps the next. */
  layer: number;
  children: React.ReactNode;
}) {
  const ref = useFlood();
  return (
    <section ref={ref} aria-labelledby={labelledBy} data-flood-accent={accent} className="chapter" style={{ zIndex: layer }}>
      {children}
    </section>
  );
}
