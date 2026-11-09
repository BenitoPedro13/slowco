import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';
const path = '/produtos/peca-de-exemplo-04';

test('B7 gallery navigation, lightbox keyboard, trap and return focus', async ({ page }) => {
  await page.goto(path);
  await page.getByRole('button', { name: 'Ver foto 2', exact: true }).click();
  await expect(page.getByTestId('gallery-counter')).toHaveText('2 / 2');
  const opener = page.getByRole('button', { name: 'Ampliar foto 2', exact: true });
  await opener.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.press('ArrowLeft');
  await expect(dialog.getByTestId('zoom-counter')).toHaveText('1 / 2');
  await dialog.press('ArrowRight');
  await expect(dialog.getByTestId('zoom-counter')).toHaveText('2 / 2');
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  }
  expect((await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('B7 quantity controls apply to the bag; missing content remains explicit', async ({ page }) => {
  await page.goto(path);
  await expect(page.getByText('A CONFIRMAR COM A SLOW', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Diminuir quantidade' })).toBeDisabled();
  await page.getByRole('button', { name: 'Aumentar quantidade' }).click();
  await page.locator('label', { has: page.locator('input[value=A]') }).click();
  await page.getByRole('button', { name: 'ADICIONAR À SACOLA' }).click();
  await expect(page.getByRole('link', { name: /^Sacola/ })).toHaveAccessibleName('Sacola, 2 itens');
  await expect(page.getByRole('heading', { name: 'DO MESMO DROP' })).toBeVisible();
});

for (const width of [320, 390, 768, 1440]) {
  test(`B7 actions and sizes do not overlap at ${width}, reduced motion`, async ({ page }) => {
    await page.setViewportSize({ width, height: 812 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    const sizes = page.getByRole('group', { name: 'Tamanho', exact: true });
    await sizes.scrollIntoViewIfNeeded();
    const sizeBox = await sizes.boundingBox();
    const actions = await page.getByTestId('product-actions').boundingBox();
    expect(sizeBox!.y + sizeBox!.height).toBeLessThanOrEqual(actions!.y);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  });
}


test('B7 direct order includes selected quantity and preserves 99 cap', async ({ page, context }) => {
  await context.route('https://wa.me/**', route => route.fulfill({ status: 200, body: 'stub' }));
  await page.goto(path);
  await page.locator('label', { has: page.locator('input[value=A]') }).click();
  const more = page.getByRole('button', { name: 'Aumentar quantidade' });
  await more.click();
  const [request] = await Promise.all([
    context.waitForEvent('request', request => request.url().startsWith('https://wa.me/')),
    page.getByRole('button', { name: 'PEDIR SÓ ESTA PEÇA' }).click(),
  ]);
  expect(new URL(request.url()).searchParams.get('text')).toContain('/ 2 un.');
  for (let i = 2; i < 99; i++) await more.click();
  await expect(more).toBeDisabled();
  await expect(page.getByRole('status', { name: 'Quantidade', exact: true })).toHaveText('99');
});
