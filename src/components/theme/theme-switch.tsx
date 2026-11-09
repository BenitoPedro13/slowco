"use client";

// Theme switch (docs/04-UX-LAYOUT-AND-MOTION.md §3.3): a native radio group, so keyboard
// behaviour (Tab in, arrows move and select) comes from the browser. Each swatch renders inside
// its own data-theme, so it shows that theme's canvas with that theme's content as its border.

import { useThemeSwitch } from "@/hooks/use-theme-switch";
import { strings } from "@/content/strings";
import { THEMES, type DropAccent, type Theme } from "@/lib/theme/themes";

const LABELS: Record<Theme, string> = {
  preto: strings["G-TEMA-PRETO"],
  branco: strings["G-TEMA-BRANCO"],
  drop: strings["G-TEMA-DROP"],
};

export function ThemeSwitch({ accent }: { accent: DropAccent }) {
  const { theme, select, wipeRef } = useThemeSwitch();

  return (
    <>
      <fieldset className="flex items-center gap-1">
        <legend className="sr-only">{strings["G-TEMA"]}</legend>
        <span aria-hidden="true" className="type-label mr-2 hidden min-w-[11ch] text-right lg:block">
          {theme ? LABELS[theme] : ""}
        </span>
        {THEMES.map((t) => (
          <label
            key={t}
            className="grid size-8 cursor-pointer place-items-center rounded-full has-checked:ring-2 has-checked:ring-content has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-content"
          >
            <input
              type="radio"
              name="tema"
              value={t}
              checked={theme === t}
              onChange={() => select(t)}
              aria-label={LABELS[t]}
              data-theme={t}
              data-drop-accent={accent}
              className="size-6 cursor-pointer appearance-none rounded-full border border-content bg-canvas transition-transform duration-(--dur-hover) hover:scale-115 focus-visible:outline-none motion-reduce:transition-none"
            />
          </label>
        ))}
      </fieldset>
      <div
        ref={wipeRef}
        aria-hidden="true"
        data-theme="preto"
        data-drop-accent={accent}
        data-testid="theme-wipe"
        className="pointer-events-none fixed inset-0 z-50 bg-canvas [clip-path:inset(100%_0_0_0)]"
      />
    </>
  );
}
