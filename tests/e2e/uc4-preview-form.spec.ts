import { test, expect } from '@playwright/test';

test.describe('Form Builder - Use Cases', () => {
  test.describe('UC4: Preview form and fill fields', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await dialog.getByRole('textbox').fill('Preview Test Form');
      await dialog.getByRole('button', { name: /create/i }).click();
      await expect(dialog).not.toBeVisible();

      // Add a Text Input and set its label
      await page.getByRole('button', { name: /^Text Input$/i }).click();
      await page.locator('[data-canvas-field-wrapper]').first().click();
      await page.locator('#field-label').fill('Full Name');
      await page.locator('#field-placeholder').fill('Enter your full name');
      await page.locator('#field-name').fill('full_name');

      // Add a Text Area
      await page.getByRole('button', { name: /^Text Area$/i }).click();
      await page.locator('[data-canvas-field-wrapper]').nth(1).click();
      await page.locator('#field-label').fill('Biography');
      await page.locator('#field-placeholder').fill('Tell us about yourself');
      await page.locator('#field-name').fill('biography');

      // Add a Number field
      await page.getByRole('button', { name: /^Number$/i }).click();
      await page.locator('[data-canvas-field-wrapper]').nth(2).click();
      await page.locator('#field-label').fill('Age');
      await page.locator('#field-name').fill('age');
    });

    test('Toggle preview mode and verify fields render', async ({ page }) => {
      // Click Preview button
      await page.getByRole('button', { name: 'Preview', exact: true }).click();

      // Verify the preview renders with our configured labels
      await expect(page.getByText('Full Name')).toBeVisible();
      await expect(page.getByText('Biography')).toBeVisible();
      await expect(page.getByText('Age')).toBeVisible();
    });

    test('Fill form fields in preview mode', async ({ page }) => {
      await page.getByRole('button', { name: 'Preview', exact: true }).click();

      // Fill the text input
      const fullNameInput = page.getByPlaceholder('Enter your full name');
      await fullNameInput.fill('John Doe');
      await expect(fullNameInput).toHaveValue('John Doe');

      // Fill the textarea
      const biographyInput = page.getByPlaceholder('Tell us about yourself');
      await biographyInput.fill('A software developer');
      await expect(biographyInput).toHaveValue('A software developer');
    });

    test('Return to edit mode from preview', async ({ page }) => {
      await page.getByRole('button', { name: 'Preview', exact: true }).click();
      await expect(page.getByText('Full Name')).toBeVisible();

      // Click Edit Mode button to go back
      await page.getByRole('button', { name: /Edit Mode/i }).click();

      // Canvas field wrappers should be visible again
      const canvasItems = page.locator('[data-canvas-field-wrapper]');
      await expect(canvasItems).toHaveCount(3);
    });
  });
});
