import { test, expect } from '@playwright/test';

test.describe('Form Builder - Use Cases', () => {
  
  test('UC1: Ask for form name on first load', async ({ page }) => {
    await page.goto('/');
    
    // First thing: if I have no forms in storage, ask for form name
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    
    // Happy Path: Type a name and create the form
    await dialog.getByRole('textbox').fill('My First Form');
    await dialog.getByRole('button', { name: /create/i }).click();
    await expect(dialog).not.toBeVisible();
    
    // Now that the form is created, the canvas should be visible and ready for dragging
    const canvasArea = page.getByText(/Drag & Drop fields here/i);
    await expect(canvasArea).toBeVisible();
  });
});
