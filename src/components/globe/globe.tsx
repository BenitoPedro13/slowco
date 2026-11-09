"use client";

// Wireframe globe stand-in (docs/tasks/TASK-M4-globe.md, 08 #23). Decorative: aria-hidden canvas;
// the pause toggle is the only control and is hidden when nothing moves (reduced motion).

import { strings } from "@/content/strings";
import { useGlobe } from "@/hooks/use-globe";

export function Globe({ className = "" }: { className?: string }) {
  const { canvasRef, reduced, paused, toggle } = useGlobe();
  return (
    <div className={`flex flex-col items-start gap-3 ${className}`}>
      <canvas ref={canvasRef} aria-hidden="true" data-standin="globo" className="aspect-square w-full" />
      {reduced ? null : (
        <button
          type="button"
          aria-pressed={paused}
          onClick={toggle}
          className="type-label inline-flex min-h-11 cursor-pointer items-center border border-content px-4 underline-offset-4 hover:underline"
        >
          {paused ? strings["M-GIRAR-GLOBO"] : strings["M-PAUSAR-GLOBO"]}
        </button>
      )}
    </div>
  );
}
