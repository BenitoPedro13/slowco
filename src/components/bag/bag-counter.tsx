"use client";

// Header bag counter (docs/04-UX-LAYOUT-AND-MOTION.md §4): two rolling digits, aria-hidden;
// the link's accessible name (visually hidden text, not aria-label, so the visible "SACOLA" is
// never contradicted, 2.5.3) carries the true count.

import Link from "next/link";
import { bagLabel, useBagCount } from "@/hooks/use-bag";
import { strings } from "@/content/strings";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function Digit({ value }: { value: number }) {
  return (
    <span className="inline-block h-[1.3em] overflow-hidden align-bottom">
      <span
        className="flex flex-col transition-transform duration-(--dur-count) ease-(--ease-out) motion-reduce:transition-none"
        style={{ transform: `translateY(${-1.3 * value}em)` }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="block h-[1.3em]">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

export function BagCounter() {
  const count = useBagCount();
  const shown = Math.min(count, 99);
  return (
    <Link
      href="/sacola"
      data-count={count}
      className="type-label inline-flex min-h-11 items-center gap-2 px-1 underline-offset-4 hover:underline aria-[current=page]:underline"
    >
      <span className="sr-only">{bagLabel(count)}</span>
      <span aria-hidden="true">
        {strings["G-SACOLA"]}
      </span>
      <span aria-hidden="true" className="inline-flex border border-content px-1">
        <Digit value={Math.floor(shown / 10)} />
        <Digit value={shown % 10} />
      </span>
    </Link>
  );
}
