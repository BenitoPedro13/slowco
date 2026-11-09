"use client";

// Drop mode (docs/04-UX-LAYOUT-AND-MOTION.md §5): state label, absolute date (the source of
// truth), and a countdown that can be paused (WCAG 2.2.2). The digits are aria-hidden; screen
// readers get a sentence that changes once a minute, not every second.

import { useState } from "react";
import { fill } from "@/content/fill";
import { strings } from "@/content/strings";
import { useDropState, type DropStateInput } from "@/hooks/use-drop-state";
import { formatDropDate, splitRemaining } from "@/lib/format/date";

const pad = (n: number) => String(n).padStart(2, "0");

export function DropStatus({ size = "xl", ...input }: DropStateInput & { size?: "xl" | "md" }) {
  const { state, remainingMs, reducedMotion } = useDropState(input);
  const [frozenMs, setFrozenMs] = useState<number | null>(null);

  const big =
    size === "xl"
      ? "font-display text-[clamp(56px,12vw,192px)] leading-[0.85] font-extrabold [font-stretch:62%] tabular-nums"
      : "font-display text-[clamp(40px,7vw,96px)] leading-[0.9] font-extrabold [font-stretch:62%] tabular-nums";

  if (state !== "em-breve") {
    return (
      <p className={big} data-drop-state={state}>
        {state === "disponivel" ? strings["D-DISPONIVEL"] : strings["D-ESGOTADO"]}
      </p>
    );
  }

  const shown = splitRemaining(frozenMs ?? remainingMs);
  const spoken = splitRemaining(remainingMs);
  const paused = frozenMs !== null;

  return (
    <div className="flex flex-col gap-4" data-drop-state="em-breve" data-release-at={input.releaseAt}>
      <p className="type-label">
        {strings["D-EM-BREVE"]} / <time dateTime={input.releaseAt}>{formatDropDate(input.releaseAt)}</time>
      </p>
      <p className={big}>
        <span aria-hidden="true" data-testid="contagem">
          {pad(shown.days)}:{pad(shown.hours)}:{pad(shown.minutes)}
          {reducedMotion ? null : `:${pad(shown.seconds)}`}
        </span>
        <span className="sr-only">
          {fill(strings["D-CONTAGEM-ARIA"], { d: spoken.days, h: spoken.hours, m: spoken.minutes })}
        </span>
      </p>
      <button
        type="button"
        aria-pressed={paused}
        onClick={() => setFrozenMs(paused ? null : remainingMs)}
        className="type-label inline-flex min-h-11 cursor-pointer items-center self-start border border-content px-4 underline-offset-4 hover:underline"
      >
        {paused ? strings["D-RETOMAR"] : strings["D-PAUSAR"]}
      </button>
    </div>
  );
}
