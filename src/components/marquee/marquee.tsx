"use client";

// Marquee band (docs/tasks/TASK-M6-cursor-marquee.md). CSS loop; paused on hover, by the toggle
// (2.2.2) and entirely still under reduced motion. Moving copies are aria-hidden; one hidden copy
// is read.

import { useState } from "react";
import { strings } from "@/content/strings";
import "./marquee.css";

export function Marquee() {
  const [paused, setPaused] = useState(false);
  const text = strings["M-FAIXA"];
  return (
    <div className="marquee border-y border-content" data-paused={paused}>
      <p className="sr-only">{text}</p>
      <div className="marquee__track" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="marquee__item">
            {text}&nbsp;
          </span>
        ))}
      </div>
      <button
        type="button"
        aria-pressed={paused}
        onClick={() => setPaused((p) => !p)}
        className="marquee__toggle type-label"
      >
        {paused ? strings["M-RODAR-FAIXA"] : strings["M-PAUSAR-FAIXA"]}
      </button>
    </div>
  );
}
