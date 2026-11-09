// Home hero (docs/04-UX-LAYOUT-AND-MOTION.md §3.1–§3.2). Server Component, no client code: the
// theme switch moved to the site header in T4.
//
// STAND-IN: the giant "SLOW" is Archivo 900 italic at wdth 125 (docs/02-VISUAL-IDENTITY.md
// §2.3), text, not a drawing of the client's wordmark. Replace with the client's SVG when
// docs/08-OPEN-INPUTS.md #2 arrives.

import { INSTAGRAM_URL, strings } from "@/content/strings";
import Image from "next/image";
import { DropTicker } from "@/components/drop/drop-ticker";
import type { DropStateInput } from "@/hooks/use-drop-state";
import "./hero.css";

const LETTERS = [...strings["G-WORDMARK"]];

export function Hero({
  drop,
  photo,
}: {
  drop: (DropStateInput & { name: string; href: string }) | null;
  /** Campaign photo filling the space above the wordmark, like a poster (design pass). */
  photo: { src: string; alt: string } | null;
}) {
  return (
    <section className="flex overflow-x-clip min-h-[max(504px,calc(100svh-3.5rem))] flex-col justify-between gap-6 px-4 lg:gap-8 py-4 sm:px-6 lg:min-h-[max(504px,calc(100svh-4rem))] lg:px-10 lg:py-6">
      {drop ? <DropTicker {...drop} /> : <span />}

      {photo ? (
        <div className="relative min-h-[240px] flex-1 lg:min-h-[50svh]">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_15%]"
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-6 lg:gap-8">
        <div className="@container">
          <h1>
            <span
              aria-hidden="true"
              data-standin="wordmark"
              className="type-wordmark block text-[25.5cqi] whitespace-nowrap"
            >
              {LETTERS.map((letter, i) => (
                <span key={i} className="hero-letter-clip">
                  <span className="hero-letter" style={{ "--i": i } as React.CSSProperties}>
                    {letter}
                  </span>
                </span>
              ))}
            </span>
            <span className="sr-only">{strings["H-H1"]}</span>
          </h1>
        </div>

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            {/* The garments' own woven-label lines (00 §A), set as a label. */}
            <div className="type-label inline-flex max-w-[44ch] flex-col gap-1 self-start border border-content bg-canvas px-3 py-2">
              <p lang="en">{strings["G-LEGAL-1"]}</p>
              <p lang="en" className="border-t border-content pt-1">
                {strings["G-LEGAL-2"]}
              </p>
            </div>
            <p className="type-label">{strings["H-LINHA"]}</p>
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={strings["G-INSTAGRAM-ARIA"]}
            className="type-label inline-flex min-h-6 items-center self-start underline decoration-1 underline-offset-4 hover:decoration-2 sm:self-auto"
          >
            {strings["G-INSTAGRAM"]}
            <span aria-hidden="true">&nbsp;↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
