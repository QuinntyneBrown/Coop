import { type Locator, type Page, expect } from '@playwright/test';

export class ChangePasswordPage {
  readonly page: Page;

  // Layout
  readonly card: Locator;
  readonly lockIcon: Locator;
  readonly heading: Locator;
  readonly subtitle: Locator;

  // Form fields
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmNewPasswordInput: Locator;
  readonly passwordHint: Locator;

  // Actions
  readonly cancelButton: Locator;
  readonly updatePasswordButton: Locator;

  // Validation
  readonly currentPasswordError: Locator;
  readonly newPasswordError: Locator;
  readonly confirmPasswordError: Locator;
  readonly formError: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.card = page.getByTestId('change-password-card');
    this.lockIcon = page.getByTestId('change-password-icon');
    this.heading = page.getByTestId('change-password-heading');
    this.subtitle = page.getByTestId('change-password-subtitle');

    this.currentPasswordInput = page.getByTestId('change-password-current');
    this.newPasswordInput = page.getByTestId('change-password-new');
    this.confirmNewPasswordInput = page.getByTestId('change-password-confirm');
    this.passwordHint = page.getByTestId('change-password-hint');

    this.cancelButton = page.getByTestId('change-password-cancel');
    this.updatePasswordButton = page.getByTestId('change-password-submit');

    this.currentPasswordError = page.getByTestId('change-password-current-error');
    this.newPasswordError = page.getByTestId('change-password-new-error');
    this.confirmPasswordError = page.getByTestId('change-password-confirm-error');
    this.formError = page.getByTestId('change-password-form-error');
    this.successMessage = page.getByTestId('change-password-success');
  }

  async goto() {
    await this.page.goto('/change-password');
  }

  async changePassword(current: string, newPassword: string, confirmPassword?: string) {
    await this.currentPasswordInput.fill(current);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmNewPasswordInput.fill(confirmPassword ?? newPassword);
    await this.updatePasswordButton.click();
  }

  async expectPageVisible() {
    await expect(this.card).toBeVisible();
    await expect(this.lockIcon).toBeVisible();
    await expect(this.heading).toHaveText('Change Password');
    await expect(this.subtitle).toContainText('current password');
    await expect(this.passwordHint).toContainText('8 characters');
  }

  async expectFormVisible() {
    await expect(this.currentPasswordInput).toBeVisible();
    await expect(this.newPasswordInput).toBeVisible();
    await expect(this.confirmNewPasswordInput).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
    await expect(this.updatePasswordButton).toBeVisible();
  }
}
