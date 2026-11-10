// TASK-B21-cursor-states: labelled cursor modes and mouse drag on the chapter rails.
import { expect, test, type Page } from "./fixtures";

const cursor = (page: Page) => page.locator(".custom-cursor");

test("B21 PEDIR over the WhatsApp order actions; ring over add-to-bag", async ({ page }) => {
  await page.goto("/produtos/peca-de-exemplo-04");
  await page.getByRole("button", { name: "PEDIR SÓ ESTA PEÇA" }).hover();
  await expect(cursor(page)).toHaveAttribute("data-mode", "pedir");
  await expect(cursor(page).locator(".custom-cursor__label")).toHaveText("PEDIR");
  await page.getByRole("button", { name: "ADICIONAR À SACOLA" }).hover();
  await expect(cursor(page)).toHaveAttribute("data-mode", "ring");

  await page.locator("label", { has: page.locator("input[value=A]") }).click();
  await page.getByRole("button", { name: "ADICIONAR À SACOLA" }).click();
  await page.goto("/sacola");
  await page.getByRole("link", { name: /PEDIR NO WHATSAPP/ }).hover();
  await expect(cursor(page)).toHaveAttribute("data-mode", "pedir");
});

test("B21 rail: ARRASTAR on the rail, ring on a card title, VER on a card photo", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  // Fine pointer at a phone-sized viewport so the rail overflows.
  const list = page.getByRole("region", { name: "Peças de DROP DE EXEMPLO C" }).getByRole("list");
  await list.scrollIntoViewIfNeeded();
  const box = (await list.boundingBox())!;
  await page.mouse.move(box.x + 4, box.y + box.height / 2); // the rail's own inline padding
  await expect(cursor(page)).toHaveAttribute("data-mode", "arrastar");
  await expect(cursor(page).locator(".custom-cursor__label")).toHaveText("ARRASTAR");
  await list.getByRole("link").first().locator("span.font-display").hover();
  await expect(cursor(page)).toHaveAttribute("data-mode", "ring");
  await list.locator("[data-cursor=ver]").first().hover();
  await expect(cursor(page)).toHaveAttribute("data-mode", "ver");
});

test("B21 mouse drag scrolls the rail without navigating; a plain click still opens the piece", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const list = page.getByRole("region", { name: "Peças de DROP DE EXEMPLO C" }).getByRole("list");
  await list.scrollIntoViewIfNeeded();
  const photo = (await list.locator("[data-cursor=ver]").first().boundingBox())!;
  const y = photo.y + photo.height / 2;
  await page.mouse.move(photo.x + photo.width - 20, y);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) await page.mouse.move(photo.x + photo.width - 20 - i * 20, y);
  await page.mouse.up();
  await expect.poll(() => list.evaluate((el) => el.scrollLeft)).toBeGreaterThan(100);
  await page.waitForTimeout(300);
  await expect(page).toHaveURL(/localhost:3100\/$/);

  await list.getByRole("link").last().locator("span.font-display").click();
  await expect(page).toHaveURL(/\/produtos\//);
});
