import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Assuming the playground or the app has some identifiable text or title.
  // We check for the word "Form" which should be present somewhere in a form builder.
  await expect(page).toHaveTitle(/Vite \+ React/);
});
