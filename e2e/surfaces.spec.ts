// TASK-B11-B15-B20: truthful marquee, woven-label footer, 404 and empty bag.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "./fixtures";

const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();

test("B11 marquee carries the live drop line and the real count; sr copy stays brand-only", async ({ page }) => {
  await page.goto("/");
  const item = page.locator(".marquee__item").first();
  // Placeholder catalogue: drop C opens in 3 days; pieces 03 and 04 (drop B) can be bought now.
  await expect(item).toContainText("DROP DE EXEMPLO C");
  await expect(item).toContainText("EM BREVE");
  await expect(item).toContainText(/\d{2}D \d{2}H \d{2}M \d{2}S/);
  await expect(item).toContainText("2 PEÇAS AINDA DISPONÍVEIS");
  await expect(item).toContainText("SLOW MODE");
  const first = await item.locator("[data-contagem]").textContent();
  await expect.poll(() => item.locator("[data-contagem]").textContent(), { timeout: 3000 }).not.toBe(first);
  await expect(page.locator(".marquee__track")).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator(".marquee .sr-only")).toHaveText(/SLOW MODE/);
  await expect(page.locator(".marquee .sr-only")).not.toContainText("EM BREVE");
});

test("B11 reduced motion: still marquee, minutes only", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const item = page.locator(".marquee__item").first();
  await expect(item).toContainText(/\d{2}D \d{2}H \d{2}M/);
  await expect(item).not.toContainText(/\d{2}M \d{2}S/);
  await expect(page.locator(".marquee__track")).toHaveCSS("animation-name", "none");
  // The still composition is complete: the countdown and the count are on screen, not cut off.
  await page.locator(".marquee").scrollIntoViewIfNeeded();
  await expect(item.locator("[data-contagem]")).toBeInViewport({ ratio: 1 });
  await expect(page.locator(".marquee__item").nth(1)).toBeHidden();
});

test("B15 footer is a woven label with the sample line and a working back-to-top link", async ({ page }) => {
  await page.goto("/contato");
  const footer = page.getByRole("contentinfo");
  await expect(footer.locator(".woven-label")).toBeVisible();
  await expect(footer).toContainText("ESTE SITE USA DADOS DE EXEMPLO");
  await expect(footer.locator('[lang="en"]')).toHaveCount(2);
  await footer.scrollIntoViewIfNeeded();
  const top = footer.getByRole("link", { name: "VOLTAR AO TOPO" });
  await top.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  expect((await axe(page)).violations).toEqual([]);
});

for (const theme of ["preto", "branco", "drop"]) {
  test(`B20 404 says SEM SINAL over a photo, links to the drop, axe clean in ${theme}`, async ({ page }) => {
    await page.addInitScript((t) => {
      try {
        localStorage.setItem("slow:tema", t);
      } catch {}
    }, theme);
    const res = await page.goto("/isto-nao-existe");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("SEM SINAL");
    await expect(page.getByText("PÁGINA NÃO ENCONTRADA")).toBeVisible();
    await expect(page.locator("main img")).toHaveCount(1);
    await expect(page.locator("main").getByRole("link", { name: "VER O DROP ATUAL" })).toHaveAttribute(
      "href",
      "/drops/drop-de-exemplo-c",
    );
    expect((await axe(page)).violations).toEqual([]);
  });
}

test("B20 empty bag names the next drop and its date", async ({ page }) => {
  await page.goto("/sacola");
  await expect(page.getByText("A SACOLA ESTÁ VAZIA.")).toBeVisible();
  await expect(page.getByText(/O PRÓXIMO DROP, DROP DE EXEMPLO C, ABRE .+\d{2}\/\d{2}\/\d{4}/)).toBeVisible();
});
