"use client";

// "Slow Mode" switch (docs/tasks/TASK-B14-slow-mode.md): a native checkbox with role="switch",
// visible label and state text (never colour alone). Under the OS reduced-motion preference it
// is on, disabled, and says why. Copy is provisional ([DECIDE], docs/10 §E 2).

import { useId } from "react";
import { strings } from "@/content/strings";
import { useSlowMode } from "@/hooks/use-slow-mode";
import "./slow-mode-switch.css";

export function SlowModeSwitch({ align = "start" }: { align?: "start" | "center" }) {
  const { on, forced, set } = useSlowMode();
  const id = useId();
  return (
    <div className={`flex flex-col gap-1 ${align === "center" ? "items-center text-center" : "items-start"}`}>
      <label className="type-label inline-flex min-h-11 cursor-pointer items-center gap-3 has-disabled:cursor-not-allowed">
        <input
          type="checkbox"
          role="switch"
          checked={on}
          disabled={forced}
          onChange={(event) => set(event.target.checked)}
          aria-describedby={id}
          className="slow-switch"
        />
        <span>{strings["R-SLOW-MODE"]}</span>
        <span aria-hidden="true" className="border border-current px-1.5">
          {on ? strings["R-LIGADO"] : strings["R-DESLIGADO"]}
        </span>
      </label>
      <p id={id} className="type-label max-w-[36ch] normal-case">
        {forced ? strings["R-SLOW-MODE-SISTEMA"] : strings["R-SLOW-MODE-DESC"]}
      </p>
    </div>
  );
}
