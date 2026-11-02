import {test,expect} from '@playwright/test';
test('new section renders at both sizes and provides feedback',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/lessons/testing-sort');
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:1000});
    for(let i=0;i<14;i++){
      await page.selectOption('#jump',String(i));await expect(page.locator('h1')).not.toBeEmpty();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      await expect(page.locator('a[href^="http"]')).toHaveCount(0);
    }
  }
  await page.selectOption('#jump','3');await page.getByRole('button',{name:'a == alias',exact:true}).click();await expect(page.locator('.feedback')).toContainText('Correct');
  expect(errors).toEqual([]);
});
test('testing and tracing labs work with bounds and reset',async({page})=>{
  await page.goto('/lessons/testing-sort#3');
  await page.getByRole('button',{name:'Run selected tests'}).click();await expect(page.locator('.status')).toContainText('1 / 1 passed');
  await page.getByRole('button',{name:'Reverse order',exact:true}).click();await page.getByRole('button',{name:'Run selected tests'}).click();await expect(page.locator('.status')).toContainText('1 / 2 passed');
  await page.getByLabel('Implementation').selectOption('correct');await page.getByRole('button',{name:'Run selected tests'}).click();await expect(page.locator('.status')).toContainText('2 / 2 passed');
  await page.selectOption('#jump','9');for(let i=0;i<2;i++)await page.getByRole('button',{name:'Next step',exact:true}).click();await expect(page.locator('.status')).toContainText('copies ant again');
  await page.getByRole('button',{name:'Repaired swap',exact:true}).click();for(let i=0;i<3;i++)await page.getByRole('button',{name:'Next step',exact:true}).click();await expect(page.locator('.status')).toContainText('Both original items survive');
  await page.selectOption('#jump','11');await page.getByLabel('Trace input').selectOption('empty');await page.getByRole('button',{name:'Next step',exact:true}).click();await expect(page.locator('.status')).toContainText('Base case');await expect(page.getByRole('button',{name:'Next step',exact:true})).toBeDisabled();
  await page.getByLabel('Trace input').selectOption('reverse');const next=page.getByRole('button',{name:'Next step',exact:true});let count=0;while(await next.isEnabled() && count++<30)await next.click();await expect(page.locator('.status')).toContainText('Base case');await expect(page.locator('.box')).toHaveText(['ant','bee','cat','dog']);
});
