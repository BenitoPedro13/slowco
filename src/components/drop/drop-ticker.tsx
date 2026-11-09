"use client";

// Hero top line (docs/04 §3.1, design pass 2026-11-09): the current drop announced the way Slow
// announces on Instagram ("NOVO ITENS NA LOJA DOMINGO 24/08 ÀS 00:00H"): name, state, time left.

import Link from "next/link";
import { strings } from "@/content/strings";
import { useDropState, type DropStateInput } from "@/hooks/use-drop-state";
import { formatDropDate, splitRemaining } from "@/lib/format/date";

const pad = (n: number) => String(n).padStart(2, "0");

export function DropTicker({ name, href, ...input }: DropStateInput & { name: string; href: string }) {
  const { state, remainingMs, reducedMotion } = useDropState(input);
  const r = splitRemaining(remainingMs);
  return (
    <Link
      href={href}
      className="type-label group flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-content pb-3 underline-offset-4"
    >
      <span className="text-subtle">{strings["H-DROP-ATUAL"]}</span>
      <span className="group-hover:underline">{name}</span>
      <span aria-hidden="true">/</span>
      {state === "em-breve" ? (
        <>
          <span>{strings["D-EM-BREVE"]}</span>
          <span className="hidden sm:inline">{formatDropDate(input.releaseAt)}</span>
          <span aria-hidden="true" className="ml-auto bg-content px-2 text-canvas tabular-nums">
            {pad(r.days)}D {pad(r.hours)}H {pad(r.minutes)}M{reducedMotion ? "" : ` ${pad(r.seconds)}S`}
          </span>
        </>
      ) : (
        <span className="bg-content px-2 text-canvas">
          {state === "disponivel" ? strings["D-DISPONIVEL"] : strings["D-ESGOTADO"]}
        </span>
      )}
    </Link>
  );
}
