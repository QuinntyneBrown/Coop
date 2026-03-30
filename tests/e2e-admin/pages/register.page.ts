import { type Locator, type Page, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;

  // Hero panel
  readonly heroPanel: Locator;
  readonly heroTitle: Locator;

  // Form panel
  readonly heading: Locator;
  readonly subtitle: Locator;

  // Form fields
  readonly invitationTokenInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly termsCheckbox: Locator;
  readonly createAccountButton: Locator;
  readonly signInLink: Locator;

  // Validation errors
  readonly tokenError: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;
  readonly confirmPasswordError: Locator;
  readonly termsError: Locator;
  readonly formError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heroPanel = page.getByTestId('register-hero-panel');
    this.heroTitle = page.getByTestId('register-hero-title');

    this.heading = page.getByTestId('register-heading');
    this.subtitle = page.getByTestId('register-subtitle');

    this.invitationTokenInput = page.getByTestId('register-invitation-token');
    this.usernameInput = page.getByTestId('register-username');
    this.passwordInput = page.getByTestId('register-password');
    this.confirmPasswordInput = page.getByTestId('register-confirm-password');
    this.termsCheckbox = page.getByTestId('register-terms');
    this.createAccountButton = page.getByTestId('register-submit');
    this.signInLink = page.getByTestId('register-signin-link');

    this.tokenError = page.getByTestId('register-token-error');
    this.usernameError = page.getByTestId('register-username-error');
    this.passwordError = page.getByTestId('register-password-error');
    this.confirmPasswordError = page.getByTestId('register-confirm-password-error');
    this.termsError = page.getByTestId('register-terms-error');
    this.formError = page.getByTestId('register-form-error');
  }

  async goto() {
    await this.page.goto('/register');
  }

  async register(token: string, username: string, password: string, confirmPassword?: string) {
    await this.invitationTokenInput.fill(token);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword ?? password);
    await this.termsCheckbox.check();
    await this.createAccountButton.click();
  }

  async expectHeroPanelVisible() {
    await expect(this.heroPanel).toBeVisible();
    await expect(this.heroTitle).toHaveText('Join Your Cooperative');
  }

  async expectFormVisible() {
    await expect(this.heading).toHaveText('Create account');
    await expect(this.subtitle).toContainText('invitation token');
    await expect(this.invitationTokenInput).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
    await expect(this.termsCheckbox).toBeVisible();
    await expect(this.createAccountButton).toBeVisible();
  }

  async expectPasswordMismatchError() {
    await expect(this.confirmPasswordError).toBeVisible();
    await expect(this.confirmPasswordError).toContainText(/match/i);
  }
}
