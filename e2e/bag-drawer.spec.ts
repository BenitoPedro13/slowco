import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test('B8 drawer preview equals WhatsApp URL and updates with name and quantity', async ({ page }) => {
  await page.goto('/produtos/peca-de-exemplo-04');
  await page.locator('label', { has: page.locator('input[value=A]') }).click();
  await page.getByRole('button', { name: 'ADICIONAR À SACOLA' }).click();
  const opener = page.locator('header a[href="/sacola"]');
  await expect(opener).toHaveAccessibleName('Sacola, 1 item');
  await opener.click();
  const drawer = page.getByRole('dialog', { name: 'SACOLA', exact: true });
  await expect(drawer).toBeVisible();
  await expect(page).toHaveURL(/produtos/);
  await drawer.getByRole('textbox').fill('Teste');
  await drawer.getByRole('button', { name: 'Aumentar quantidade' }).click();
  const href = await drawer.getByRole('link', { name: /PEDIR NO WHATSAPP/ }).getAttribute('href');
  await expect(drawer.getByTestId('message-preview')).toHaveText(new URL(href!).searchParams.get('text')!);
  await expect(drawer.getByTestId('message-preview')).toContainText('2 un.');
  expect((await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  for (let i=0;i<12;i++) {
    await page.keyboard.press('Tab');
    expect(await drawer.evaluate(el => el.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await expect(opener).toBeFocused();
  await page.getByRole('link', { name: 'Sacola, 2 itens', exact: true }).click();
  await drawer.getByRole('link', { name: 'VER SACOLA', exact: true }).click();
  await expect(page).toHaveURL(/\/sacola$/);
  await expect(drawer).toBeHidden();
});

test('B8 mobile reduced-motion empty drawer closes and restores focus', async ({ page }) => {
  await page.setViewportSize({ width:320, height:812 });
  await page.emulateMedia({ reducedMotion:'reduce' });
  await page.goto('/arquivo');
  const opener = page.getByRole('link', { name:'Sacola vazia',exact:true });
  await opener.click();
  const drawer=page.getByRole('dialog');
  await expect(drawer).toBeVisible();
  expect(await drawer.evaluate(el=>el.getAnimations().length)).toBe(0);
  expect(await drawer.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  await drawer.getByRole('button',{name:'FECHAR',exact:true}).click();
  await expect(opener).toBeFocused();
});
