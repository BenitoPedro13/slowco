// T1 acceptance (docs/07-IMPLEMENTATION-PLAN.md, T1 checks 1–9).
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "./fixtures";

const html = (page: Page) => page.locator("html");

/** The switch's visible label is client-rendered: once it shows, the page is hydrated. */
async function hydrated(page: Page) {
  await expect(page.getByRole("group", { name: "Tema" })).toContainText(/Preto|Branco|Cor do drop/);
}

async function setStoredTheme(page: Page, theme: string) {
  await page.addInitScript((t) => {
    try {
      window.localStorage.setItem("slow:tema", t);
    } catch {}
  }, theme);
}

test("1. one h1 named Slow Company, pt-BR document", async ({ page }) => {
  await page.goto("/");
  await expect(html(page)).toHaveAttribute("lang", "pt-BR");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveCount(1);
  await expect(h1).toHaveAccessibleName("Slow Company");
});

test("2. default theme is preto with an ink background", async ({ page }) => {
  await page.goto("/");
  await expect(html(page)).toHaveAttribute("data-theme", "preto");
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe("rgb(11, 11, 11)");
});

for (const theme of ["preto", "branco", "drop"]) {
  test(`3. axe: no WCAG 2.2 AA violations in ${theme}`, async ({ page }) => {
    await setStoredTheme(page, theme);
    await page.goto("/");
    await expect(html(page)).toHaveAttribute("data-theme", theme);
    await page.waitForTimeout(1200); // let the entry motion finish
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test("4. keyboard: skip link, header in order, then the theme group; arrows select", async ({
  page,
}) => {
  await page.goto("/");
  await hydrated(page);
  // T4: the header (wordmark, nav) comes before the switch (docs/04 §2.1).
  const order = [
    page.getByRole("link", { name: "Pular para o conteúdo" }),
    page.getByRole("link", { name: "Slow Company", exact: true }),
    nav(page).getByRole("link", { name: "DROPS" }),
    nav(page).getByRole("link", { name: "ARQUIVO" }),
    nav(page).getByRole("link", { name: "CONTATO" }),
    page.getByRole("radio", { name: "Preto" }),
  ];
  for (const target of order) {
    await page.keyboard.press("Tab");
    await expect(target).toBeFocused();
  }
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "Branco" })).toBeChecked();
  await expect(html(page)).toHaveAttribute("data-theme", "branco", { timeout: 1000 });
  await expect(page.getByRole("group", { name: "Tema" })).toContainText("Branco");
});

test("5. stored theme is applied before hydration", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("radio", { name: "Cor do drop" }).click();
  await expect(html(page)).toHaveAttribute("data-theme", "drop");
  await page.addInitScript(() => {
    document.addEventListener("DOMContentLoaded", () => {
      (window as unknown as { __themeAtDCL?: string }).__themeAtDCL =
        document.documentElement.dataset.theme;
    });
  });
  await page.reload();
  const atDCL = await page.evaluate(
    () => (window as unknown as { __themeAtDCL?: string }).__themeAtDCL,
  );
  expect(atDCL).toBe("drop");
});

test("6. theme changes are throttled and coalesced", async ({ page }) => {
  await page.addInitScript(() => {
    // Init scripts run before <html> exists: observe the document, keep only <html> changes
    // (the wipe overlay and the swatches carry data-theme too).
    const w = window as unknown as { __changes: number[] };
    w.__changes = [];
    new MutationObserver((records) => {
      for (const r of records) {
        if (r.target === document.documentElement) w.__changes.push(performance.now());
      }
    }).observe(document, { attributes: true, subtree: true, attributeFilter: ["data-theme"] });
  });
  await page.goto("/");
  await hydrated(page);
  await page.getByRole("radio", { name: "Preto" }).focus();
  const t0 = await page.evaluate(() => performance.now());
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(50);
  }
  // preto → (×8) branco, drop, preto, branco, drop, preto, branco, drop
  await expect(html(page)).toHaveAttribute("data-theme", "drop", { timeout: 4000 });
  const changes = await page.evaluate(
    () => (window as unknown as { __changes: number[] }).__changes,
  );
  const early = changes.filter((t) => t - t0 <= 1500);
  expect(changes.length).toBeGreaterThanOrEqual(1);
  expect(early.length).toBeLessThanOrEqual(3);
  for (let i = 1; i < changes.length; i++) {
    expect(changes[i] - changes[i - 1]).toBeGreaterThanOrEqual(590);
  }
});

test("7. reduced motion: no wipe, no letter animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await hydrated(page);
  const letterAnimation = await page.evaluate(
    () => getComputedStyle(document.querySelector(".hero-letter")!).animationName,
  );
  expect(letterAnimation).toBe("none");
  await page.getByRole("radio", { name: "Branco" }).click();
  await expect(html(page)).toHaveAttribute("data-theme", "branco", { timeout: 300 });
  const wipeAnimations = await page.evaluate(
    () => document.querySelector("[data-testid=theme-wipe]")!.getAnimations().length,
  );
  expect(wipeAnimations).toBe(0);
});

for (const [width, height] of [
  [320, 640],
  [1440, 900],
]) {
  test(`8. no horizontal overflow at ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page.waitForTimeout(1200);
    const fits = await page.evaluate(() => {
      const root = document.documentElement;
      const letters = [...document.querySelectorAll("[data-standin=wordmark] .hero-letter")];
      const boxes = letters.map((l) => l.getBoundingClientRect());
      return {
        noScroll: root.scrollWidth <= root.clientWidth,
        left: Math.min(...boxes.map((b) => b.left)),
        right: Math.max(...boxes.map((b) => b.right)),
        viewport: root.clientWidth,
      };
    });
    expect(fits.noScroll).toBe(true);
    expect(fits.left).toBeGreaterThanOrEqual(0);
    expect(fits.right).toBeLessThanOrEqual(fits.viewport);
  });
}

test("9. Instagram link (hero and footer) opens in a new tab", async ({ page }) => {
  await page.goto("/");
  const links = page.getByRole("link", { name: /@slow_tm \(abre em nova aba\)/ });
  await expect(links).toHaveCount(2);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("href", "https://www.instagram.com/slow_tm/");
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
});

const nav = (page: import("@playwright/test").Page) =>
  page.getByRole("navigation", { name: "Navegação principal" });
