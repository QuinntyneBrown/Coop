// Acceptance Test
// Traces to: L2-REQ-112, L2-REQ-114, L2-REQ-044
// Description: A member who has just registered is welcomed on the admin
// site's onboarding: a focused wizard without the admin menu that creates
// their own member profile and ends on their dashboard.

import { test, expect } from '../../fixtures/admin/auth.fixture';
import { OnboardingPage } from '../../pages/admin/onboarding.page';
import { MEMBER_ID } from '../../fixtures/mock-api/mock-store';

test.describe('Onboarding as a member', () => {
  let onboarding: OnboardingPage;

  test.beforeEach(async ({ memberPage }) => {
    onboarding = new OnboardingPage(memberPage);
    await onboarding.goto();
  });

  test('Given a member, when onboarding opens, then it is a focused wizard without the admin menu', async ({ memberPage }) => {
    await expect(onboarding.currentStep).toHaveText('Step 1 of 3');
    await expect(memberPage.getByTestId('sidebar')).toHaveCount(0);
    await expect(memberPage.getByTestId('bottom-tab-bar')).toHaveCount(0);
  });

  test('Given a member, when they walk through the steps, then they can go back and pick a unit', async () => {
    await onboarding.getStartedButton.click();
    await expect(onboarding.currentStep).toHaveText('Step 2 of 3');
    await onboarding.fillProfile('Ada', 'Lindqvist');
    await onboarding.nextButton.click();

    await expect(onboarding.currentStep).toHaveText('Step 3 of 3');
    await onboarding.unitOptions.first().click();
    await expect(onboarding.unitOptions.first().getByRole('radio')).toBeChecked();
  });

  test('Given a member fills in their profile, when they finish, then their own profile is created and the dashboard opens', async ({
    memberPage,
    mockApi,
  }) => {
    await onboarding.getStartedButton.click();
    await onboarding.fillProfile('Ada', 'Lindqvist', 'ada@example.test', '555-0110');
    await onboarding.nextButton.click();

    await onboarding.goToDashboardButton.click();

    await expect(memberPage).toHaveURL(/\/dashboard$/);
    const created = mockApi.store.profiles.find((p) => p.firstname === 'Ada' && p.lastname === 'Lindqvist');
    expect(created?.userId).toBe(MEMBER_ID);
  });

  test('Given a member skips the profile, when they finish, then the dashboard opens', async ({ memberPage }) => {
    await onboarding.getStartedButton.click();
    await onboarding.skipButton.click();

    await onboarding.goToDashboardButton.click();

    await expect(memberPage).toHaveURL(/\/dashboard$/);
  });
});
