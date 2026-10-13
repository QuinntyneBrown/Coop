import { type Locator, type Page, expect } from '@playwright/test';

export class SettingsPage {
  readonly page: Page;

  // Tabs
  readonly themeTab: Locator;
  readonly contentTab: Locator;
  readonly accountTab: Locator;

  // Theme tab
  readonly themeHeading: Locator;
  readonly themeSubtitle: Locator;
  readonly scopeSelect: Locator;
  readonly primaryColorInput: Locator;
  readonly backgroundColorInput: Locator;
  readonly accentColorInput: Locator;
  readonly textColorInput: Locator;
  readonly primaryColorSwatch: Locator;
  readonly backgroundColorSwatch: Locator;
  readonly accentColorSwatch: Locator;
  readonly textColorSwatch: Locator;
  readonly resetToDefaultLink: Locator;
  readonly saveThemeButton: Locator;
  readonly themePreview: Locator;

  // Success/error messages
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.themeTab = page.getByTestId('settings-tab-theme');
    this.contentTab = page.getByTestId('settings-tab-content');
    this.accountTab = page.getByTestId('settings-tab-account');

    this.themeHeading = page.getByTestId('theme-heading');
    this.themeSubtitle = page.getByTestId('theme-subtitle');
    this.scopeSelect = page.getByTestId('theme-scope-select');
    this.primaryColorInput = page.getByTestId('theme-primary-color');
    this.backgroundColorInput = page.getByTestId('theme-background-color');
    this.accentColorInput = page.getByTestId('theme-accent-color');
    this.textColorInput = page.getByTestId('theme-text-color');
    this.primaryColorSwatch = page.getByTestId('theme-primary-swatch');
    this.backgroundColorSwatch = page.getByTestId('theme-background-swatch');
    this.accentColorSwatch = page.getByTestId('theme-accent-swatch');
    this.textColorSwatch = page.getByTestId('theme-text-swatch');
    this.resetToDefaultLink = page.getByTestId('theme-reset-default');
    this.saveThemeButton = page.getByTestId('theme-save-button');
    this.themePreview = page.getByTestId('theme-preview');

    this.successMessage = page.getByTestId('settings-success-message');
    this.errorMessage = page.getByTestId('settings-error-message');
  }

  async goto() {
    await this.page.goto('/settings');
  }

  async expectPageLoaded() {
    await expect(this.themeTab).toBeVisible();
    await expect(this.contentTab).toBeVisible();
    await expect(this.accountTab).toBeVisible();
  }

  async switchTab(tab: 'theme' | 'content' | 'account') {
    const tabMap: Record<string, Locator> = {
      theme: this.themeTab,
      content: this.contentTab,
      account: this.accountTab,
    };
    await tabMap[tab].click();
  }

  async expectThemeTabVisible() {
    await expect(this.themeHeading).toHaveText('Theme Customization');
    await expect(this.themeSubtitle).toContainText('CSS custom properties');
    await expect(this.primaryColorInput).toBeVisible();
    await expect(this.saveThemeButton).toBeVisible();
    await expect(this.themePreview).toBeVisible();
  }

  async setThemeColors(options: {
    primary?: string;
    background?: string;
    accent?: string;
    text?: string;
  }) {
    if (options.primary) {
      await this.primaryColorInput.fill(options.primary);
    }
    if (options.background) {
      await this.backgroundColorInput.fill(options.background);
    }
    if (options.accent) {
      await this.accentColorInput.fill(options.accent);
    }
    if (options.text) {
      await this.textColorInput.fill(options.text);
    }
  }

  async saveTheme() {
    await this.saveThemeButton.click();
  }

  async resetTheme() {
    await this.resetToDefaultLink.click();
  }

  async expectSuccess() {
    await expect(this.successMessage).toBeVisible();
  }

  async selectScope(scope: string) {
    await this.scopeSelect.selectOption(scope);
  }
}
