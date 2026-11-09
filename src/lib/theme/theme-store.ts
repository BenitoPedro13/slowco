// The theme lives in the DOM (<html data-theme>) and in localStorage: an external system.
// React reads it through useSyncExternalStore (docs/06-ARCHITECTURE.md §6). Safe to import on
// the server: `document`/`window` are only touched inside the functions.

import { THEME_STORAGE_KEY, isTheme, type Theme } from "./themes";

const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key !== THEME_STORAGE_KEY || !isTheme(event.newValue)) return;
  // Another tab changed the theme: follow it without a wipe (04 §3.4).
  document.documentElement.dataset.theme = event.newValue;
  notify();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function getSnapshot(): Theme | null {
  const value = document.documentElement.dataset.theme;
  return isTheme(value) ? value : null;
}

export function getServerSnapshot(): Theme | null {
  return null;
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage blocked (private mode): the theme still applies for this visit (04 §3.6).
  }
  notify();
}
