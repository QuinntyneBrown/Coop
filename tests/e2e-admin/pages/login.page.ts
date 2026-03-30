import { type Locator, type Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // Hero panel
  readonly heroPanel: Locator;
  readonly heroTitle: Locator;
  readonly heroDescription: Locator;
  readonly heroIcon: Locator;

  // Form panel
  readonly formPanel: Locator;
  readonly heading: Locator;
  readonly subtitle: Locator;

  // Form fields
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signInButton: Locator;
  readonly signUpLink: Locator;

  // Validation
  readonly usernameError: Locator;
  readonly passwordError: Locator;
  readonly formError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heroPanel = page.getByTestId('login-hero-panel');
    this.heroTitle = page.getByTestId('login-hero-title');
    this.heroDescription = page.getByTestId('login-hero-description');
    this.heroIcon = page.getByTestId('login-hero-icon');

    this.formPanel = page.getByTestId('login-form-panel');
    this.heading = page.getByTestId('login-heading');
    this.subtitle = page.getByTestId('login-subtitle');

    this.usernameInput = page.getByTestId('login-username');
    this.passwordInput = page.getByTestId('login-password');
    this.rememberMeCheckbox = page.getByTestId('login-remember-me');
    this.forgotPasswordLink = page.getByTestId('login-forgot-password');
    this.signInButton = page.getByTestId('login-submit');
    this.signUpLink = page.getByTestId('login-signup-link');

    this.usernameError = page.getByTestId('login-username-error');
    this.passwordError = page.getByTestId('login-password-error');
    this.formError = page.getByTestId('login-form-error');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async loginAndWaitForDashboard(username: string, password: string) {
    await this.login(username, password);
    await this.page.waitForURL('**/dashboard');
  }

  async expectHeroPanelVisible() {
    await expect(this.heroPanel).toBeVisible();
    await expect(this.heroTitle).toHaveText('Coop Management');
    await expect(this.heroDescription).toBeVisible();
    await expect(this.heroIcon).toBeVisible();
  }

  async expectFormVisible() {
    await expect(this.heading).toHaveText('Welcome back');
    await expect(this.subtitle).toContainText('Sign in to your account');
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async expectValidationErrors() {
    await expect(this.usernameError).toBeVisible();
    await expect(this.passwordError).toBeVisible();
  }

  async expectLoginError(message?: string) {
    await expect(this.formError).toBeVisible();
    if (message) {
      await expect(this.formError).toContainText(message);
    }
  }
}
