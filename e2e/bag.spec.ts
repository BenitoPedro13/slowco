// T4 acceptance: header, bag counter, /sacola (docs/07-IMPLEMENTATION-PLAN.md T4).
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "./fixtures";
import { TEST_WHATSAPP_NUMBER } from "../playwright.config";

const P3 = "peca-de-exemplo-03";
const P4 = "peca-de-exemplo-04";

async function seedBag(page: Page, lines: unknown) {
  await page.addInitScript((value) => {
    if (!sessionStorage.getItem("seeded")) {
      localStorage.setItem("slow:sacola", value);
      sessionStorage.setItem("seeded", "1");
    }
  }, JSON.stringify(lines));
}

const bagLink = (page: Page) => page.getByRole("link", { name: /^Sacola/ });

test("1. empty bag: counter 00, named 'Sacola vazia', empty state", async ({ page }) => {
  await page.goto("/sacola");
  await expect(bagLink(page)).toHaveAccessibleName("Sacola vazia");
  await expect(page.getByText("Sua sacola está vazia.")).toBeVisible();
  await expect(page.getByRole("link", { name: "VER O DROP ATUAL" })).toHaveAttribute(
    "href",
    /^\/drops\//,
  );
});

test("2. stored lines render; stepper, remove and counter stay in sync", async ({ page }) => {
  await seedBag(page, [
    { slug: P3, size: "A", quantity: 2 },
    { slug: P4, size: "C", quantity: 1 },
    { slug: "nao-existe", size: "A", quantity: 5 },
  ]);
  await page.goto("/sacola");
  await expect(bagLink(page)).toHaveAccessibleName("Sacola, 3 itens");
  await expect(page.locator("main ul").getByRole("heading", { level: 2 })).toHaveCount(2); // unknown slug hidden

  const first = page.getByRole("group", { name: /PEÇA DE EXEMPLO 03, Tamanho A/ });
  await first.getByRole("button", { name: "Aumentar quantidade" }).click();
  await expect(first.locator("output")).toHaveText("3");
  await expect(bagLink(page)).toHaveAccessibleName("Sacola, 4 itens");

  await page.getByRole("button", { name: /^Remover\W+PEÇA DE EXEMPLO 04$/ }).click();
  await expect(page.getByRole("status").filter({ hasText: "removido" })).toHaveText(
    "PEÇA DE EXEMPLO 04 removido da sacola.",
  );
  await expect(bagLink(page)).toHaveAccessibleName("Sacola, 3 itens");

  await page.reload();
  await expect(bagLink(page)).toHaveAccessibleName("Sacola, 3 itens");
});

test("3. WhatsApp link carries the 05 §8 message", async ({ page }) => {
  await seedBag(page, [
    { slug: P3, size: "A", quantity: 2 },
    { slug: P4, size: "C", quantity: 1 },
  ]);
  await page.goto("/sacola");
  await page.getByLabel("Seu nome (opcional)").fill("Ana & Bia?");
  const link = page.getByRole("link", { name: "PEDIR NO WHATSAPP (abre em nova aba)" });
  await expect(link).toHaveAttribute("target", "_blank");
  const href = await link.getAttribute("href");
  const url = new URL(href!);
  expect(url.origin + url.pathname).toBe(`https://wa.me/${TEST_WHATSAPP_NUMBER}`);
  expect(url.searchParams.get("text")).toBe(
    [
      "Olá, Slow Company. Quero fazer um pedido pelo site:",
      "",
      "- PEÇA DE EXEMPLO 03 (DROP DE EXEMPLO B) / tamanho A / 2 un.",
      "- PEÇA DE EXEMPLO 04 (DROP DE EXEMPLO B) / tamanho C / 1 un.",
      "Nome: Ana & Bia?",
      "",
      "Pode confirmar a disponibilidade?",
    ].join("\n"),
  );
});

test("4. another tab's change reaches this tab's counter", async ({ context }) => {
  const a = await context.newPage();
  const b = await context.newPage();
  await a.goto("/");
  await b.goto("/");
  await expect(bagLink(a)).toHaveAccessibleName("Sacola vazia");
  await b.evaluate(
    ([slug]) => {
      localStorage.setItem("slow:sacola", JSON.stringify([{ slug, size: "B", quantity: 2 }]));
    },
    [P3],
  );
  await expect(bagLink(a)).toHaveAccessibleName("Sacola, 2 itens");
  await expect(a.locator("[data-count]")).toHaveAttribute("data-count", "2");
});

test("5. menu sheet on a phone: opens, traps, closes with Escape, returns focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 740 });
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Navegação principal" })).toBeHidden();
  const trigger = page.getByRole("button", { name: "MENU" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "MENU" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "ARQUIVO" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("6. desktop header: nav visible, no overflow at 320", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Navegação principal" });
  await expect(nav.getByRole("link")).toHaveText(["DROPS", "ARQUIVO", "CONTATO"]);
  await page.setViewportSize({ width: 320, height: 640 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

for (const theme of ["preto", "branco", "drop"]) {
  test(`7. axe on a filled /sacola in ${theme}`, async ({ page }) => {
    await page.addInitScript((t) => localStorage.setItem("slow:tema", t), theme);
    await seedBag(page, [{ slug: P3, size: "A", quantity: 1 }]);
    await page.goto("/sacola");
    await expect(page.locator("main ul").getByRole("heading", { level: 2 })).toHaveCount(1);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
