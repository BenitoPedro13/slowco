"use client";

// Marquee band (docs/tasks/TASK-M6-cursor-marquee.md, B11 in TASK-B11-B15-B20). CSS loop; paused
// on hover, by the toggle (2.2.2) and entirely still under reduced motion. The moving copies carry
// the live drop line and count and are aria-hidden (the same facts are text in the hero ticker
// and the drop section); the one hidden copy read aloud is the brand line only, so the
// once-a-second countdown never reaches a screen reader.

import { useState } from "react";
import { strings } from "@/content/strings";
import { useMarqueeLine, type MarqueeInput } from "@/hooks/use-marquee-line";
import { usePausedBySlowMode } from "@/hooks/use-slow-mode";
import "./marquee.css";

export function Marquee(input: MarqueeInput) {
  // null until the visitor presses the button: until then Slow Mode decides (TASK-B14).
  const [override, setOverride] = useState<boolean | null>(null);
  const paused = usePausedBySlowMode(override);
  const line = useMarqueeLine(input);
  return (
    <div className="marquee border-y border-content" data-paused={paused}>
      <p className="sr-only">{line.brand}</p>
      <div className="marquee__track" aria-hidden="true">
        {/* Two copies: each is wider than a 2560px viewport, and -50% loops one copy. */}
        {[0, 1].map((i) => (
          <span key={i} className="marquee__item">
            {line.drop ? (
              <>
                {line.drop.label} / {line.drop.state}
                {line.drop.countdown ? (
                  <>
                    {" "}
                    <span data-contagem className="tabular-nums">
                      {line.drop.countdown}
                    </span>
                  </>
                ) : null}{" "}
                /{" "}
              </>
            ) : null}
            {line.available ? <>{line.available} / </> : null}
            {line.brand}&nbsp;
          </span>
        ))}
      </div>
      <button
        type="button"
        aria-pressed={paused}
        onClick={() => setOverride(!paused)}
        className="marquee__toggle type-label"
      >
        {paused ? strings["M-RODAR-FAIXA"] : strings["M-PAUSAR-FAIXA"]}
      </button>
    </div>
  );
}
