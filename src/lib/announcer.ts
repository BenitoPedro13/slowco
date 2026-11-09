// One polite live region for the whole site (docs/04-UX-LAYOUT-AND-MOTION.md §4): an external
// store so announcing never re-renders the components that announce.

export type Announcer = ReturnType<typeof createAnnouncer>;

export function createAnnouncer() {
  let message = "";
  let timer: ReturnType<typeof setTimeout> | undefined;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => message,
    getServerSnapshot: () => "",
    /** Clears first, so the same sentence twice in a row is still read out. */
    announce(next: string) {
      clearTimeout(timer);
      message = "";
      emit();
      timer = setTimeout(() => {
        message = next;
        emit();
      }, 60);
    },
  };
}
