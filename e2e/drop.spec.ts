// T6 acceptance: drop mode on a mocked clock (docs/04 §5, 07 T6).
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "./fixtures";

const C = "/drops/drop-de-exemplo-c"; // placeholder: releases ~3 days after the build
const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();

async function releaseAt(page: Page) {
  const html = await (await page.request.get(C)).text();
  const iso = html.match(/data-release-at="([^"]+)"/)?.[1];
  expect(iso).toBeTruthy();
  return Date.parse(iso!);
}

test("1. em breve → countdown pauses/resumes → DISPONÍVEL AGORA at releaseAt, no reload", async ({
  page,
}) => {
  const release = await releaseAt(page);
  await page.clock.install({ time: release - 10_000 });
  await page.goto(C);
  const status = page.locator("main [data-drop-state]").first();
  await expect(status).toHaveAttribute("data-drop-state", "em-breve");
  const count = page.getByTestId("contagem");
  await expect(count).toHaveText(/^00:00:00:(09|10)$/);
  await expect(page.locator("time")).toHaveAttribute("datetime", /T18:00:00-03:00$/);

  const pause = page.getByRole("button", { name: "PAUSAR CONTAGEM" });
  await pause.click();
  const frozen = await count.textContent();
  await page.clock.runFor(3000);
  await expect(count).toHaveText(frozen!);
  const resume = page.getByRole("button", { name: "RETOMAR CONTAGEM" });
  await expect(resume).toHaveAttribute("aria-pressed", "true");
  await resume.click();
  await page.clock.runFor(2000);
  await expect(count).not.toHaveText(frozen!);

  await page.clock.runFor(10_000);
  await expect(status).toHaveAttribute("data-drop-state", "disponivel");
  await expect(page.getByText("DISPONÍVEL AGORA", { exact: true }).first()).toBeVisible();
  expect((await axe(page)).violations).toEqual([]);
});

test("2. accessible countdown text and axe while em breve", async ({ page }) => {
  await page.goto(C);
  await expect(page.locator("main").getByText(/^Faltam \d+ dias, \d+ horas e \d+ minutos$/)).toHaveCount(1);
  expect((await axe(page)).violations).toEqual([]);
});

test("3. released drop with pieces: DISPONÍVEL AGORA; sold-out drop: ESGOTADO", async ({ page }) => {
  await page.goto("/drops/drop-de-exemplo-b");
  await expect(page.locator("main [data-drop-state]")).toHaveAttribute("data-drop-state", "disponivel");
  expect((await axe(page)).violations).toEqual([]);
  await page.goto("/drops/drop-de-exemplo-a");
  await expect(page.locator("main [data-drop-state]")).toHaveAttribute("data-drop-state", "esgotado");
  await expect(page.locator("main").getByText("ESGOTADO", { exact: true }).first()).toBeVisible();
  expect((await axe(page)).violations).toEqual([]);
});

test("4. reduced motion: countdown in minutes, no seconds", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(C);
  await expect(page.getByTestId("contagem")).toHaveText(/^\d{2}:\d{2}:\d{2}$/);
});
