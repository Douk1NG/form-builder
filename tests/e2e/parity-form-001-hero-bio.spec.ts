import { test, expect } from '@playwright/test';

/**
 * FORM-001: Hero Bio Page — Parity Test
 *
 * Reference: tests/parity/screenshots/hero-bio-pa.png
 * Analysis:  tests/parity/forms/FORM-001-hero-bio.md
 *
 * This test builds the Hero Bio form structurally using nested layouts,
 * custom styles, and avatar mode, then switches to preview mode for visual comparison.
 *
 * Layout target:
 * - Outer 2-column layout (Left: Profile details, Right: Professional Bio textarea)
 * - Left panel nested structure:
 *   - Row 1 (2-column layout):
 *     - Col 1: Profile Photo (circular avatar)
 *     - Col 2: Name & Surname stacked vertically
 *   - Row 2 (full-width text input):
 *     - Professional Title
 */

test.describe('FORM-001: Hero Bio Page — Parity Test', () => {
  test.use({ viewport: { width: 1280, height: 1600 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('textbox').fill('Hero Bio');
    await dialog.getByRole('button', { name: /create/i }).click();
    await expect(dialog).not.toBeVisible();
  });

  test('builds the Hero Bio form structure and previews it', async ({ page }) => {
    // ── Step 1: Set Form-level Styling (Cream Background) ──
    await page.locator('#form-bg-color').fill('#fdfbf7');

    // ── Step 2: Add Profile Outer Section (2-columns, borderless, hide header) ──
    // Clicking "2 Columns" creates a row group and AUTO-LOCKS it
    await page.locator('aside').getByRole('button', { name: /^2 Columns$/i }).click();
    const outerRowHeader = page.locator('[data-canvas-group]').first();
    await outerRowHeader.click();
    await page.getByRole('switch', { name: /borderless/i }).click();
    await page.getByRole('switch', { name: /hide header/i }).click();

    // ── Step 3: Add Left Container Group (Col 1 of Outer Row) ──
    // Click Field Group → goes inside locked Outer Row, auto-locks Left Container
    await page.locator('aside').getByRole('button', { name: /^Field Group$/i }).click();
    const leftContainerHeader = page.locator('[data-canvas-group]').nth(1);
    await leftContainerHeader.click();
    // Profile group container HAS border (borderless=false) but hides its title header
    await page.getByRole('switch', { name: /hide header/i }).click();

    // ── Step 4: Add Row 1 (Photo + Names row) (inside Left Container) ──
    // Click "2 Columns" → goes inside locked Left Container, auto-locks Row 1
    await page.locator('aside').getByRole('button', { name: /^2 Columns$/i }).click();
    const row1Header = page.locator('[data-canvas-group]').nth(2);
    await row1Header.click();
    // Inner layout row is borderless and hides its title header
    await page.getByRole('switch', { name: /borderless/i }).click();
    await page.getByRole('switch', { name: /hide header/i }).click();

    // Add Profile Photo (goes inside locked Row 1, Col 1)
    await page.locator('aside').getByRole('button', { name: /^Image Upload$/i }).click();
    await page.locator('[data-canvas-field-wrapper]').first().click();
    await page.getByRole('tab', { name: /Basic/i }).click();
    await page.locator('#field-label').fill('Profile Photo');
    await page.locator('#field-name').fill('profile_photo');
    await page.getByRole('switch', { name: /avatar mode/i }).click();

    // Add Name Stack Group (goes inside locked Row 1, Col 2)
    // Hide header so the group title bar doesn't show in the rendered form
    await page.locator('aside').getByRole('button', { name: /^Field Group$/i }).click();
    const nameStackHeader = page.locator('[data-canvas-group]').nth(3);
    await nameStackHeader.click();
    await page.getByRole('switch', { name: /hide header/i }).click();

    // Add Name field (goes inside locked Name Stack)
    await page.locator('aside').getByRole('button', { name: /^Text Input$/i }).click();
    await page.waitForTimeout(200);
    await page.locator('[data-canvas-field-wrapper]').nth(1).evaluate(element => (element as HTMLElement).click());
    await expect(page.locator('#field-label')).toBeVisible({ timeout: 5000 });
    await page.locator('#field-label').fill('Name');
    await page.locator('#field-name').fill('name');

    // Add Surname field (goes inside locked Name Stack)
    await page.locator('aside').getByRole('button', { name: /^Text Input$/i }).click();
    await page.waitForTimeout(200);
    await page.locator('[data-canvas-field-wrapper]').nth(2).evaluate(element => (element as HTMLElement).click());
    await expect(page.locator('#field-label')).toBeVisible({ timeout: 5000 });
    await page.getByRole('tab', { name: /Basic/i }).click();
    await page.locator('#field-label').fill('Surname');
    await page.locator('#field-name').fill('surname');

    // Unlock Name Stack (clears lock)
    await nameStackHeader.locator('button[title*="Unlock group"]').click();
    
    // Re-lock Left Container to add Professional Title below Row 1
    await leftContainerHeader.locator('button[title*="Lock group"]').click();

    // Add Professional Title field (goes inside locked Left Container)
    await page.locator('aside').getByRole('button', { name: /^Text Input$/i }).click();
    await page.locator('[data-canvas-field-wrapper]').nth(3).click();
    await page.getByRole('tab', { name: /Basic/i }).click();
    await page.locator('#field-label').fill('Professional Title');
    await page.locator('#field-name').fill('professional_title');

    // Unlock Left Container
    await leftContainerHeader.locator('button[title*="Unlock group"]').click();

    // Re-lock Outer Row so Bio goes to Col 2
    await outerRowHeader.locator('button[title*="Lock group"]').click();

    // Add Professional Bio (goes inside locked Outer Row)
    await page.locator('aside').getByRole('button', { name: /^Text Area$/i }).click();
    await page.locator('[data-canvas-field-wrapper]').nth(4).click();
    await page.getByRole('tab', { name: /Basic/i }).click();
    await page.locator('#field-label').fill('Professional Bio');
    await page.locator('#field-placeholder').fill('Tell us about yourself...');
    await page.locator('#field-name').fill('professional_bio');

    // Unlock Outer Row
    await outerRowHeader.locator('button[title*="Unlock group"]').click();

    // ── Step 6: Add 2-Column bottom layout row for Contact/Links ──
    // Creates at top level (no lock active), AUTO-LOCKS the new bottom row
    await page.locator('aside').getByRole('button', { name: /^2 Columns$/i }).click();
    
    // Select the bottom row header to configure it (index 4 in the groups tree now)
    const bottomRowHeader = page.locator('[data-canvas-group]').nth(4);
    await bottomRowHeader.click();
    await page.getByRole('switch', { name: /borderless/i }).click();
    await page.getByRole('switch', { name: /hide header/i }).click();

    // ── Step 7: Add Contact Group (col 1 of bottom row) ──
    // "Field Group" inside locked bottom row → creates Contact, AUTO-LOCKS Contact
    await page.locator('aside').getByRole('button', { name: /^Field Group$/i }).click();
    const contactGroupHeader = page.locator('[data-canvas-group]').nth(5);
    await contactGroupHeader.click();
    await page.locator('#group-label').fill('Contact');

    // Add Contact fields
    await page.locator('aside').getByRole('button', { name: /^Text Input$/i }).click();
    await page.locator('[data-canvas-field-wrapper]').nth(5).click();
    await page.getByRole('tab', { name: /Basic/i }).click();
    await page.locator('#field-label').fill('Email');
    await page.locator('#field-placeholder').fill('your@email.com');
    await page.locator('#field-name').fill('email');

    await page.locator('aside').getByRole('button', { name: /^Text Input$/i }).click();
    await page.locator('[data-canvas-field-wrapper]').nth(6).click();
    await page.getByRole('tab', { name: /Basic/i }).click();
    await page.locator('#field-label').fill('Phone');
    await page.locator('#field-placeholder').fill('+34 000 000 000');
    await page.locator('#field-name').fill('phone');

    await page.locator('aside').getByRole('button', { name: /^Text Input$/i }).click();
    await page.locator('[data-canvas-field-wrapper]').nth(7).click();
    await page.getByRole('tab', { name: /Basic/i }).click();
    await page.locator('#field-label').fill('Location');
    await page.locator('#field-name').fill('location');

    // Unlock Contact Group
    await contactGroupHeader.locator('button[title*="Unlock group"]').click();

    // Re-lock the bottom row so Links group goes into it
    await bottomRowHeader.locator('button[title*="Lock group"]').click();

    // ── Step 8: Add Links Group (col 2 of bottom row) ──
    // "Field Group" inside re-locked bottom row → creates Links, AUTO-LOCKS Links
    await page.locator('aside').getByRole('button', { name: /^Field Group$/i }).click();
    const linksGroupHeader = page.locator('[data-canvas-group]').nth(6);
    await linksGroupHeader.click();
    await page.locator('#group-label').fill('Links');

    // Add Link fields
    await page.locator('aside').getByRole('button', { name: /^Text Input$/i }).click();
    await page.locator('[data-canvas-field-wrapper]').nth(8).click();
    await page.getByRole('tab', { name: /Basic/i }).click();
    await page.locator('#field-label').fill('LinkedIn');
    await page.locator('#field-placeholder').fill('https://linkedin.com/in/...');
    await page.locator('#field-name').fill('linkedin');

    await page.locator('aside').getByRole('button', { name: /^Text Input$/i }).click();
    await page.locator('[data-canvas-field-wrapper]').nth(9).click();
    await page.getByRole('tab', { name: /Basic/i }).click();
    await page.locator('#field-label').fill('GitHub');
    await page.locator('#field-placeholder').fill('https://github.com/...');
    await page.locator('#field-name').fill('github');

    await page.locator('aside').getByRole('button', { name: /^Text Input$/i }).click();
    await page.locator('[data-canvas-field-wrapper]').nth(10).click();
    await page.getByRole('tab', { name: /Basic/i }).click();
    await page.locator('#field-label').fill('Portfolio');
    await page.locator('#field-placeholder').fill('https://...');
    await page.locator('#field-name').fill('portfolio');

    // Unlock Links Group (clears the lock entirely)
    await linksGroupHeader.locator('button[title*="Unlock group"]').click();

    // ── Step 9: Switch to Preview mode ──
    await page.getByRole('button', { name: 'Preview', exact: true }).click();

    // ── Step 10: Verify all fields render in preview ──
    await expect(page.getByText('Profile Photo')).toBeVisible();
    await expect(page.getByText('Name', { exact: true })).toBeVisible();
    await expect(page.getByText('Surname')).toBeVisible();
    await expect(page.getByText('Professional Title')).toBeVisible();
    await expect(page.getByText('Professional Bio')).toBeVisible();
    await expect(page.getByText('Email')).toBeVisible();
    await expect(page.getByText('Phone')).toBeVisible();
    await expect(page.getByText('Location')).toBeVisible();
    await expect(page.getByText('LinkedIn')).toBeVisible();
    await expect(page.getByText('GitHub')).toBeVisible();
    await expect(page.getByText('Portfolio')).toBeVisible();

    // Contact and Links section headers
    await expect(page.getByText('Contact')).toBeVisible();
    await expect(page.getByText('Links')).toBeVisible();

    // ── Step 11: Take screenshot for visual comparison ──
    await page.locator('[data-preview-frame="true"]').screenshot({
      path: 'tests/parity/screenshots/form-001-result.png',
    });
  });

  test('exports Hero Bio form JSON with correct structure', async ({ page }) => {
    // Quick build: add profile photo with avatar mode + name + surname
    await page.locator('aside').getByRole('button', { name: /^Image Upload$/i }).click();
    await page.locator('[data-canvas-field-wrapper]').first().click();
    await page.locator('#field-label').fill('Profile Photo');
    await page.locator('#field-name').fill('profile_photo');
    await page.getByRole('switch', { name: /avatar mode/i }).click();

    await page.locator('aside').getByRole('button', { name: /^Text Input$/i }).click();
    await page.locator('[data-canvas-field-wrapper]').nth(1).click();
    await page.locator('#field-label').fill('Name');
    await page.locator('#field-name').fill('name');

    await page.locator('aside').getByRole('button', { name: /^Text Input$/i }).click();
    await page.locator('[data-canvas-field-wrapper]').nth(2).click();
    await page.locator('#field-label').fill('Surname');
    await page.locator('#field-name').fill('surname');

    // Export and verify
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Export JSON/i }).click();
    const download = await downloadPromise;

    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();

    const fileContent = await (await download.createReadStream()).toArray();
    const jsonString = Buffer.concat(fileContent).toString('utf-8');
    const exportedSchema = JSON.parse(jsonString);

    expect(exportedSchema.title).toBe('Hero Bio');

    const profilePhotoField = exportedSchema.items.find((item: Record<string, unknown>) => item.name === 'profile_photo');
    expect(profilePhotoField).toBeTruthy();
    expect(profilePhotoField.avatarMode).toBe(true);

    const nameField = exportedSchema.items.find((item: Record<string, unknown>) => item.name === 'name');
    expect(nameField).toBeTruthy();
    expect(nameField.type).toBe('text');
  });
});
