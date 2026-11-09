// Design moments M1–M6 (docs/tasks/TASK-M*.md).
import { expect, test } from "@playwright/test";

const loader = "[data-testid=entrada]";

test("M1. loader: first visit only, Escape skips, not replayed in the session", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(loader)).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1); // content already there
  await page.keyboard.press("Escape");
  await expect(page.locator("html")).toHaveAttribute("data-entrada", "vista");
  await expect(page.locator(loader)).toBeHidden();
  await page.reload();
  await expect(page.locator(loader)).toBeHidden();
});

test("M1. loader: PULAR button skips; otherwise it ends by itself", async ({ page, browser }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "PULAR" }).click();
  await expect(page.locator(loader)).toBeHidden();
  const other = await browser.newPage();
  await other.goto("http://localhost:3100/");
  await expect(other.locator(loader)).toBeHidden({ timeout: 4000 });
  await other.close();
});

test("M1. loader: never under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(loader)).toBeHidden();
});

test("M2. wordmark breakup is scroll-linked and off under reduced motion", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Escape");
  const name = () =>
    page.evaluate(() => getComputedStyle(document.querySelector(".hero-letter-clip")!).animationName);
  expect(await name()).toBe("hero-quebra");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await name()).toBe("none");
});

test("M3. duotone on editorial photos, never on product photos", async ({ page }) => {
  await page.goto("/contato");
  const tinted = page.locator(".duotone img").first();
  await expect(tinted).toHaveCSS("filter", /grayscale/);
  await page.goto("/produtos/peca-de-exemplo-04");
  for (const img of await page.locator("main img").all()) {
    await expect(img).toHaveCSS("filter", "none");
  }
});

test("M4. globe: decorative canvas with a pause toggle; still under reduced motion", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Escape");
  await expect(page.locator("canvas[data-standin=globo]")).toHaveAttribute("aria-hidden", "true");
  const toggle = page.getByRole("button", { name: "PAUSAR GLOBO" });
  await toggle.click();
  await expect(page.getByRole("button", { name: "GIRAR GLOBO" })).toHaveAttribute("aria-pressed", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("button", { name: /GLOBO/ })).toHaveCount(0);
});

test("M6. marquee: pause toggle stops it; still under reduced motion", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Escape");
  const track = page.locator(".marquee__track");
  await expect(track).toHaveCSS("animation-name", "marquee-roda");
  await page.getByRole("button", { name: "PAUSAR FAIXA" }).click();
  await page.mouse.move(0, 0);
  await expect(track).toHaveCSS("animation-play-state", "paused");
  await expect(page.locator(".marquee .sr-only")).toHaveText(/SLOW MODE/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(track).toHaveCSS("animation-name", "none");
  await expect(page.getByRole("button", { name: /FAIXA/ })).toBeHidden();
});
