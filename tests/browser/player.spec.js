import { test, expect } from '@playwright/test';

test('all lesson slides render, resize, and contain no external links', async ({page}) => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/lessons/list-lab');
  for(const width of [1440,390]) {
    await page.setViewportSize({width,height:1000});
    for(let i=0;i<15;i++) {
      await page.selectOption('#jump',String(i));
      await expect(page.locator('h1')).not.toBeEmpty();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      await expect(page.locator('a[href^="http"]')).toHaveCount(0);
    }
  }
  expect(errors).toEqual([]);
});
test('traces, puzzles, labs and refresh links work',async({page})=>{
  await page.goto('/lessons/list-lab#4');
  await expect(page.locator('h1')).toHaveText('Insertion, one assignment at a time');
  for(let i=0;i<5;i++) await page.locator('[data-step="1"]').click();
  await expect(page.locator('.tag').first()).toHaveText('size = 3');
  await page.reload();await expect(page.locator('#counter')).toHaveText('4 / 15');
  await page.selectOption('#jump','6');await page.locator('[data-choice="2"]').click();
  await expect(page.locator('#feedback-repair')).toContainText('Correct');
  await page.locator('[data-reveal]').click();await expect(page.locator('#bug-tests')).toBeVisible();
  await page.selectOption('#jump','8');await page.fill('#item','60');await page.locator('[data-array="add"]').click();
  await expect(page.locator('.status')).toContainText('Wrote 60');
  await page.locator('[data-array="add"]').click();await expect(page.locator('.status')).toContainText('Full:');
  await page.selectOption('#jump','10');await expect(page.locator('#growth-result')).toContainText('120 copies');
  await page.locator('#growth').fill('32');await expect(page.locator('#growth-result')).toContainText('496 copies');
  await page.selectOption('#jump','11');await page.locator('[data-circle="last"]').click();
  await expect(page.locator('.status')).toContainText('[A, B, C, Y]');
});
test('starter template, lesson switching and missing lesson',async({page})=>{
  await page.goto('/');await page.getByRole('link').filter({hasText:'Your next lesson'}).click();
  await page.selectOption('#jump','1');await page.getByRole('button',{name:'6',exact:true}).click();
  await expect(page.locator('.feedback')).toContainText('Correct');
  await page.selectOption('#jump','2');await page.getByRole('button',{name:'Reveal reasoning'}).click();
  await expect(page.locator('.answer')).toContainText('final total is 3');
  await page.getByRole('link',{name:'CLASSROOM LAB'}).click();
  await page.getByRole('link').filter({hasText:'List Lab'}).click();await expect(page.locator('#counter')).toHaveText('1 / 15');
  const response=await page.goto('/lessons/missing');expect(response.status()).toBe(404);
});
