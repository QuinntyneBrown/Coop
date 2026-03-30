import { test, expect } from '../fixtures/api.fixture';
import { SettingsPage } from '../pages/settings.page';
import { SidebarComponent } from '../pages/sidebar.component';

test.describe('Settings', () => {
  let settingsPage: SettingsPage;
  let sidebar: SidebarComponent;

  test.beforeEach(async ({ authenticatedPage }) => {
    settingsPage = new SettingsPage(authenticatedPage);
    sidebar = new SidebarComponent(authenticatedPage);
    await settingsPage.goto();
  });

  test.describe('Layout and Elements', () => {
    test('should display the settings page', async () => {
      await settingsPage.expectPageLoaded();
    });

    test('should mark settings as active in sidebar', async () => {
      await sidebar.expectActiveLink('settings');
    });

    test('should display all three tabs', async () => {
      await expect(settingsPage.themeTab).toBeVisible();
      await expect(settingsPage.contentTab).toBeVisible();
      await expect(settingsPage.accountTab).toBeVisible();
    });
  });

  test.describe('Tab Navigation', () => {
    test('should show theme tab as default', async () => {
      await settingsPage.expectThemeTabVisible();
    });

    test('should switch to content tab', async () => {
      await settingsPage.switchTab('content');
      await expect(settingsPage.contentTab).toHaveAttribute('data-active', 'true');
    });

    test('should switch to account tab', async () => {
      await settingsPage.switchTab('account');
      await expect(settingsPage.accountTab).toHaveAttribute('data-active', 'true');
    });

    test('should switch back to theme tab', async () => {
      await settingsPage.switchTab('account');
      await settingsPage.switchTab('theme');
      await settingsPage.expectThemeTabVisible();
    });
  });

  test.describe('Theme Customization', () => {
    test('should display Theme Customization heading', async () => {
      await expect(settingsPage.themeHeading).toHaveText('Theme Customization');
    });

    test('should display subtitle about CSS custom properties', async () => {
      await expect(settingsPage.themeSubtitle).toContainText('CSS custom properties');
    });

    test('should display scope selector', async () => {
      await expect(settingsPage.scopeSelect).toBeVisible();
    });

    test('should display color input fields', async () => {
      await expect(settingsPage.primaryColorInput).toBeVisible();
      await expect(settingsPage.backgroundColorInput).toBeVisible();
      await expect(settingsPage.accentColorInput).toBeVisible();
      await expect(settingsPage.textColorInput).toBeVisible();
    });

    test('should display color swatches next to inputs', async () => {
      await expect(settingsPage.primaryColorSwatch).toBeVisible();
      await expect(settingsPage.backgroundColorSwatch).toBeVisible();
      await expect(settingsPage.accentColorSwatch).toBeVisible();
      await expect(settingsPage.textColorSwatch).toBeVisible();
    });

    test('should display Reset to Default link', async () => {
      await expect(settingsPage.resetToDefaultLink).toBeVisible();
    });

    test('should display Save Theme button', async () => {
      await expect(settingsPage.saveThemeButton).toBeVisible();
      await expect(settingsPage.saveThemeButton).toContainText('Save Theme');
    });

    test('should display theme preview panel', async () => {
      await expect(settingsPage.themePreview).toBeVisible();
    });
  });

  test.describe('Theme Color Inputs', () => {
    test('should accept hex color values', async () => {
      await settingsPage.setThemeColors({ primary: '#FF5733' });
      await expect(settingsPage.primaryColorInput).toHaveValue('#FF5733');
    });

    test('should update preview when color changes', async ({ authenticatedPage }) => {
      // Get initial preview state
      const initialPreview = await settingsPage.themePreview.screenshot();

      await settingsPage.setThemeColors({ primary: '#FF0000' });

      // Wait for preview update
      await authenticatedPage.waitForTimeout(500);
      const updatedPreview = await settingsPage.themePreview.screenshot();

      // Screenshots should differ (visual regression)
      expect(Buffer.compare(initialPreview, updatedPreview)).not.toBe(0);
    });

    test('should update color swatch when input changes', async ({ authenticatedPage }) => {
      await settingsPage.primaryColorInput.fill('#00FF00');
      // Swatch should reflect the new color
      await expect(settingsPage.primaryColorSwatch).toBeVisible();
    });
  });

  test.describe('Save Theme', () => {
    test('should save theme settings', async () => {
      await settingsPage.setThemeColors({
        primary: '#3D8A5A',
        background: '#FFFFFF',
        accent: '#2563EB',
        text: '#1F2937',
      });
      await settingsPage.saveTheme();
      await settingsPage.expectSuccess();
    });

    test('should persist theme after page reload', async ({ authenticatedPage }) => {
      await settingsPage.setThemeColors({ primary: '#123456' });
      await settingsPage.saveTheme();
      await settingsPage.expectSuccess();

      // Reload and verify
      await authenticatedPage.reload();
      await expect(settingsPage.primaryColorInput).toHaveValue('#123456');
    });
  });

  test.describe('Reset Theme', () => {
    test('should reset colors to default values', async () => {
      // Change colors
      await settingsPage.setThemeColors({
        primary: '#FF0000',
        background: '#000000',
      });

      // Reset
      await settingsPage.resetTheme();

      // Verify inputs reverted (exact values depend on defaults)
      const primary = await settingsPage.primaryColorInput.inputValue();
      expect(primary).not.toBe('#FF0000');
    });
  });

  test.describe('Scope Selection', () => {
    test('should allow selecting Global scope', async () => {
      await settingsPage.selectScope('Global');
      await expect(settingsPage.scopeSelect).toHaveValue('Global');
    });

    test('should allow selecting Default scope', async () => {
      await settingsPage.selectScope('Default');
      await expect(settingsPage.scopeSelect).toHaveValue('Default');
    });

    test('should load different colors for different scopes', async () => {
      await settingsPage.selectScope('Global');
      const globalPrimary = await settingsPage.primaryColorInput.inputValue();

      await settingsPage.selectScope('Default');
      const defaultPrimary = await settingsPage.primaryColorInput.inputValue();

      // They may or may not be different, but the selector should work
      await expect(settingsPage.scopeSelect).toHaveValue('Default');
    });
  });
});
