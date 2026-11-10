// T7 acceptance: archive, contact, 404 (07 T7). Plus card photo swap (design pass).
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "./fixtures";
import { TEST_WHATSAPP_NUMBER } from "../playwright.config";

const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();

test("1. /arquivo: newest first, state per drop, no VIP block", async ({ page }) => {
  await page.goto("/arquivo");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ARQUIVO");
  await expect(page.getByRole("heading", { level: 2 })).toHaveText([
    "DROP DE EXEMPLO C",
    "DROP DE EXEMPLO B",
    "DROP DE EXEMPLO A",
  ]);
  const rows = page.locator("main ol > li");
  await expect(rows.nth(0)).toContainText("EM BREVE");
  await expect(rows.nth(1)).toContainText("AINDA DISPONÍVEL");
  await expect(rows.nth(2)).toContainText("ESGOTADO");
  await expect(page.getByText(/grupo vip/i)).toHaveCount(0);
  expect((await axe(page)).violations).toEqual([]);
});

test("2. /contato: WhatsApp chat link without a message, Instagram", async ({ page }) => {
  await page.goto("/contato");
  await expect(page.getByRole("link", { name: "FALAR NO WHATSAPP" })).toHaveAttribute(
    "href",
    `https://wa.me/${TEST_WHATSAPP_NUMBER}`,
  );
  await expect(page.locator("main").getByRole("link", { name: /@slow_tm/ })).toHaveAttribute(
    "href",
    "https://www.instagram.com/slow_tm/",
  );
  await expect(page.getByText(/grupo vip/i)).toHaveCount(0);
  expect((await axe(page)).violations).toEqual([]);
});

test("3. unknown URL: 404 status, title, link home", async ({ page }) => {
  const res = await page.goto("/isto-nao-existe");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("SEM SINAL");
  await page.locator("main").getByRole("link", { name: "VOLTAR PARA O INÍCIO" }).click();
  await expect(page).toHaveURL(/\/$/);
  expect((await axe(page)).violations).toEqual([]);
});

test("4. product card shows the second photo on hover and on keyboard focus", async ({ page }) => {
  await page.goto("/drops/drop-de-exemplo-b");
  const card = page.locator("main li").first();
  const second = card.locator("img").nth(1);
  await expect(second).toHaveCount(1);
  await expect(second).toHaveCSS("opacity", "0");
  await card.getByRole("link").hover();
  await expect(second).toHaveCSS("opacity", "1");
  await page.mouse.move(0, 0);
  await card.getByRole("link").focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(second).toHaveCSS("opacity", "1");
});
