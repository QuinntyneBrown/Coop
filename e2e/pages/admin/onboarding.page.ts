import { type Locator, type Page, expect } from '@playwright/test';

export class OnboardingPage {
  readonly page: Page;
  readonly currentStep: Locator;
  readonly welcomeTitle: Locator;
  readonly getStartedButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly nextButton: Locator;
  readonly skipButton: Locator;
  readonly unitOptions: Locator;
  readonly confirmation: Locator;
  readonly goToDashboardButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.currentStep = page.getByTestId('onboarding-current-step');
    this.welcomeTitle = page.getByTestId('onboarding-welcome-title');
    this.getStartedButton = page.getByTestId('onboarding-get-started-btn');
    this.firstNameInput = page.getByTestId('onboarding-first-name');
    this.lastNameInput = page.getByTestId('onboarding-last-name');
    this.emailInput = page.getByTestId('onboarding-email');
    this.phoneInput = page.getByTestId('onboarding-phone');
    this.nextButton = page.getByTestId('onboarding-next-btn');
    this.skipButton = page.getByTestId('onboarding-skip-btn');
    this.unitOptions = page.getByTestId('onboarding-unit-option');
    this.confirmation = page.getByTestId('onboarding-confirmation');
    this.goToDashboardButton = page.getByTestId('onboarding-go-to-dashboard-btn');
  }

  async goto() {
    await this.page.goto('/onboarding');
    await expect(this.welcomeTitle).toBeVisible();
  }

  async fillProfile(firstName: string, lastName: string, email = '', phone = '') {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
  }
}
