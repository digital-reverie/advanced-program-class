import {test,expect} from '@playwright/test';
test('iterator lesson renders at classroom and mobile widths',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');await page.getByRole('link').filter({hasText:'Iterators & Object Methods'}).click();
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:1000});
    for(let i=0;i<15;i++){
      await page.selectOption('#jump',String(i));
      await expect(page.locator('h1')).not.toBeEmpty();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      await expect(page.locator('a[href^="http"]')).toHaveCount(0);
    }
  }
  await page.getByRole('button',{name:'Reveal reasoning'}).first().click();
  await expect(page.locator('.answer')).toContainText('independent state');
  expect(errors).toEqual([]);
});
test('iterators advance independently, do not consume on hasNext, and guard exhaustion',async({page})=>{
  await page.goto('/lessons/iterators#5');
  const a=page.getByRole('region',{name:'Iterator A'}),b=page.getByRole('region',{name:'Iterator B'});
  for(let i=0;i<2;i++)await page.getByRole('button',{name:'A.hasNext()',exact:true}).click();
  await expect(a.locator('[data-position]')).toHaveText('position = 0');
  await page.getByRole('button',{name:'A.next()',exact:true}).click();
  await expect(a.locator('.status')).toContainText('next() → red');
  await expect(b.locator('[data-position]')).toHaveText('position = 0');
  await page.getByRole('button',{name:'B.next()',exact:true}).click();
  await expect(b.locator('.status')).toContainText('next() → red');
  for(let i=0;i<3;i++)await page.getByRole('button',{name:'A.next()',exact:true}).click();
  await expect(a.locator('.status')).toContainText('NoSuchElementException');
  await expect(a.locator('[data-position]')).toHaveText('position = 3');
  await page.getByLabel('Use an empty collection').check();
  await page.getByRole('button',{name:'A.hasNext()',exact:true}).click();
  await expect(a.locator('.status')).toContainText('false');
  await page.getByRole('button',{name:'A.next()',exact:true}).click();
  await expect(a.locator('.status')).toContainText('NoSuchElementException');
  await page.getByLabel('Use an empty collection').uncheck();
  await expect(a.locator('[data-position]')).toHaveText('position = 0');
});
test('equality predictions distinguish identity, membership, null and type',async({page})=>{
  await page.goto('/lessons/iterators#11');
  for(const [key,identity,equal] of [['alias',true,true],['reordered',false,true],['different',false,false],['subset',false,false],['null',false,false],['list',false,false]]){
    await page.getByLabel('Comparison case').selectOption(key);
    await expect(page.locator('[data-identity]')).toHaveCount(0);
    await page.getByRole('button',{name:'Check predictions'}).click();
    await expect(page.locator('[data-identity]')).toHaveText(`a == b → ${identity}`);
    await expect(page.locator('[data-equality]')).toHaveText(`a.equals(b) → ${equal}`);
  }
  await page.selectOption('#jump','11');
  await page.getByRole('button',{name:'It overloads instead of overriding Object.equals(Object)',exact:true}).click();
  await expect(page.locator('.feedback')).toContainText('Correct');
});
