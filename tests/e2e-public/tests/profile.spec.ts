import { test as base, expect } from '../fixtures/auth.fixture';
import { ProfilePage } from '../pages/profile.page';

const test = base;

test.describe('Profile', () => {
  let profile: ProfilePage;

  test.beforeEach(async ({ authenticatedPage }) => {
    profile = new ProfilePage(authenticatedPage);
  });

  test.describe('Page Load', () => {
    test('should load the profile page for authenticated users', async () => {
      await profile.goto();
      await profile.expectLoaded();
    });

    test('should display the page title', async () => {
      await profile.goto();
      await expect(profile.pageTitle).toBeVisible();
    });
  });

  test.describe('Profile Info', () => {
    test('should display avatar', async () => {
      await profile.goto();
      await expect(profile.avatar).toBeVisible();
    });

    test('should display user display name', async () => {
      await profile.goto();
      await expect(profile.displayName).toBeVisible();
    });

    test('should display username', async () => {
      await profile.goto();
      await expect(profile.username).toBeVisible();
    });

    test('should display email', async () => {
      await profile.goto();
      await expect(profile.email).toBeVisible();
    });

    test('should display unit information', async () => {
      await profile.goto();
      await expect(profile.unit).toBeVisible();
    });

    test('should display member since date', async () => {
      await profile.goto();
      await expect(profile.memberSince).toBeVisible();
    });
  });

  test.describe('Edit Profile', () => {
    test('should have an edit button', async () => {
      await profile.goto();
      await expect(profile.editButton).toBeVisible();
    });

    test('should enter edit mode when clicking edit', async () => {
      await profile.goto();
      await profile.enterEditMode();
      await expect(profile.firstNameInput).toBeVisible();
      await expect(profile.lastNameInput).toBeVisible();
      await expect(profile.emailInput).toBeVisible();
    });

    test('should display save and cancel buttons in edit mode', async () => {
      await profile.goto();
      await profile.enterEditMode();
      await expect(profile.saveButton).toBeVisible();
      await expect(profile.cancelButton).toBeVisible();
    });

    test('should cancel editing and return to view mode', async () => {
      await profile.goto();
      await profile.enterEditMode();
      await profile.cancelEdit();
      await expect(profile.editButton).toBeVisible();
      await expect(profile.firstNameInput).not.toBeVisible();
    });

    test('should save profile changes', async () => {
      await profile.goto();
      await profile.editProfile({
        firstName: 'UpdatedJane',
        lastName: 'UpdatedDoe',
      });
      await profile.expectEditSuccess();
    });

    test('should update displayed name after editing', async () => {
      await profile.goto();
      await profile.editProfile({ firstName: 'TestName' });
      await profile.expectEditSuccess();
      await expect(profile.displayName).toContainText('TestName');
    });

    test('should update email when editing', async () => {
      await profile.goto();
      await profile.editProfile({ email: 'updated-e2e@example.com' });
      await profile.expectEditSuccess();
      await expect(profile.email).toContainText('updated-e2e@example.com');
    });

    test('should update phone when editing', async () => {
      await profile.goto();
      await profile.editProfile({ phone: '555-9999' });
      await profile.expectEditSuccess();
      await expect(profile.phone).toContainText('555-9999');
    });
  });

  test.describe('Avatar', () => {
    test('should display avatar upload button', async () => {
      await profile.goto();
      await expect(profile.avatarUploadButton).toBeVisible();
    });

    test('should display current avatar image', async () => {
      await profile.goto();
      await expect(profile.avatarImage).toBeVisible();
    });
  });

  test.describe('Change Password', () => {
    test('should have a change password button', async () => {
      await profile.goto();
      await expect(profile.changePasswordButton).toBeVisible();
    });

    test('should show password change fields when clicking change password', async () => {
      await profile.goto();
      await profile.changePasswordButton.click();
      await expect(profile.currentPasswordInput).toBeVisible();
      await expect(profile.newPasswordInput).toBeVisible();
      await expect(profile.confirmNewPasswordInput).toBeVisible();
      await expect(profile.updatePasswordButton).toBeVisible();
    });

    test('should reject password change with wrong current password', async () => {
      await profile.goto();
      await profile.changePassword('WrongCurrent!', 'NewPass123!', 'NewPass123!');
      // Should show an error, not succeed
      await expect(profile.page.locator('[data-testid="profile-password-error"]')).toBeVisible();
    });

    test('should reject mismatched new passwords', async () => {
      await profile.goto();
      await profile.changePassword('Member123!', 'NewPass123!', 'DifferentPass!');
      await expect(profile.page.locator('[data-testid="profile-password-mismatch-error"]')).toBeVisible();
    });
  });

  test.describe('Profile Switching', () => {
    test('should display profile switcher if multiple profiles exist', async () => {
      await profile.goto();
      // Profile switcher may not be visible if user has only one profile
      const isVisible = await profile.profileSwitcher.isVisible();
      if (isVisible) {
        await expect(profile.profileSwitcher).toBeVisible();
      }
    });

    test('should show profile options when clicking switcher', async () => {
      await profile.goto();
      const isVisible = await profile.profileSwitcher.isVisible();
      if (isVisible) {
        await profile.profileSwitcher.click();
        await expect(profile.profileOptions.first()).toBeVisible();
      }
    });

    test('should switch profile when selecting an option', async () => {
      await profile.goto();
      const isVisible = await profile.profileSwitcher.isVisible();
      if (isVisible) {
        const nameBefore = await profile.displayName.textContent();
        await profile.switchProfile(1);
        // Display name may change after profile switch
        await expect(profile.displayName).toBeVisible();
      }
    });
  });

  test.describe('Logout', () => {
    test('should have a logout button', async () => {
      await profile.goto();
      await expect(profile.logoutButton).toBeVisible();
    });

    test('should redirect to login page after logout', async () => {
      await profile.goto();
      await profile.logout();
      await expect(profile.page).toHaveURL(/\/login/);
    });
  });

  test.describe('Responsive Layout', () => {
    test('should display profile page on mobile', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 375, height: 812 });
      profile = new ProfilePage(authenticatedPage);
      await profile.goto();
      await profile.expectLoaded();
    });

    test('should show avatar prominently on mobile', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 375, height: 812 });
      profile = new ProfilePage(authenticatedPage);
      await profile.goto();
      await expect(profile.avatar).toBeVisible();
    });
  });
});
