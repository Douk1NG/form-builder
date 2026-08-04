import { test, expect } from '@playwright/test';

test.describe('Form Builder - Use Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('textbox').fill('UC2 Test Form');
    await dialog.getByRole('button', { name: /create/i }).click();
    await expect(dialog).not.toBeVisible();
  });

  test('UC2: Select items by clicking', async ({ page }) => {
    // Try clicking a Text Input field
    await page.getByRole('button', { name: /^Text Input$/i }).click();
    
    // Verify it was added
    const canvasItems = page.locator('[data-canvas-field-wrapper]');
    await expect(canvasItems).toHaveCount(1);
  });

  // TODO: Edge Case - Add a test for selecting items by Drag and Drop. 
  // Playwright's `dragTo` struggles with pragmatic-drag-and-drop HTML5 events, 
  // so this will need a custom implementation dispatching dragstart/dragover/drop events.
});
