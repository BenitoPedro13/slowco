// T5 acceptance: product page (docs/07-IMPLEMENTATION-PLAN.md T5, docs/04 §5).
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "./fixtures";
import { TEST_WHATSAPP_NUMBER } from "../playwright.config";

// Placeholder catalogue (08 #22): 04 is in the released drop B with size B sold out;
// 01 is in drop C (releases in 3 days); 05 is sold out.
const P04 = "/produtos/peca-de-exemplo-04";
// Next's route announcer is also role=alert: target ours by its id.
const sizeError = (page: Page) => page.locator("#erro-tamanho");
// The radio itself is visually hidden; people click its label.
const pick = (page: Page, size: string) =>
  page.locator("label", { has: page.locator(`input[value=${size}]`) }).click();

test("1. sold-out size: struck, labelled, focusable, never selected", async ({ page }) => {
  await page.goto(P04);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("PEÇA DE EXEMPLO 04");
  const group = page.getByRole("group", { name: "Tamanho" });
  const soldOut = group.getByRole("radio", { name: "B, esgotado" });
  await expect(soldOut).toHaveAttribute("aria-disabled", "true");
  const struck = await group
    .locator("label", { has: page.locator("input[value=B]") })
    .locator(".line-through")
    .evaluate((el) => getComputedStyle(el).textDecorationLine);
  expect(struck).toContain("line-through");
  await expect(group.getByText("ESGOTADO", { exact: true })).toBeVisible();

  await pick(page, "A");
  await expect(group.getByRole("radio", { name: "A", exact: true })).toBeChecked();
  await expect(soldOut).not.toBeChecked();
  await pick(page, "C");
  await expect(group.getByRole("radio", { name: "C", exact: true })).toBeChecked();
});

test("2. add without a size → P-ESCOLHA alert; with a size → bag + announcement", async ({
  page,
}) => {
  await page.goto(P04);
  await page.getByRole("button", { name: "ADICIONAR À SACOLA" }).click();
  await expect(sizeError(page)).toHaveText("Escolha um tamanho.");
  await pick(page, "A");
  await expect(sizeError(page)).toHaveCount(0);
  await page.getByRole("button", { name: "ADICIONAR À SACOLA" }).click();
  await expect(page.getByRole("link", { name: /^Sacola/ })).toHaveAccessibleName("Sacola, 1 item");
  await expect(page.getByRole("status").filter({ hasText: "adicionado" })).toHaveText(
    "PEÇA DE EXEMPLO 04, tamanho A, adicionado à sacola. Sacola com 1 item.",
  );
});

test("3. PEDIR SÓ ESTA PEÇA opens wa.me in a new tab with the single-piece message", async ({ page, context }) => {
  await context.route("https://wa.me/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/html", body: "<title>stub</title>" }),
  );
  await page.goto(P04);
  await pick(page, "C");
  const [request] = await Promise.all([
    context.waitForEvent("request", (r) => r.url().startsWith("https://wa.me/")),
    page.getByRole("button", { name: "PEDIR SÓ ESTA PEÇA" }).click(),
  ]);
  const url = new URL(request.url());
  expect(url.pathname).toBe(`/${TEST_WHATSAPP_NUMBER}`);
  expect(url.searchParams.get("text")).toBe(
    [
      "Olá, Slow Company. Quero pedir esta peça pelo site:",
      "",
      "- PEÇA DE EXEMPLO 04 (DROP DE EXEMPLO B) / tamanho C / 1 un.",
      "",
      "Pode confirmar a disponibilidade?",
    ].join("\n"),
  );
});

test("4. em-breve and esgotado products show their state and no actions", async ({ page }) => {
  await page.goto("/produtos/peca-de-exemplo-01");
  await expect(page.getByText("EM BREVE", { exact: true })).toBeVisible();
  await expect(page.getByText(/^\p{L}+(-feira)?, \d{2}\/\d{2}\/\d{4}, às \d{2}h/u)).toBeVisible();
  await expect(page.getByRole("button", { name: "ADICIONAR À SACOLA" })).toHaveCount(0);

  await page.goto("/produtos/peca-de-exemplo-05");
  await expect(page.getByText("ESGOTADO", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "ADICIONAR À SACOLA" })).toHaveCount(0);
});

test("5. unknown product is a 404", async ({ page }) => {
  const res = await page.goto("/produtos/nao-existe");
  expect(res?.status()).toBe(404);
});

for (const theme of ["preto", "branco", "drop"]) {
  test(`6. axe on a product page in ${theme}`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem("slow:tema", t), theme);
    await page.goto(P04);
    await page.getByRole("button", { name: "ADICIONAR À SACOLA" }).click(); // error state too
    await expect(sizeError(page)).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
