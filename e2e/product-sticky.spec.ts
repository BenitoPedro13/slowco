import { expect, test } from './fixtures';
for (const theme of ['preto', 'branco', 'drop']) {
 for (const width of [1440, 2048]) {
  test(`product sticky ends before related products: ${theme} ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(t => localStorage.setItem('slow:tema', t), theme);
    await page.goto('/produtos/peca-de-exemplo-03');
    const related = page.locator('section[aria-labelledby="same-drop"]');
    await related.scrollIntoViewIfNeeded();
    const info = page.locator('main').getByRole('heading', { level: 1 }).locator('..');
    await expect.poll(async () => {
      const a = await info.boundingBox();
      const b = await related.boundingBox();
      return a!.y + a!.height <= b!.y;
    }).toBe(true);
  });
 }
}
