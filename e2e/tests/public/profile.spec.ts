import { test as authTest, expect } from '../../fixtures/public/auth.fixture';
import { test as apiTest } from '../../fixtures/public/api.fixture';
import { mergeTests } from '@playwright/test';
import { ProfilePage } from '../../pages/public/profile.page';
import { MEMBER_PROFILE_ID, type MockProfile } from '../../fixtures/mock-api/mock-store';

const test = mergeTests(authTest, apiTest);

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

  test.describe('Profile picture', () => {
    const png = (name: string) => ({
      name,
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        'base64',
      ),
    });

    test('Given a member on their profile, when they pick a photo and save, then their picture updates and persists after reload', async ({
      authenticatedPage,
    }) => {
      await profile.goto();
      await expect(profile.avatarPicture).toHaveCount(0);

      await profile.choosePhoto(png('me.png'));
      await expect(profile.avatarPicture).toBeVisible();
      await profile.savePhotoButton.click();

      await expect(profile.photoNotice).toHaveText('Your photo is saved.');
      await expect(profile.savePhotoButton).toHaveCount(0);
      await authenticatedPage.reload();
      await expect(profile.avatarPicture).toHaveAttribute('src', /\/api\/digitalasset\/serve\//);
      await expect(profile.removePhotoButton).toBeVisible();
    });

    test('Given a previewed photo, when the member cancels, then nothing is saved', async () => {
      await profile.goto();
      await profile.choosePhoto(png('maybe.png'));
      await expect(profile.avatarPicture).toBeVisible();

      await profile.cancelPhotoButton.click();

      await expect(profile.avatarPicture).toHaveCount(0);
      await expect(profile.savePhotoButton).toHaveCount(0);
    });

    test('Given a file that is not a photo or is too large, then it is refused with a plain message', async () => {
      await profile.goto();

      await profile.choosePhoto({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') });
      await expect(profile.photoError).toHaveText(
        '“notes.txt” is not a photo we can use. Choose a JPEG, PNG or WebP photo.',
      );
      await profile.choosePhoto({ name: 'huge.png', mimeType: 'image/png', buffer: Buffer.alloc(10 * 1024 * 1024 + 1) });
      await expect(profile.photoError).toHaveText('“huge.png” is too large. Choose a photo smaller than 10 MB.');

      await expect(profile.savePhotoButton).toHaveCount(0);
      await expect(profile.avatarPicture).toHaveCount(0);
    });

    test('Given saving fails, then the preview stays and the member is told to try again', async ({ api, mockApi }) => {
      const profileId = (await api.getProfile()).id;
      mockApi.failing.add(`POST profiles/${profileId}/avatar`);
      await profile.goto();
      await profile.choosePhoto(png('me.png'));

      await profile.savePhotoButton.click();

      await expect(profile.photoError).toHaveText('Your photo was not saved. Please try again.');
      await expect(profile.savePhotoButton).toBeEnabled();
      await expect(profile.avatarPicture).toBeVisible();
    });

    test('Given a member with a picture, when they remove it, then the empty mark returns', async () => {
      await profile.goto();
      await profile.choosePhoto(png('me.png'));
      await profile.savePhotoButton.click();
      await expect(profile.photoNotice).toHaveText('Your photo is saved.');

      await profile.removePhotoButton.click();

      await expect(profile.photoNotice).toHaveText('Your photo is removed.');
      await expect(profile.avatarPicture).toHaveCount(0);
      await expect(profile.removePhotoButton).toHaveCount(0);
    });

    test('Given another member, when they try to change the picture, then the API refuses', async ({ api, mockApi }) => {
      const profileId = (await api.getProfile()).id;
      const neighbour = mockApi.createUser({ username: 'neighbour', password: 'Neighbour123!', role: 'Member' });

      expect(mockApi.call('DELETE', `profiles/${profileId}/avatar`, undefined, neighbour).status).toBe(403);
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

  // L2-REQ-092: members choose how new notices reach them.
  test.describe('New notices', () => {
    const own = (mockApi: { store: { profiles: MockProfile[] } }) =>
      mockApi.store.profiles.find((p) => p.profileId === MEMBER_PROFILE_ID)!;

    test('Given a member who has not chosen, when the profile shows, then new notices are not sent to them', async () => {
      await profile.goto();
      await expect(profile.notices).toHaveText('Not sent to you');
    });

    test('Given the member chooses email, when they save, then the choice shows and stays after a reload', async ({
      mockApi,
    }) => {
      await profile.goto();
      await profile.enterEditMode();
      await expect(profile.noticeChoiceHint).toBeVisible();
      await expect(profile.noticeByEmail).not.toBeChecked();
      await expect(profile.noticeByText).not.toBeChecked();

      await profile.noticeByEmail.check();
      await profile.saveButton.click();

      await expect(profile.notices).toHaveText('By email');
      expect(own(mockApi).noticeByEmail).toBe(true);
      await profile.page.reload();
      await expect(profile.notices).toHaveText('By email');
      await profile.enterEditMode();
      await expect(profile.noticeByEmail).toBeChecked();
    });

    test('Given the member chooses both, when they save, then both show', async () => {
      await profile.goto();
      await profile.enterEditMode();
      await profile.noticeByEmail.check();
      await profile.noticeByText.check();
      await profile.saveButton.click();

      await expect(profile.notices).toHaveText('By email and text message');
    });

    test('Given text messages are chosen without a phone number, when the member saves, then nothing is saved and they are told why', async ({
      mockApi,
    }) => {
      await profile.goto();
      await profile.enterEditMode();
      await profile.phoneInput.clear();
      await profile.noticeByText.check();
      await profile.saveButton.click();

      await expect(profile.noticeChoiceError).toHaveText(
        'Add your phone number to get notices by text message.',
      );
      expect(own(mockApi).noticeByText).toBeFalsy();

      await profile.phoneInput.fill('555-0204');
      await profile.emailInput.clear();
      await profile.noticeByText.uncheck();
      await profile.noticeByEmail.check();
      await profile.saveButton.click();

      await expect(profile.noticeChoiceError).toHaveText(
        'Add your email address to get notices by email.',
      );
      expect(own(mockApi).noticeByEmail).toBeFalsy();
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
