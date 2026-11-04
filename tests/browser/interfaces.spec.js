import {test,expect} from '@playwright/test';
test('interface lesson renders at classroom and mobile sizes without external links',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/lessons/interfaces');
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:1000});
    for(let i=0;i<21;i++){
      await page.selectOption('#jump',String(i));await expect(page.locator('h1')).not.toBeEmpty();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      await expect(page.locator('a[href^="http"]')).toHaveCount(0);
    }
  }
  await page.getByRole('button',{name:'Reveal reasoning'}).first().click();await expect(page.locator('.answer')).toContainText('does not expose');
  expect(errors).toEqual([]);
});
test('dispatch predictions distinguish compile errors, defaults, overrides and overloads',async({page})=>{
  await page.goto('/lessons/interfaces#12');
  const check=page.getByRole('button',{name:'Check prediction'});
  await check.click();await expect(page.locator('[data-resolution]')).toHaveText('SLList.print()');
  await page.getByLabel('Method call').selectOption('label');await expect(page.locator('[data-resolution]')).toHaveCount(0);await check.click();await expect(page.locator('[data-resolution]')).toHaveText('WordTools.label(List61B<String>)');
  await page.getByLabel('Declared type').selectOption('SLList');await check.click();await expect(page.locator('[data-resolution]')).toHaveText('WordTools.label(SLList<String>)');
  await page.getByLabel('Created object').selectOption('AList');await check.click();await expect(page.locator('.answer')).toContainText('Assignment rejected');
  await page.getByLabel('Declared type').selectOption('List61B');await page.getByLabel('Method call').selectOption('print');await check.click();await expect(page.locator('[data-resolution]')).toHaveText('List61B default print()');
  await page.getByLabel('Method call').selectOption('capacity');await check.click();await expect(page.locator('.answer')).toContainText('Method lookup rejected');
  await page.getByLabel('Declared type').selectOption('AList');await check.click();await expect(page.locator('[data-resolution]')).toHaveText('AList.capacity()');
});
test('cost slider updates independently from slide navigation',async({page})=>{
  await page.goto('/lessons/interfaces#9');await expect(page.locator('[data-indexed]')).toHaveText('36 node inspections');
  await page.locator('#list-size').fill('20');await expect(page.locator('[data-indexed]')).toHaveText('210 node inspections');await expect(page.locator('[data-direct]')).toHaveText('20 node inspections');
  await page.locator('#list-size').fill('1');await expect(page.locator('[data-indexed]')).toHaveText('1 node inspections');
});
