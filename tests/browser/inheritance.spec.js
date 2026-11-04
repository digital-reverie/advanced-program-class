import {test,expect} from '@playwright/test';
test('bag sampling preserves items and removal preserves all other occurrences',async({page})=>{
  await page.goto('/lessons/interfaces#18');
  const cells=page.locator('[data-bag] .box');
  await page.getByRole('button',{name:'Sample without removing'}).click();
  await expect(cells).toHaveText(['A','B','C','D','E']);
  await expect(page.locator('.status')).toContainText('Sample returns B');
  const step=page.getByRole('button',{name:'Next removal step'});
  await step.click();await expect(page.locator('.status')).toContainText('Save B');
  await step.click();await expect(cells).toHaveText(['A','E','C','D','E']);
  await step.click();await expect(cells).toHaveText(['A','E','C','D']);
  await expect(step).toBeDisabled();
  await page.getByRole('button',{name:'Reset bag'}).click();
  await page.getByLabel('Selected index').selectOption('4');
  for(let i=0;i<3;i++)await step.click();
  await expect(cells).toHaveText(['A','B','C','D']);
  await expect(page.locator('.status')).toContainText('return E');
});
test('inheritance extension reveals contract and signature reasoning',async({page})=>{
  await page.goto('/lessons/interfaces#14');
  await page.getByRole('button',{name:'Reveal reasoning'}).click();
  await expect(page.locator('.answer')).toContainText('Each concrete class');
  await page.selectOption('#jump','14');
  await page.getByRole('button',{name:'Reveal reasoning'}).first().click();
  await expect(page.locator('.answer')).toContainText('does not implement speak()');
  await page.selectOption('#jump','18');
  await page.getByRole('button',{name:'Reveal reasoning'}).last().click();
  await expect(page.locator('.answer')).toContainText('2/3');
});
