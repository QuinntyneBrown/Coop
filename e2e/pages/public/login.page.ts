import { type Locator, type Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // Header
  readonly header: Locator;
  readonly headerTitle: Locator;
  readonly headerSubtitle: Locator;

  // Form
  readonly welcomeHeading: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signInButton: Locator;
  readonly signUpLink: Locator;

  // Validation
  readonly usernameError: Locator;
  readonly passwordError: Locator;
  readonly loginError: Locator;

  // Mobile tab bar
  readonly bottomTabBar: Locator;
  readonly tabHome: Locator;
  readonly tabRequests: Locator;
  readonly tabDocs: Locator;
  readonly tabMessages: Locator;
  readonly tabProfile: Locator;

  constructor(page: Page) {
    this.page = page;

    this.header = page.locator('[data-testid="login-header"]');
    this.headerTitle = page.locator('[data-testid="login-header-title"]');
    this.headerSubtitle = page.locator('[data-testid="login-header-subtitle"]');

    this.welcomeHeading = page.locator('[data-testid="login-welcome-heading"]');
    this.usernameInput = page.locator('[data-testid="login-username"]');
    this.passwordInput = page.locator('[data-testid="login-password"]');
    this.forgotPasswordLink = page.locator('[data-testid="login-forgot-password"]');
    this.signInButton = page.locator('[data-testid="login-sign-in-btn"]');
    this.signUpLink = page.locator('[data-testid="login-sign-up-link"]');

    this.usernameError = page.locator('[data-testid="login-username-error"]');
    this.passwordError = page.locator('[data-testid="login-password-error"]');
    this.loginError = page.locator('[data-testid="login-error"]');

    this.bottomTabBar = page.locator('[data-testid="bottom-tab-bar"]');
    this.tabHome = page.locator('[data-testid="tab-home"]');
    this.tabRequests = page.locator('[data-testid="tab-requests"]');
    this.tabDocs = page.locator('[data-testid="tab-docs"]');
    this.tabMessages = page.locator('[data-testid="tab-messages"]');
    this.tabProfile = page.locator('[data-testid="tab-profile"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async expectLoaded() {
    await expect(this.header).toBeVisible();
    await expect(this.welcomeHeading).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async expectHeaderContent() {
    await expect(this.headerTitle).toHaveText('Coop');
    await expect(this.headerSubtitle).toHaveText('Cooperative management');
    await expect(this.welcomeHeading).toHaveText('Welcome back');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async expectValidationErrors() {
    await expect(
      this.usernameError.or(this.passwordError).first(),
    ).toBeVisible();
  }

  async expectLoginError() {
    await expect(this.loginError).toBeVisible();
  }

  async navigateToSignUp() {
    await this.signUpLink.click();
    await this.page.waitForURL('**/register');
  }

  async navigateToForgotPassword() {
    await this.forgotPasswordLink.click();
    await this.page.waitForURL('**/forgot-password');
  }

  async expectMobileTabBar() {
    await expect(this.bottomTabBar).toBeVisible();
    await expect(this.tabHome).toBeVisible();
    await expect(this.tabRequests).toBeVisible();
    await expect(this.tabDocs).toBeVisible();
    await expect(this.tabMessages).toBeVisible();
    await expect(this.tabProfile).toBeVisible();
  }
}
