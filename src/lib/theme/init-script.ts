// Runs in <head> before first paint so a stored theme never flashes the default
// (docs/04-UX-LAYOUT-AND-MOTION.md §3.4), and marks the entry loader as seen for this session
// (docs/tasks/TASK-M1-entry-loader.md) so it is hidden before paint. Tiny and dependency-free.

import { THEMES, THEME_STORAGE_KEY } from "./themes";

export const ENTRY_STORAGE_KEY = "slow:entrada";

export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(${JSON.stringify(THEMES)}.indexOf(t)>-1)document.documentElement.setAttribute("data-theme",t)}catch(e){}try{var d=document.documentElement,k=${JSON.stringify(
  ENTRY_STORAGE_KEY,
)};if(sessionStorage.getItem(k)||matchMedia("(prefers-reduced-motion: reduce)").matches)d.setAttribute("data-entrada","vista");else sessionStorage.setItem(k,"1")}catch(e){document.documentElement.setAttribute("data-entrada","vista")}})();`;
