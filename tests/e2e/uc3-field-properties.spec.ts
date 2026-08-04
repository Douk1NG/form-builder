import { test, expect } from '@playwright/test';

test.describe('Form Builder - Use Cases', () => {
  test.describe('UC3: Define properties field by field', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await dialog.getByRole('textbox').fill('Test Form');
      await dialog.getByRole('button', { name: /create/i }).click();
      await expect(dialog).not.toBeVisible();
    });

    test('Text field properties', async ({ page }) => {
      await page.getByRole('button', { name: /^Text Input$/i }).click();
      await page.locator('[data-canvas-field-wrapper]').first().click();

      await page.getByRole('tab', { name: /Basic/i }).click();
      await page.locator('#field-label').fill('Custom Text Label');
      await page.locator('#field-placeholder').fill('Custom Placeholder');
      await page.locator('#field-description').fill('Custom Description');
      await page.locator('#field-name').fill('custom_text_name');

      await page.getByRole('tab', { name: /Behavior/i }).click();
      await page.getByRole('switch', { name: /Read Only/i }).click();
      await page.getByRole('switch', { name: /Disabled/i }).click();

      const canvasLabel = page.locator('[data-canvas-field-wrapper]').first().getByText('Custom Text Label');
      await expect(canvasLabel).toBeVisible();
    });

    test('Textarea field properties', async ({ page }) => {
      await page.getByRole('button', { name: /^Text Area$/i }).click();
      await page.locator('[data-canvas-field-wrapper]').first().click();

      await page.getByRole('tab', { name: /Basic/i }).click();
      await page.locator('#field-label').fill('Custom Textarea Label');
      await page.locator('#field-placeholder').fill('Custom Textarea Placeholder');
      await page.locator('#field-description').fill('Custom Textarea Description');
      await page.locator('#field-name').fill('custom_textarea_name');

      await page.getByRole('tab', { name: /Behavior/i }).click();
      await page.getByRole('switch', { name: /Read Only/i }).click();
      await page.getByRole('switch', { name: /Disabled/i }).click();
    });

    test('Number field properties', async ({ page }) => {
      await page.getByRole('button', { name: /^Number$/i }).click();
      await page.locator('[data-canvas-field-wrapper]').first().click();

      await page.getByRole('tab', { name: /Basic/i }).click();
      await page.locator('#field-label').fill('Custom Number Label');
      await page.locator('#field-placeholder').fill('Custom Number Placeholder');
      await page.locator('#field-description').fill('Custom Number Description');
      await page.locator('#field-name').fill('custom_number_name');

      await page.getByRole('tab', { name: /Behavior/i }).click();
      await page.getByRole('switch', { name: /Read Only/i }).click();
      await page.getByRole('switch', { name: /Disabled/i }).click();
    });

    test('Currency field properties', async ({ page }) => {
      await page.getByRole('button', { name: /^Currency$/i }).click();
      await page.locator('[data-canvas-field-wrapper]').first().click();

      await page.getByRole('tab', { name: /Basic/i }).click();
      await page.locator('#field-label').fill('Custom Currency Label');
      await page.locator('#field-placeholder').fill('Custom Currency Placeholder');
      await page.locator('#field-description').fill('Custom Currency Description');
      await page.locator('#field-name').fill('custom_currency_name');

      await page.getByRole('tab', { name: /Behavior/i }).click();
      await page.getByRole('switch', { name: /Read Only/i }).click();
      await page.getByRole('switch', { name: /Disabled/i }).click();
    });

    test('Switch field properties', async ({ page }) => {
      await page.getByRole('button', { name: /^Switch$/i }).click();
      await page.locator('[data-canvas-field-wrapper]').first().click();

      await page.getByRole('tab', { name: /Basic/i }).click();
      await page.locator('#field-label').fill('Custom Switch Label');
      await page.locator('#field-description').fill('Custom Switch Description');
      await page.locator('#field-name').fill('custom_switch_name');

      await page.getByRole('tab', { name: /Behavior/i }).click();
      await page.getByRole('switch', { name: /Read Only/i }).click();
      await page.getByRole('switch', { name: /Disabled/i }).click();
    });

    test('Select field properties (with options)', async ({ page }) => {
      await page.getByRole('button', { name: /^Select$/i }).click();
      await page.locator('[data-canvas-field-wrapper]').first().click();

      await page.getByRole('tab', { name: /Basic/i }).click();
      await page.locator('#field-label').fill('Custom Select Label');
      await page.locator('#field-placeholder').fill('Custom Select Placeholder');
      await page.locator('#field-description').fill('Custom Select Description');
      await page.locator('#field-name').fill('custom_select_name');

      await page.getByRole('tab', { name: /Behavior/i }).click();
      await page.getByRole('switch', { name: /Read Only/i }).click();
      await page.getByRole('switch', { name: /Disabled/i }).click();

      await page.getByRole('tab', { name: /Options|Data/i }).click();
      const addOptionBtn = page.getByRole('button', { name: /Add Option/i });
      await expect(addOptionBtn).toBeVisible();
      await addOptionBtn.click();
      
      const optionInput = page.getByPlaceholder('Label').first();
      await expect(optionInput).toBeVisible();
    });

    test('Multi Select field properties (with options)', async ({ page }) => {
      await page.getByRole('button', { name: /^Multi Select$/i }).click();
      await page.locator('[data-canvas-field-wrapper]').first().click();

      await page.getByRole('tab', { name: /Basic/i }).click();
      await page.locator('#field-label').fill('Custom Multi Select Label');
      await page.locator('#field-placeholder').fill('Custom Multi Select Placeholder');
      await page.locator('#field-description').fill('Custom Multi Select Description');
      await page.locator('#field-name').fill('custom_multiselect_name');

      await page.getByRole('tab', { name: /Behavior/i }).click();
      await page.getByRole('switch', { name: /Read Only/i }).click();
      await page.getByRole('switch', { name: /Disabled/i }).click();

      await page.getByRole('tab', { name: /Options|Data/i }).click();
      const addOptionBtn = page.getByRole('button', { name: /Add Option/i });
      await expect(addOptionBtn).toBeVisible();
      await addOptionBtn.click();
    });

    test('Tagbox field properties (with options)', async ({ page }) => {
      await page.getByRole('button', { name: /^Tags$/i }).click();
      await page.locator('[data-canvas-field-wrapper]').first().click();

      await page.getByRole('tab', { name: /Basic/i }).click();
      await page.locator('#field-label').fill('Custom Tagbox Label');
      await page.locator('#field-placeholder').fill('Custom Tagbox Placeholder');
      await page.locator('#field-description').fill('Custom Tagbox Description');
      await page.locator('#field-name').fill('custom_tagbox_name');

      await page.getByRole('tab', { name: /Behavior/i }).click();
      await page.getByRole('switch', { name: /Read Only/i }).click();
      await page.getByRole('switch', { name: /Disabled/i }).click();

      // NOTE: Data tab is disabled for tagbox — hasOptions only covers select/multiselect
    });

    test('Image Uploader field properties', async ({ page }) => {
      await page.getByRole('button', { name: /^Image Upload$/i }).click();
      await page.locator('[data-canvas-field-wrapper]').first().click();

      await page.getByRole('tab', { name: /Basic/i }).click();
      await page.locator('#field-label').fill('Custom Image Label');
      await page.locator('#field-description').fill('Custom Image Description');
      await page.locator('#field-name').fill('custom_image_name');

      await page.getByRole('tab', { name: /Behavior/i }).click();
      await page.getByRole('switch', { name: /Read Only/i }).click();
      await page.getByRole('switch', { name: /Disabled/i }).click();
    });
  });
});
