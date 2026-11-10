// TASK-B22-transitions-and-tear: drop-accent curtain, no reveal on back/forward, torn chapter edges.
import { expect, test, type Page } from "./fixtures";

type Rec = { target: string; duration: number; accent?: string };

async function record(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __anims: { target: string; duration: number; accent?: string }[] };
    w.__anims = [];
    const original = Element.prototype.animate;
    Element.prototype.animate = function (keyframes, options) {
      const el = this as HTMLElement;
      const target = el.id === "conteudo" ? "reveal" : el.dataset.testid === "page-curtain" ? "curtain" : "";
      if (target) {
        const duration = typeof options === "number" ? options : Number(options?.duration ?? 0);
        w.__anims.push({ target, duration, accent: el.dataset.accent });
      }
      return original.call(this, keyframes, options);
    };
  });
}
const anims = (page: Page) => page.evaluate(() => (window as unknown as { __anims: Rec[] }).__anims);

test("B22 navigating to a drop sweeps a curtain in its accent; back/forward reveal nothing", async ({ page }) => {
  await record(page);
  await page.goto("/arquivo");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ARQUIVO");
  await page.locator('a[href="/drops/drop-de-exemplo-b"]').first().click();
  await expect(page).toHaveURL(/drop-de-exemplo-b/);
  await expect.poll(() => anims(page)).toEqual([expect.objectContaining({ target: "curtain", accent: "azul" })]);
  const [curtain] = await anims(page);
  expect(curtain.duration).toBeLessThanOrEqual(450);
  await page.waitForTimeout(600);
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ARQUIVO");
  await page.goForward();
  await expect(page).toHaveURL(/drop-de-exemplo-b/);
  await page.waitForTimeout(300);
  expect(await anims(page)).toHaveLength(1);
  // An ordinary in-app navigation still reveals.
  await page.getByRole("navigation").getByRole("link", { name: "CONTATO", exact: true }).click();
  await expect.poll(async () => (await anims(page)).at(-1)?.target).toBe("reveal");
});

test("B22 at most one curtain per second: a second drop navigation right after gets the plain reveal", async ({ page }) => {
  await record(page);
  await page.goto("/arquivo");
  await page.locator('a[href="/drops/drop-de-exemplo-b"]').first().click();
  await expect(page).toHaveURL(/drop-de-exemplo-b/);
  await page.getByRole("navigation").getByRole("link", { name: "DROPS", exact: true }).click();
  await expect(page).toHaveURL(/drop-de-exemplo-c/);
  await expect.poll(async () => (await anims(page)).length).toBe(2);
  expect((await anims(page)).map((a) => a.target)).toEqual(["curtain", "reveal"]);
});

test("B22 reduced motion: no curtain", async ({ page }) => {
  await record(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/arquivo");
  await page.locator('a[href="/drops/drop-de-exemplo-b"]').first().click();
  await expect(page).toHaveURL(/drop-de-exemplo-b/);
  await page.waitForTimeout(400);
  expect(await anims(page)).toEqual([]);
});

test("Paper tear: each chapter hangs a torn polygon edge below itself", async ({ page }) => {
  await page.goto("/");
  const tear = await page.getByRole("region", { name: "DROP DE EXEMPLO C", exact: true }).evaluate((el) => {
    const s = getComputedStyle(el, "::after");
    return { clip: s.clipPath, bottom: s.bottom, height: s.height };
  });
  expect(tear.clip).toMatch(/^polygon/);
  expect(parseFloat(tear.bottom)).toBeLessThan(0);
});
