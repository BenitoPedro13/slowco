import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test('B6 filters use native radios, share URLs and restore on back', async ({ page }) => {
  await page.goto('/arquivo');
  await page.getByRole('radio', { name: 'DISPONÍVEL', exact: true }).check();
  await expect(page).toHaveURL(/estado=disponivel/);
  await expect(page.locator('main ol > li')).toHaveCount(1);
  await expect(page.locator('main ol')).toContainText('DROP DE EXEMPLO B');
  await expect(page.locator('main ol')).toContainText('peças ainda disponíveis');
  await page.reload();
  await expect(page.getByRole('radio', { name: 'DISPONÍVEL', exact: true })).toBeChecked();
  await page.getByRole('radio', { name: 'ESGOTADO', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(page.locator('main ol')).toContainText('DROP DE EXEMPLO A');
  await expect(page).toHaveURL(/estado=esgotado/);
  await page.goBack();
  await expect(page.getByRole('radio', { name: 'DISPONÍVEL', exact: true })).toBeChecked();
});

for (const theme of ['preto', 'branco', 'drop']) {
 test(`B6 poster wall accessible in ${theme}, reduced motion`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(t => localStorage.setItem('slow:tema', t), theme);
  await page.goto('/arquivo?estado=invalid');
  await expect(page.getByRole('radio', { name: 'TODOS', exact: true })).toBeChecked();
  await expect(page.locator('main ol > li')).toHaveCount(3);
  await expect(page.locator('main ol img')).toHaveCount(6);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  await page.getByRole('radio', { name: 'ESGOTADO', exact: true }).check();
  await expect(page.locator('main ol > li')).toHaveCount(1);
  expect(await page.locator('main ol').evaluate(el => el.getAnimations({subtree:true}).length)).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
 });
}
