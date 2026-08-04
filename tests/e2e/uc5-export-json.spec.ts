import { test, expect } from '@playwright/test';

test.describe('Form Builder - Use Cases', () => {
  test.describe('UC5: Export JSON with configured properties', () => {
    test('Exported JSON contains all field configurations from UC3', async ({ page }) => {
      await page.goto('/');

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await dialog.getByRole('textbox').fill('Export Test Form');
      await dialog.getByRole('button', { name: /create/i }).click();
      await expect(dialog).not.toBeVisible();

      // Add a Text Input and configure all properties
      await page.getByRole('button', { name: /^Text Input$/i }).click();
      await page.locator('[data-canvas-field-wrapper]').first().click();

      await page.getByRole('tab', { name: /Basic/i }).click();
      await page.locator('#field-label').fill('Full Name');
      await page.locator('#field-placeholder').fill('Enter your full name');
      await page.locator('#field-description').fill('Your legal full name');
      await page.locator('#field-name').fill('full_name');

      await page.getByRole('tab', { name: /Behavior/i }).click();
      await page.getByRole('switch', { name: /Read Only/i }).click();

      // Add a Select field with options
      await page.getByRole('button', { name: /^Select$/i }).click();
      await page.locator('[data-canvas-field-wrapper]').nth(1).click();

      await page.getByRole('tab', { name: /Basic/i }).click();
      await page.locator('#field-label').fill('Country');
      await page.locator('#field-name').fill('country');

      await page.getByRole('tab', { name: /Options|Data/i }).click();
      await page.getByRole('button', { name: /Add Option/i }).click();

      // Intercept the download triggered by Export JSON
      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: /Export JSON/i }).click();
      const download = await downloadPromise;

      // Read the downloaded file content
      const downloadPath = await download.path();
      expect(downloadPath).toBeTruthy();

      const fileContent = await (await download.createReadStream()).toArray();
      const jsonString = Buffer.concat(fileContent).toString('utf-8');
      const exportedSchema = JSON.parse(jsonString);

      // Verify top-level form structure
      expect(exportedSchema.title).toBe('Export Test Form');
      expect(exportedSchema.items).toHaveLength(2);

      // Verify Text Input field configuration
      const textField = exportedSchema.items[0];
      expect(textField.kind).toBe('field');
      expect(textField.type).toBe('text');
      expect(textField.label).toBe('Full Name');
      expect(textField.placeholder).toBe('Enter your full name');
      expect(textField.description).toBe('Your legal full name');
      expect(textField.name).toBe('full_name');
      expect(textField.readOnly).toBe(true);

      // Verify Select field configuration
      const selectField = exportedSchema.items[1];
      expect(selectField.kind).toBe('field');
      expect(selectField.type).toBe('select');
      expect(selectField.label).toBe('Country');
      expect(selectField.name).toBe('country');
      expect(selectField.options).toBeDefined();
      expect(selectField.options.length).toBeGreaterThanOrEqual(1);
    });
  });
});
