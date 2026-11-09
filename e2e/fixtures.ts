// Shared fixture: the entry loader (TASK-M1) is marked as seen so specs about other features
// start on the page itself. The loader has its own spec (e2e/moments.spec.ts).
import { test as base } from "@playwright/test";

export const test = base.extend({
  context: async ({ context }, provide) => {
    await context.addInitScript(() => {
      try {
        sessionStorage.setItem("slow:entrada", "1");
      } catch {}
    });
    await provide(context);
  },
});

export { expect, type Page } from "@playwright/test";
