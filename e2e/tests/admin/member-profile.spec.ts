// Acceptance Test
// Traces to: L2-REQ-116, L2-REQ-091, L2-REQ-092, L2-REQ-114
// Description: On the admin site's My profile a member sees only their own
// profile, sets, replaces and removes their picture, and chooses how new
// notices reach them.

import { test, expect } from '../../fixtures/admin/auth.fixture';
import { ProfilesPage } from '../../pages/admin/profiles.page';
import { MEMBER_PROFILE_ID } from '../../fixtures/mock-api/mock-store';

test.describe('My profile as a member', () => {
  let profile: ProfilesPage;

  test.beforeEach(async ({ memberPage }) => {
    profile = new ProfilesPage(memberPage);
    await profile.gotoMyProfile();
  });

  test('Given two households, when the member opens My profile, then only their own profile is listed', async () => {
    await expect(profile.profileCards).toHaveCount(1);
    await expect(profile.displayName).toHaveText('Margaret Okafor');
  });

  test.describe('Profile picture', () => {
    test('Given a member, when they pick a photo and save, then their picture shows and stays after a reload', async ({
      memberPage,
    }) => {
      await profile.choosePhoto('me.png');
      await expect(profile.savePhotoButton).toBeVisible();
      await expect(profile.cancelPhotoButton).toBeVisible();

      await profile.savePhotoButton.click();

      await expect(profile.photoStatus).toHaveText('Your photo is saved.');
      await expect(profile.photo).toBeVisible();
      await memberPage.reload();
      await expect(profile.photo).toBeVisible();
    });

    test('Given a previewed photo, when the member cancels, then nothing is saved', async ({ mockApi }) => {
      await profile.choosePhoto('me.png');

      await profile.cancelPhotoButton.click();

      await expect(profile.photo).toHaveCount(0);
      expect(mockApi.store.profiles.find((p) => p.profileId === MEMBER_PROFILE_ID)!.avatarUrl).toBe('');
    });

    test('Given a file that is not a photo, then it is refused with a plain message', async () => {
      await profile.choosePhoto('notes.pdf', 'application/pdf');

      await expect(profile.photoError).toHaveText('“notes.pdf” is not a photo we can use. Choose a JPEG, PNG or WebP photo.');
      await expect(profile.savePhotoButton).toHaveCount(0);
    });

    test('Given saving fails, then the preview stays and the member is told to try again', async ({ mockApi }) => {
      mockApi.failing.add('POST profiles/:id/avatar');
      await profile.choosePhoto('me.png');

      await profile.savePhotoButton.click();

      await expect(profile.photoError).toHaveText('Your photo was not saved. Please try again.');
      await expect(profile.savePhotoButton).toBeVisible();
    });

    test('Given a member with a picture, when they remove it, then the initials return', async ({ mockApi, memberPage }) => {
      mockApi.store.profiles.find((p) => p.profileId === MEMBER_PROFILE_ID)!.avatarUrl = '/api/digitalasset/serve/a1';
      await memberPage.reload();
      await expect(profile.photo).toBeVisible();

      await profile.removePhotoButton.click();

      await expect(profile.photoStatus).toHaveText('Your photo is removed.');
      await expect(profile.photo).toHaveCount(0);
    });
  });

  test.describe('New notices', () => {
    test('Given a member who has not chosen, when the profile shows, then new notices are not sent to them', async () => {
      await expect(profile.noticesRow).toHaveText('Not sent to you');
    });

    test('Given the member chooses email, when they save, then the choice shows and stays after a reload', async ({
      memberPage,
    }) => {
      await profile.editButton.click();
      await expect(memberPage.getByText('We use the email address and phone number above.')).toBeVisible();
      await profile.noticeByEmail.check();

      await profile.saveButton.click();

      await expect(profile.successMessage).toHaveText('Your profile is saved.');
      await memberPage.reload();
      await expect(profile.noticesRow).toHaveText('By email');
    });

    test('Given the member chooses both, when they save, then both show', async () => {
      await profile.editButton.click();
      await profile.noticeByEmail.check();
      await profile.noticeByText.check();

      await profile.saveButton.click();

      await expect(profile.successMessage).toBeVisible();
      await profile.cancelButton.click();
      await expect(profile.noticesRow).toHaveText('By email and text message');
    });

    test('Given text messages are chosen without a phone number, when the member saves, then nothing is saved and they are told why', async ({
      mockApi,
    }) => {
      await profile.editButton.click();
      await profile.phoneNumberInput.fill('');
      await profile.noticeByText.check();

      await profile.saveButton.click();

      await expect(profile.noticesError).toHaveText('Add your phone number to get notices by text message.');
      expect(mockApi.store.profiles.find((p) => p.profileId === MEMBER_PROFILE_ID)!.noticeByText).toBeUndefined();
    });
  });
});
