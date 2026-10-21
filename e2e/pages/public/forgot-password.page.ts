import { type Locator, type Page } from '@playwright/test';

export class ForgotPasswordPage {
  readonly page: Page;

  readonly signInLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signInLink = page.getByRole('link', { name: 'Back to Sign In' });
  }

  async goto() {
    await this.page.goto('/forgot-password');
  }
}
