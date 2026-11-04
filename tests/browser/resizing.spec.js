import { test, expect } from '@playwright/test';

test('wrapped resize preserves order and updates bookkeeping only after copying', async ({page}) => {
  await page.goto('/lessons/list-lab#13');
  const next = page.getByRole('button',{name:'Next step',exact:true});
  await next.click();
  for(let i=0;i<8;i++) {
    await next.click();
    await expect(page.locator('[data-resized] .box')).toHaveText([...['A','B','C','D','E','F','G','H'].slice(0,i+1),...Array(15-i).fill('—')]);
  }
  await expect(page.locator('.tag')).toHaveText(['size = 8','front = 6','capacity = 8']);
  await next.click();
  await expect(page.locator('.tag')).toHaveText(['size = 8','front = 0','capacity = 16']);
  await next.click();
  await expect(page.locator('[data-resized] .box')).toHaveText(['A','B','C','D','E','F','G','H','Z',...Array(7).fill('—')]);
  await expect(next).toBeDisabled();
  await page.getByRole('button',{name:'Reveal reasoning',exact:true}).click();
  await expect(page.locator('.answer')).toContainText('Physical order and logical order differ');
  await page.getByRole('button',{name:'Reset trace'}).click();
  await expect(page.locator('[data-resized]')).toHaveCount(0);
  await page.selectOption('#jump','13');
  await page.getByRole('button',{name:'O(n), because this particular append copies all existing items',exact:true}).click();
  await expect(page.locator('.feedback')).toContainText('Correct');
  await page.selectOption('#jump','14');
  await page.getByRole('button',{name:'Reveal reasoning',exact:true}).click();
  await expect(page.locator('.answer')).toContainText('size 9 and capacity 16');
});
