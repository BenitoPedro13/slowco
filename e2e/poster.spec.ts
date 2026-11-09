import { expect, test } from './fixtures';

for (const width of [390, 768, 1440, 1920]) {
  test(`B1 poster fits first viewport at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const poster = page.locator('.hero-poster');
    await expect(poster).toBeVisible();
    const box = await poster.boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(901);
    const wordmark = await page.locator('h1').boundingBox();
    expect(wordmark!.y + wordmark!.height).toBeLessThanOrEqual(901);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('B1 reduced motion keeps the campaign still', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.hero-poster__photo')).toHaveCSS('animation-name', 'none');
});
