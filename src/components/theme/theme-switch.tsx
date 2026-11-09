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

export function ThemeSwitch({
  accent,
  name = "tema",
  labeled = false,
}: {
  accent: DropAccent;
  /** Radio group name: two switches on one page need different names. */
  name?: string;
  /** Menu variant: each swatch carries its visible text label (no unlabeled colour dots). */
  labeled?: boolean;
}) {
  const { theme, select, wipeRef } = useThemeSwitch();

  return (
    <>
      <fieldset className={labeled ? "flex flex-col gap-3" : "flex items-center gap-1"}>
        <legend className={labeled ? "type-label mb-3" : "sr-only"}>{strings["G-TEMA"]}</legend>
        {labeled ? null : (
          <span aria-hidden="true" className="type-label mr-2 hidden min-w-[11ch] text-right lg:block">
            {theme ? LABELS[theme] : ""}
          </span>
        )}
        {THEMES.map((t) => (
          <label
            key={t}
            className={
              labeled
                ? "type-label flex min-h-11 cursor-pointer items-center gap-3 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-content"
                : "grid size-8 cursor-pointer place-items-center rounded-full has-checked:ring-2 has-checked:ring-content has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-content"
            }
          >
            <input
              type="radio"
              name={name}
              value={t}
              checked={theme === t}
              onChange={() => select(t)}
              aria-label={LABELS[t]}
              data-theme={t}
              data-drop-accent={accent}
              className={`size-6 shrink-0 cursor-pointer appearance-none rounded-full border border-content bg-canvas transition-transform duration-(--dur-hover) hover:scale-115 focus-visible:outline-none motion-reduce:transition-none${labeled ? " checked:ring-2 checked:ring-content checked:ring-offset-2 checked:ring-offset-[var(--menu-bg,transparent)]" : ""}`}
            />
            {labeled ? <span>{LABELS[t]}</span> : null}
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
