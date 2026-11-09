// Theme constants (docs/04-UX-LAYOUT-AND-MOTION.md §3, docs/02-VISUAL-IDENTITY.md §3.2, §7).

export const THEMES = ["preto", "branco", "drop"] as const;
export type Theme = (typeof THEMES)[number];

export const DROP_ACCENTS = ["vermelho", "roxo", "azul", "verde"] as const;
export type DropAccent = (typeof DROP_ACCENTS)[number];

export const DEFAULT_THEME: Theme = "preto";
export const THEME_STORAGE_KEY = "slow:tema";

// Provisional (docs/08-OPEN-INPUTS.md #17): replaced by getCurrentDrop().accent in T3.
export const CURRENT_DROP_ACCENT: DropAccent = "vermelho";

// Flash safety (04 §3.5): at least this long between two applied theme changes, any mode.
export const THEME_MIN_INTERVAL_MS = 600;
// One half of the wipe (02 §7 --dur-wipe); keep in sync with tokens.css.
export const WIPE_HALF_MS = 280;
export const WIPE_EASING = "cubic-bezier(0.76, 0, 0.24, 1)";

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}
