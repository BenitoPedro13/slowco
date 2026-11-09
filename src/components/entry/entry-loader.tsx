// Entry loader (docs/tasks/TASK-M1-entry-loader.md). Server-rendered and timed by CSS only, so
// it ends even without JS and the page underneath is already there. The skip control is a tiny
// client leaf. Hidden before paint on repeat visits and under reduced motion
// (html[data-entrada=vista], set by the head init script).

import Image from "next/image";
import { strings } from "@/content/strings";
import { EntrySkip } from "./entry-skip";
import "./entry-loader.css";

export function EntryLoader({ photos }: { photos: { src: string }[] }) {
  if (photos.length === 0) return null;
  return (
    <div className="entry-loader" data-testid="entrada">
      <div className="entry-loader__stack" aria-hidden="true">
        {photos.slice(0, 5).map((p, i) => (
          <div key={p.src} className="entry-loader__card" style={{ "--i": i } as React.CSSProperties}>
            <Image src={p.src} alt="" fill sizes="(min-width: 1024px) 22vw, 48vw" priority={i < 2} className="object-cover" />
          </div>
        ))}
      </div>
      <p aria-hidden="true" className="entry-loader__word type-wordmark" data-standin="wordmark">
        {strings["G-WORDMARK"]}
      </p>
      <p aria-hidden="true" className="entry-loader__count type-label" />
      <EntrySkip />
    </div>
  );
}
