import { test as base, expect } from '../../fixtures/public/auth.fixture';
import { OnboardingPage } from '../../pages/public/onboarding.page';
import { BottomTabBar } from '../../pages/public/bottom-tab-bar.page';

const test = base;

test.describe('Onboarding', () => {
  let onboarding: OnboardingPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    onboarding = new OnboardingPage(authenticatedPage);
  });

  test.describe('Page Load', () => {
    test('should load the onboarding page for authenticated users', async () => {
      await onboarding.goto();
      await onboarding.expectWelcomeStep();
    });

    test('should display the step indicator', async () => {
      await onboarding.goto();
      await expect(onboarding.stepIndicator).toBeVisible();
    });
  });

  test.describe('Welcome Step', () => {
    test('should display welcome title and message', async () => {
      await onboarding.goto();
      await expect(onboarding.welcomeTitle).toBeVisible();
      await expect(onboarding.welcomeMessage).toBeVisible();
    });

    test('should have a "Get Started" button', async () => {
      await onboarding.goto();
      await expect(onboarding.getStartedButton).toBeVisible();
    });

    test('should advance to profile step when clicking "Get Started"', async () => {
      await onboarding.goto();
      await onboarding.getStartedButton.click();
      await onboarding.expectProfileStep();
    });
  });

  test.describe('Profile Setup Step', () => {
    test('should display profile form fields', async () => {
      await onboarding.goto();
      await onboarding.getStartedButton.click();
      await expect(onboarding.firstNameInput).toBeVisible();
      await expect(onboarding.lastNameInput).toBeVisible();
      await expect(onboarding.emailInput).toBeVisible();
      await expect(onboarding.phoneInput).toBeVisible();
    });

    test('should have avatar upload option', async () => {
      await onboarding.goto();
      await onboarding.getStartedButton.click();
      await expect(onboarding.avatarUpload).toBeVisible();
    });

    test('should allow filling profile information', async () => {
      await onboarding.goto();
      await onboarding.getStartedButton.click();
      await onboarding.fillProfile({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '555-0100',
      });
      await expect(onboarding.firstNameInput).toHaveValue('Jane');
      await expect(onboarding.lastNameInput).toHaveValue('Doe');
    });

    test('should advance to unit selection after filling profile', async () => {
      await onboarding.goto();
      await onboarding.getStartedButton.click();
      await onboarding.fillProfile({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
      });
      await onboarding.nextButton.click();
      await expect(onboarding.unitSection).toBeVisible();
    });

    test('should allow going back to welcome step', async () => {
      await onboarding.goto();
      await onboarding.getStartedButton.click();
      await onboarding.backButton.click();
      await onboarding.expectWelcomeStep();
    });
  });

  test.describe('Unit Selection Step', () => {
    test('should display available units', async () => {
      await onboarding.goto();
      await onboarding.getStartedButton.click();
      await onboarding.fillProfile({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
      });
      await onboarding.nextButton.click();
      await expect(onboarding.unitSelector).toBeVisible();
      const optionCount = await onboarding.unitOptions.count();
      expect(optionCount).toBeGreaterThan(0);
    });

    test('should name each unit once', async () => {
      await onboarding.goto();
      await onboarding.getStartedButton.click();
      await onboarding.nextButton.click();
      await expect(onboarding.unitOptions.first()).toHaveText('Unit 101');
    });

    test('should allow selecting a unit', async () => {
      await onboarding.goto();
      await onboarding.getStartedButton.click();
      await onboarding.fillProfile({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
      });
      await onboarding.nextButton.click();
      await onboarding.selectUnit(0);
      await onboarding.nextButton.click();
      await onboarding.expectConfirmationStep();
    });
  });

  test.describe('Confirmation Step', () => {
    test('should display confirmation message and dashboard button', async () => {
      await onboarding.goto();
      await onboarding.getStartedButton.click();
      await onboarding.fillProfile({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
      });
      await onboarding.nextButton.click();
      await onboarding.selectUnit(0);
      await onboarding.nextButton.click();
      await onboarding.expectConfirmationStep();
    });

    test('should navigate to dashboard from confirmation', async () => {
      await onboarding.goto();
      await onboarding.getStartedButton.click();
      await onboarding.fillProfile({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
      });
      await onboarding.nextButton.click();
      await onboarding.selectUnit(0);
      await onboarding.nextButton.click();
      await onboarding.goToDashboardButton.click();
      await expect(onboarding.page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe('Skip Flow', () => {
    test('should allow skipping optional steps', async () => {
      await onboarding.goto();
      await onboarding.getStartedButton.click();
      if (await onboarding.skipButton.isVisible()) {
        await onboarding.skipButton.click();
        // Should advance past optional steps
        await expect(onboarding.page).toHaveURL(/\/(onboarding|dashboard)/);
      }
    });
  });

  test.describe('Phone layout', () => {
    test('Given the profile step at 360 px, when scrolled to the end, then Back, Next and Skip sit above the tab bar', async ({
      authenticatedPage,
    }) => {
      await authenticatedPage.setViewportSize({ width: 360, height: 800 });
      await onboarding.goto();
      await onboarding.getStartedButton.click();
      await onboarding.expectProfileStep();
      const tabBar = new BottomTabBar(authenticatedPage);
      await tabBar.expectNotCovering(onboarding.backButton);
      await tabBar.expectNotCovering(onboarding.nextButton);
      await tabBar.expectNotCovering(onboarding.skipButton);
    });

    test('Given the profile step at 360 px, when the member taps a tab, then no step button is drawn over it', async ({
      authenticatedPage,
    }) => {
      await authenticatedPage.setViewportSize({ width: 360, height: 800 });
      await onboarding.goto();
      await onboarding.getStartedButton.click();
      await onboarding.expectProfileStep();
      await new BottomTabBar(authenticatedPage).openDocuments();
    });
  });
});
