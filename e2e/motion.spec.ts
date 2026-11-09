// T9 acceptance: custom cursor and page transitions (docs/04 §6, §7, 07 T9).
import { expect, test } from "./fixtures";

test("1. cursor: present and aria-hidden with a fine pointer, follows the mouse", async ({ page }) => {
  await page.goto("/arquivo");
  const cursor = page.locator(".custom-cursor");
  await expect(cursor).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator("html")).toHaveClass(/has-custom-cursor/);
  await page.mouse.move(200, 300);
  await expect(cursor).toHaveAttribute("data-visible", "true");
  await page.getByRole("link", { name: "ARQUIVO" }).first().hover();
  await expect(cursor).toHaveAttribute("data-mode", "ring");
});

test("2. cursor: absent under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/arquivo");
  await expect(page.locator(".custom-cursor")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/has-custom-cursor/);
});

test("3. cursor: absent on touch (hover: none)", async ({ browser }) => {
  const ctx = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 800 } });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3100/arquivo");
  await expect(page.locator(".custom-cursor")).toHaveCount(0);
  await ctx.close();
});

test("4. client navigation runs a view transition and moves focus to the new main", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const w = window as unknown as { __vt: number };
    w.__vt = 0;
    const original = document.startViewTransition?.bind(document);
    if (original) {
      document.startViewTransition = ((arg: Parameters<typeof original>[0]) => {
        w.__vt++;
        return original(arg);
      }) as typeof document.startViewTransition;
    }
  });
  await page.goto("/");
  await expect(page.getByRole("group", { name: "Tema" })).toContainText(/Preto/);
  await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "ARQUIVO" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ARQUIVO");
  await expect(page.locator("main#conteudo")).toBeFocused();
  expect(await page.evaluate(() => (window as unknown as { __vt: number }).__vt)).toBeGreaterThan(0);
});

test("5. reduced motion: no page-wipe animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // A rule inside @media (prefers-reduced-motion: reduce) turns the new-page snapshot's animation off.
  const found = await page.evaluate(() => {
    const walk = (rules: CSSRuleList, inReduce: boolean): boolean =>
      [...rules].some((r) => {
        if (r instanceof CSSMediaRule)
          return walk(r.cssRules, inReduce || r.conditionText.includes("prefers-reduced-motion: reduce"));
        if (r instanceof CSSGroupingRule) return walk(r.cssRules, inReduce);
        return (
          inReduce &&
          r instanceof CSSStyleRule &&
          r.selectorText.includes("::view-transition-new(*)") &&
          r.style.getPropertyValue("animation-name") === "none" &&
          r.style.getPropertyPriority("animation-name") === "important"
        );
      });
    return [...document.styleSheets].some((s) => {
      try {
        return walk(s.cssRules, false);
      } catch {
        return false;
      }
    });
  });
  expect(found).toBe(true);
});
