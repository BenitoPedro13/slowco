// TASK-B2-drop-chapters: one chapter per drop, horizontal rails, one-time colour flood (D2).
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "./fixtures";

const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();

const chapterC = (page: Page) => page.getByRole("region", { name: "DROP DE EXEMPLO C", exact: true });
const chapterB = (page: Page) => page.getByRole("region", { name: "DROP DE EXEMPLO B", exact: true });

test("B2 home has a chapter per drop: current first, then the one with pieces left", async ({ page }) => {
  await page.goto("/");
  await expect(chapterC(page)).toContainText("DROP ATUAL");
  await expect(chapterB(page)).toContainText("AINDA DISPONÍVEL");
  const order = await page.locator("section[data-flood-accent]").evaluateAll((s) => s.map((e) => e.getAttribute("aria-labelledby")));
  expect(order).toHaveLength(2);
  await expect(chapterC(page).getByRole("link", { name: "VER O DROP" })).toHaveAttribute("href", "/drops/drop-de-exemplo-c");
  // Drop B shows only purchasable pieces (03, 04), not the sold-out 05.
  await expect(chapterB(page).getByRole("region", { name: /Peças de/ }).getByRole("listitem")).toHaveCount(2);
});

test("B2 rail: arrows scroll one card, disable at the ends; keyboard reaches every piece; no page overflow at 320", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/");
  const rail = chapterC(page).getByRole("region", { name: "Peças de DROP DE EXEMPLO C" });
  const list = rail.getByRole("list");
  const prev = rail.getByRole("button", { name: "ANTERIOR" });
  const next = rail.getByRole("button", { name: "PRÓXIMA" });
  await rail.scrollIntoViewIfNeeded();
  await expect(prev).toBeDisabled();
  await next.click();
  await expect.poll(() => list.evaluate((el) => el.scrollLeft)).toBeGreaterThan(100);
  await expect(next).toBeDisabled();
  await expect(prev).toBeEnabled();
  const links = list.getByRole("link");
  const n = await links.count();
  for (let i = 0; i < n; i++) {
    await links.nth(i).focus();
    await expect(links.nth(i)).toBeInViewport();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test("B2/D2 flood: below-the-fold chapter waits, floods once on entry, never resets; ≤ 3 changes in 3 s", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(chapterC(page)).toHaveAttribute("data-flood", "pending");
  await page.evaluate(() => {
    (window as unknown as { floods: string[] }).floods = [];
    const mo = new MutationObserver((records) =>
      records.forEach((r) => (window as unknown as { floods: string[] }).floods.push((r.target as Element).getAttribute("data-flood") ?? "")),
    );
    document.querySelectorAll("[data-flood-accent]").forEach((el) => mo.observe(el, { attributeFilter: ["data-flood"] }));
  });
  for (let t = 0; t < 30; t++) {
    await page.mouse.wheel(0, t < 20 ? 300 : -300);
    await page.waitForTimeout(100);
  }
  await expect(chapterC(page)).toHaveAttribute("data-flood", "in");
  await expect(chapterB(page)).toHaveAttribute("data-flood", "in");
  const floods = await page.evaluate(() => (window as unknown as { floods: string[] }).floods);
  expect(floods.length).toBeLessThanOrEqual(3);
  expect(floods.every((f) => f === "in")).toBe(true);
});

test("B2/D2 reduced motion: chapters are flooded from the start, no wipe", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForTimeout(800);
  await expect(page.locator('[data-flood="pending"]')).toHaveCount(0);
  const bg = await chapterC(page).evaluate((el) => getComputedStyle(el, "::before").transitionDuration);
  expect(bg).toBe("0s");
});

for (const theme of ["preto", "branco", "drop"]) {
  test(`B2 chapters axe clean once flooded in ${theme}`, async ({ page }) => {
    await page.addInitScript((t) => {
      try {
        localStorage.setItem("slow:tema", t);
      } catch {}
    }, theme);
    await page.goto("/");
    await chapterB(page).scrollIntoViewIfNeeded();
    await expect(chapterB(page)).not.toHaveAttribute("data-flood", "pending");
    await page.waitForTimeout(1000);
    expect((await axe(page)).violations).toEqual([]);
  });
}
