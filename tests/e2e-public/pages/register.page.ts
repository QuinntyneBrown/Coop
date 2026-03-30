import { type Locator, type Page, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;

  // Header
  readonly header: Locator;
  readonly headerTitle: Locator;
  readonly headerSubtitle: Locator;

  // Form
  readonly heading: Locator;
  readonly invitationTokenInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly termsCheckbox: Locator;
  readonly termsLabel: Locator;
  readonly createAccountButton: Locator;
  readonly signInLink: Locator;

  // Validation errors
  readonly tokenError: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;
  readonly confirmPasswordError: Locator;
  readonly termsError: Locator;
  readonly registrationError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.header = page.locator('[data-testid="register-header"]');
    this.headerTitle = page.locator('[data-testid="register-header-title"]');
    this.headerSubtitle = page.locator('[data-testid="register-header-subtitle"]');

    this.heading = page.locator('[data-testid="register-heading"]');
    this.invitationTokenInput = page.locator('[data-testid="register-invitation-token"]');
    this.usernameInput = page.locator('[data-testid="register-username"]');
    this.passwordInput = page.locator('[data-testid="register-password"]');
    this.confirmPasswordInput = page.locator('[data-testid="register-confirm-password"]');
    this.termsCheckbox = page.locator('[data-testid="register-terms-checkbox"]');
    this.termsLabel = page.locator('[data-testid="register-terms-label"]');
    this.createAccountButton = page.locator('[data-testid="register-create-account-btn"]');
    this.signInLink = page.locator('[data-testid="register-sign-in-link"]');

    this.tokenError = page.locator('[data-testid="register-token-error"]');
    this.usernameError = page.locator('[data-testid="register-username-error"]');
    this.passwordError = page.locator('[data-testid="register-password-error"]');
    this.confirmPasswordError = page.locator('[data-testid="register-confirm-password-error"]');
    this.termsError = page.locator('[data-testid="register-terms-error"]');
    this.registrationError = page.locator('[data-testid="register-error"]');
  }

  async goto() {
    await this.page.goto('/register');
  }

  async expectLoaded() {
    await expect(this.header).toBeVisible();
    await expect(this.heading).toBeVisible();
    await expect(this.invitationTokenInput).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
    await expect(this.termsCheckbox).toBeVisible();
    await expect(this.createAccountButton).toBeVisible();
  }

  async expectHeaderContent() {
    await expect(this.headerTitle).toHaveText('Coop');
    await expect(this.headerSubtitle).toHaveText('Join your cooperative');
    await expect(this.heading).toHaveText('Create account');
  }

  async fillForm(data: {
    token: string;
    username: string;
    password: string;
    confirmPassword: string;
    acceptTerms?: boolean;
  }) {
    await this.invitationTokenInput.fill(data.token);
    await this.usernameInput.fill(data.username);
    await this.passwordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.confirmPassword);
    if (data.acceptTerms !== false) {
      await this.termsCheckbox.check();
    }
  }

  async submit() {
    await this.createAccountButton.click();
  }

  async register(data: {
    token: string;
    username: string;
    password: string;
    confirmPassword: string;
    acceptTerms?: boolean;
  }) {
    await this.fillForm(data);
    await this.submit();
  }

  async navigateToSignIn() {
    await this.signInLink.click();
    await this.page.waitForURL('**/login');
  }

  async expectPasswordMismatchError() {
    await expect(this.confirmPasswordError).toBeVisible();
    await expect(this.confirmPasswordError).toContainText(/match/i);
  }

  async expectTermsRequired() {
    await expect(this.termsError).toBeVisible();
  }
}
