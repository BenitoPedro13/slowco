// "Slow Mode" (docs/tasks/TASK-B14-slow-mode.md) lives in the DOM (<html data-motion="slow">) and
// in localStorage, like the theme (src/lib/theme/theme-store.ts). The init script applies it
// before first paint. Safe to import on the server: the DOM is only touched inside functions.

export const MOTION_STORAGE_KEY = "slow:modo";
/** Duration multiplier while Slow Mode is on (also `--motion-scale` in tokens.css). */
export const SLOW_SCALE = 2;

const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key !== MOTION_STORAGE_KEY) return;
  setAttribute(event.newValue === "1");
  notify();
}

function setAttribute(on: boolean) {
  if (on) document.documentElement.dataset.motion = "slow";
  else delete document.documentElement.dataset.motion;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function getSnapshot(): boolean {
  return document.documentElement.dataset.motion === "slow";
}

export function getServerSnapshot(): boolean {
  return false;
}

export function applySlowMode(on: boolean) {
  setAttribute(on);
  try {
    if (on) window.localStorage.setItem(MOTION_STORAGE_KEY, "1");
    else window.localStorage.removeItem(MOTION_STORAGE_KEY);
  } catch {
    // Storage blocked: applies for this visit only.
  }
  notify();
}

/** Current duration multiplier, for motion run from JS (theme wipe, page reveal, globe). */
export function motionScale(): number {
  return typeof document !== "undefined" && getSnapshot() ? SLOW_SCALE : 1;
}
