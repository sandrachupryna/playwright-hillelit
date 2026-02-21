import { test, expect } from '@playwright/test';

test.describe('Playwright homepage', () => {
  test('has title', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Expect a title "to contain" a substring.
    await test.step('check title contains Playwright', async () => {
      await expect(page).toHaveTitle(/Playwright/);
    });
  });

  test('get started link', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Click the get started link.
    await test.step('click Get started link', async () => {
      await page.getByRole('link', { name: 'Get started' }).click();
    });
    
    await test.step('check heading Installation is visible', async () => {
    // Expects page to have a heading with the name of Installation.
      await expect(page).toHaveURL(/docs/);
      await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
    });
  });
});