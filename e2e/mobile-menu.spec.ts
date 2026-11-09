import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

test.use({ isMobile: true, hasTouch: true, viewport: { width: 390, height: 780 } });

for (const width of [320, 390]) {
  test(`mobile header at ${width}: visible bag label, one-line notice, touch targets`, async ({ page }) => {
    await page.setViewportSize({ width, height: 780 });
    await page.goto("/");
    const bag = page.getByRole("link", { name: "Sacola vazia" });
    await expect(bag.getByText("SACOLA", { exact: true })).toBeVisible();
    const note = page.getByRole("note");
    const metrics = await note.evaluate((el) => {
      const style = getComputedStyle(el);
      return { font: parseFloat(style.fontSize), line: parseFloat(style.lineHeight),
        height: el.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) };
    });
    expect(metrics.font).toBeGreaterThanOrEqual(12);
    expect(metrics.height).toBeLessThanOrEqual(metrics.line + 1);
    for (const target of [bag, page.getByRole("button", { name: "MENU", exact: true })]) {
      const box = await target.boundingBox();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`touch menu: theme, focus, close and persistence (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto("/");
    await page.waitForTimeout(3500); // Exact A1 reproduction: stored entry flag and 3.5 s wait.
    await expect(page.locator("html")).toHaveAttribute("data-entrada", "vista");
    await expect(page.getByTestId("entrada")).toBeHidden();
    await expect(page.locator(".custom-cursor")).toHaveCount(0);
    const trigger = page.getByRole("button", { name: "MENU", exact: true });
    expect(await trigger.evaluate(el => {
      const r = el.getBoundingClientRect();
      return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
    })).toBe(true);
    await trigger.tap();
    const dialog = page.getByRole("dialog", { name: "MENU", exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("radio", { name: "Preto", exact: true })).toBeChecked();
    for (const radio of await dialog.getByRole("radio").all()) {
      const box = await radio.locator("..").boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    for (const [label, theme] of [["Branco", "branco"], ["Cor do drop", "drop"]]) {
      await dialog.getByRole("radio", { name: label, exact: true }).tap();
      if (reducedMotion === "no-preference") {
        await expect.poll(() => dialog.getByTestId("theme-wipe").evaluate(el => el.getAnimations().length)).toBeGreaterThan(0);
      }
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(dialog.getByRole("radio", { name: label, exact: true })).toBeChecked();
      await expect.poll(() => dialog.getByTestId("theme-wipe").evaluate(el => el.getAnimations().length)).toBe(0);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      expect(results.violations).toEqual([]);
    }
    await dialog.getByRole("button", { name: "FECHAR" }).focus();
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("radio", { name: "Cor do drop", exact: true })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("button", { name: "FECHAR" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => localStorage.getItem("slow:tema"))).toBe("drop");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "drop");
    await trigger.tap();
    await expect(dialog.getByRole("radio", { name: "Cor do drop", exact: true })).toBeChecked();
    await dialog.getByRole("button", { name: "FECHAR" }).tap();
    await expect(dialog).toBeHidden();
    await trigger.tap();
    await dialog.getByRole("link", { name: "ARQUIVO", exact: true }).tap();
    await expect(page).toHaveURL(/\/arquivo$/);
    await expect(dialog).toBeHidden();
    await trigger.tap();
    await expect(dialog).toBeVisible();
  });
}

test("fresh touch visit: loader finishes and the menu receives taps", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ isMobile: true, hasTouch: true, viewport: { width: 390, height: 780 } });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    await expect(page.getByTestId("entrada")).toBeHidden({ timeout: 4000 });
    await page.getByRole("button", { name: "MENU", exact: true }).tap();
    await expect(page.getByRole("dialog", { name: "MENU" })).toBeVisible();
  } finally {
    await context.close();
  }
});
