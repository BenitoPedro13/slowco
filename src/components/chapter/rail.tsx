"use client";

// Horizontal rail of cards (TASK-B2): a native scroll-snap list inside a named region. The
// arrows appear only once the list is measured as overflowing (no dead buttons without JS);
// cards stay links, so the keyboard reaches every piece and snap brings it into view.

import { strings } from "@/content/strings";
import { useRail } from "@/hooks/use-rail";

const arrow =
  "type-label inline-flex min-h-11 cursor-pointer items-center border border-content px-4 disabled:cursor-not-allowed disabled:opacity-50";

export function Rail({ label, children }: { label: string; children: React.ReactNode }) {
  const { attach, onScroll, overflow, atStart, atEnd, scroll, dragHandlers } = useRail();
  return (
    <div role="region" aria-label={label} className="rail">
      <ul ref={attach} onScroll={onScroll} {...dragHandlers} data-cursor="arrastar" className="rail__list">
        {children}
      </ul>
      {overflow ? (
        <div className="rail__controls">
          <button type="button" className={arrow} disabled={atStart} onClick={(e) => scroll(-1, e.currentTarget)}>
            {strings["H-ANTERIOR"]}
          </button>
          <button type="button" className={arrow} disabled={atEnd} onClick={(e) => scroll(1, e.currentTarget)}>
            {strings["H-PROXIMA"]}
          </button>
        </div>
      ) : null}
    </div>
  );
}
