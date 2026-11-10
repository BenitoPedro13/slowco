// TASK-B14-slow-mode: site-level "Slow Mode" motion switch.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "./fixtures";

const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
const footerSwitch = (page: Page) => page.getByRole("contentinfo").getByRole("switch", { name: /SLOW MODE/ });

test("B14 footer switch slows motion, persists before paint, starts marquee and globe paused", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).not.toHaveAttribute("data-motion", "slow");
  await expect(page.locator(".marquee__track")).toHaveCSS("animation-duration", "40s");
  await footerSwitch(page).check();
  await expect(footerSwitch(page)).toBeChecked();
  await expect(html).toHaveAttribute("data-motion", "slow");
  expect(await page.evaluate(() => localStorage.getItem("slow:modo"))).toBe("1");

  await page.reload();
  // Applied by the init script, before hydration.
  expect(await page.evaluate(() => document.documentElement.dataset.motion)).toBe("slow");
  await expect(page.locator(".marquee__track")).toHaveCSS("animation-duration", "80s");
  await expect(page.locator(".marquee__track")).toHaveCSS("animation-play-state", "paused");
  await expect(page.getByRole("button", { name: "RODAR FAIXA" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "GIRAR GLOBO" })).toBeVisible();
  // Still resumable by the visitor.
  await page.getByRole("button", { name: "RODAR FAIXA" }).click();
  await page.mouse.move(0, 0);
  await expect(page.locator(".marquee__track")).toHaveCSS("animation-play-state", "running");

  await footerSwitch(page).uncheck();
  await expect(html).not.toHaveAttribute("data-motion", "slow");
  expect(await page.evaluate(() => localStorage.getItem("slow:modo"))).toBeNull();
});

test("B14 mobile menu has the same switch, sharing the state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contato");
  await page.getByRole("button", { name: "MENU" }).click();
  const dialog = page.getByRole("dialog");
  const sw = dialog.getByRole("switch", { name: /SLOW MODE/ });
  await expect(sw).not.toBeChecked();
  await sw.check();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "slow");
  await expect(dialog).toContainText("LIGADO");
  await expect(dialog).not.toContainText("DESLIGADO");
  await page.keyboard.press("Escape");
  await expect(footerSwitch(page)).toBeChecked();
});

test("B14 reduced motion: switch is on, disabled and explained", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/contato");
  await expect(footerSwitch(page)).toBeChecked();
  await expect(footerSwitch(page)).toBeDisabled();
  await expect(page.getByRole("contentinfo")).toContainText("Ligado pelo seu sistema");
});

for (const theme of ["preto", "branco", "drop"]) {
  test(`B14 switch axe clean in ${theme}`, async ({ page }) => {
    await page.addInitScript((t) => {
      try {
        localStorage.setItem("slow:tema", t);
      } catch {}
    }, theme);
    await page.goto("/contato");
    await footerSwitch(page).check();
    expect((await axe(page)).violations).toEqual([]);
  });
}
