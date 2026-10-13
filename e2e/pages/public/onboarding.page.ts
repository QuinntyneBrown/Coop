import { type Locator, type Page, expect } from '@playwright/test';

export class OnboardingPage {
  readonly page: Page;

  // Steps
  readonly stepIndicator: Locator;
  readonly currentStep: Locator;

  // Welcome step
  readonly welcomeTitle: Locator;
  readonly welcomeMessage: Locator;
  readonly getStartedButton: Locator;

  // Profile setup step
  readonly profileSection: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly avatarUpload: Locator;

  // Unit selection step
  readonly unitSection: Locator;
  readonly unitSelector: Locator;
  readonly unitOptions: Locator;

  // Confirmation step
  readonly confirmationSection: Locator;
  readonly confirmationMessage: Locator;
  readonly goToDashboardButton: Locator;

  // Navigation
  readonly nextButton: Locator;
  readonly backButton: Locator;
  readonly skipButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.stepIndicator = page.locator('[data-testid="onboarding-step-indicator"]');
    this.currentStep = page.locator('[data-testid="onboarding-current-step"]');

    this.welcomeTitle = page.locator('[data-testid="onboarding-welcome-title"]');
    this.welcomeMessage = page.locator('[data-testid="onboarding-welcome-message"]');
    this.getStartedButton = page.locator('[data-testid="onboarding-get-started-btn"]');

    this.profileSection = page.locator('[data-testid="onboarding-profile-section"]');
    this.firstNameInput = page.locator('[data-testid="onboarding-first-name"]');
    this.lastNameInput = page.locator('[data-testid="onboarding-last-name"]');
    this.emailInput = page.locator('[data-testid="onboarding-email"]');
    this.phoneInput = page.locator('[data-testid="onboarding-phone"]');
    this.avatarUpload = page.locator('[data-testid="onboarding-avatar-upload"]');

    this.unitSection = page.locator('[data-testid="onboarding-unit-section"]');
    this.unitSelector = page.locator('[data-testid="onboarding-unit-selector"]');
    this.unitOptions = page.locator('[data-testid="onboarding-unit-option"]');

    this.confirmationSection = page.locator('[data-testid="onboarding-confirmation"]');
    this.confirmationMessage = page.locator('[data-testid="onboarding-confirmation-message"]');
    this.goToDashboardButton = page.locator('[data-testid="onboarding-go-to-dashboard-btn"]');

    this.nextButton = page.locator('[data-testid="onboarding-next-btn"]');
    this.backButton = page.locator('[data-testid="onboarding-back-btn"]');
    this.skipButton = page.locator('[data-testid="onboarding-skip-btn"]');
  }

  async goto() {
    await this.page.goto('/onboarding');
  }

  async expectWelcomeStep() {
    await expect(this.welcomeTitle).toBeVisible();
    await expect(this.welcomeMessage).toBeVisible();
    await expect(this.getStartedButton).toBeVisible();
  }

  async expectProfileStep() {
    await expect(this.profileSection).toBeVisible();
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
  }

  async fillProfile(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    if (data.phone) {
      await this.phoneInput.fill(data.phone);
    }
  }

  async selectUnit(index: number) {
    await this.unitOptions.nth(index).click();
  }

  async completeOnboarding(profileData: {
    firstName: string;
    lastName: string;
    email: string;
  }) {
    await this.getStartedButton.click();
    await this.fillProfile(profileData);
    await this.nextButton.click();
    await this.unitOptions.first().click();
    await this.nextButton.click();
    await this.goToDashboardButton.click();
    await this.page.waitForURL('**/dashboard');
  }

  async expectConfirmationStep() {
    await expect(this.confirmationSection).toBeVisible();
    await expect(this.confirmationMessage).toBeVisible();
    await expect(this.goToDashboardButton).toBeVisible();
  }
}
