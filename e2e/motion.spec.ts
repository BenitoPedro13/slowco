// T9 acceptance: custom cursor and page transitions (docs/04 §6, §7, 07 T9).
import { expect, test } from "./fixtures";

test("1. cursor: present and aria-hidden with a fine pointer, follows the mouse", async ({ page }) => {
  await page.goto("/arquivo");
  const cursor = page.locator(".custom-cursor");
  await expect(cursor).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator("html")).toHaveClass(/has-custom-cursor/);
  await page.mouse.move(200, 300);
  await expect(cursor).toHaveAttribute("data-visible", "true");
  await page.getByRole("link", { name: "ARQUIVO" }).first().hover();
  await expect(cursor).toHaveAttribute("data-mode", "ring");
});

test("2. cursor: absent under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/arquivo");
  await expect(page.locator(".custom-cursor")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/has-custom-cursor/);
});

test("3. cursor: absent on touch (hover: none)", async ({ browser }) => {
  const ctx = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 800 } });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3100/arquivo");
  await expect(page.locator(".custom-cursor")).toHaveCount(0);
  await ctx.close();
});

async function recordPageReveals(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __reveals: number };
    w.__reveals = 0;
    const original = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      if (this.id === "conteudo") w.__reveals++;
      return original.apply(this, args);
    };
  });
}

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`4–5. page reveal and focus (${reducedMotion})`, async ({ page }) => {
    await recordPageReveals(page);
    await page.emulateMedia({ reducedMotion });
    await page.goto("/");
    await expect(page.getByRole("group", { name: "Tema" })).toContainText(/Preto/);
    await page.getByRole("navigation").getByRole("link", { name: "ARQUIVO", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("ARQUIVO");
    await expect(page.locator("main#conteudo")).toBeFocused();
    expect(await page.evaluate(() => (window as unknown as { __reveals: number }).__reveals))
      .toBe(reducedMotion === "reduce" ? 0 : 1);
    await expect.poll(() => page.locator("main#conteudo").evaluate(el => el.getAnimations().length)).toBe(0);
  });
}

test("6. navigation survives the browser's hidden-document snapshot rejection", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  // Deterministic reproduction of Chromium's rejection when a tab hides mid-transition.
  await page.addInitScript(() => {
    document.startViewTransition = ((options: ViewTransitionUpdateCallback | StartViewTransitionOptions) => {
      const update = typeof options === "function" ? options : options.update;
      const done = Promise.resolve().then(() => update?.());
      return {
        ready: Promise.reject(new DOMException("Transition was aborted because of invalid state. Document hidden", "InvalidStateError")),
        updateCallbackDone: done, finished: done, skipTransition() {}, types: new Set(),
      };
    }) as typeof document.startViewTransition;
  });
  await page.goto("/");
  await expect(page.getByRole("group", { name: "Tema" })).toContainText(/Preto/);
  await page.getByRole("navigation").getByRole("link", { name: "ARQUIVO", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ARQUIVO");
  await expect(page.locator("main#conteudo")).toBeFocused();
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});

test("7. hidden tabs skip page reveals and hiding a tab cancels a running reveal", async ({ page }) => {
  await recordPageReveals(page);
  await page.addInitScript(() => {
    const original = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      const animation = original.apply(this, args);
      // Hold the reveal so the visibility event deterministically occurs mid-animation.
      if (this.id === "conteudo") animation.pause();
      return animation;
    };
  });
  await page.goto("/");
  await expect(page.getByRole("group", { name: "Tema" })).toContainText(/Preto/);
  await page.evaluate(() => Object.defineProperty(document, "hidden", { configurable: true, value: true }));
  await page.getByRole("navigation").getByRole("link", { name: "ARQUIVO", exact: true }).click();
  await expect(page.locator("main#conteudo")).toBeFocused();
  expect(await page.evaluate(() => (window as unknown as { __reveals: number }).__reveals)).toBe(0);
  await page.evaluate(() => Object.defineProperty(document, "hidden", { configurable: true, value: false }));
  await page.getByRole("navigation").getByRole("link", { name: "CONTATO", exact: true }).click();
  await expect(page.locator("main#conteudo")).toBeFocused();
  await expect.poll(() => page.locator("main#conteudo").evaluate(el => el.getAnimations().length)).toBe(1);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect.poll(() => page.locator("main#conteudo").evaluate(el => el.getAnimations().length)).toBe(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
