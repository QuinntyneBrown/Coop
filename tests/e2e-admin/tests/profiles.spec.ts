import { test, expect } from '../fixtures/api.fixture';
import { ProfilesPage } from '../pages/profiles.page';
import { SidebarComponent } from '../pages/sidebar.component';

test.describe('Profile Management', () => {
  let profilesPage: ProfilesPage;
  let sidebar: SidebarComponent;

  test.beforeEach(async ({ authenticatedPage }) => {
    profilesPage = new ProfilesPage(authenticatedPage);
    sidebar = new SidebarComponent(authenticatedPage);
    await profilesPage.goto();
  });

  test.describe('Layout and Elements', () => {
    test('should display the profiles page', async () => {
      await profilesPage.expectPageLoaded();
    });

    test('should mark profiles as active in sidebar', async () => {
      await sidebar.expectActiveLink('profiles');
    });

    test('should display My Profiles panel title', async () => {
      await expect(profilesPage.profilesPanelTitle).toHaveText('My Profiles');
    });

    test('should display the edit link', async () => {
      await expect(profilesPage.editLink).toBeVisible();
    });
  });

  test.describe('Profile List', () => {
    test('should display at least one profile card', async () => {
      const count = await profilesPage.profileCards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should show active badge on the active profile', async () => {
      await profilesPage.expectActiveProfile(0);
    });

    test('should display profile name and role on cards', async () => {
      const firstCard = profilesPage.profileCards.first();
      await expect(firstCard).toBeVisible();
      const text = await firstCard.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    });
  });

  test.describe('Profile Selection', () => {
    test('should display edit panel when a profile is selected', async () => {
      await profilesPage.selectProfile(0);
      await expect(profilesPage.editPanel).toBeVisible();
    });

    test('should show avatar and change avatar button', async () => {
      await profilesPage.selectProfile(0);
      await expect(profilesPage.avatar).toBeVisible();
      await expect(profilesPage.changeAvatarButton).toBeVisible();
    });

    test('should display form fields in edit panel', async () => {
      await profilesPage.selectProfile(0);
      await expect(profilesPage.firstNameInput).toBeVisible();
      await expect(profilesPage.lastNameInput).toBeVisible();
      await expect(profilesPage.phoneNumberInput).toBeVisible();
    });

    test('should pre-fill profile data in edit panel', async () => {
      await profilesPage.selectProfile(0);
      await expect(profilesPage.firstNameInput).not.toBeEmpty();
      await expect(profilesPage.lastNameInput).not.toBeEmpty();
    });
  });

  test.describe('Profile Editing', () => {
    test('should save profile changes', async () => {
      await profilesPage.selectProfile(0);
      await profilesPage.editProfile('UpdatedFirst', 'UpdatedLast', '555-1234');
      // Verify the changes persisted
      await profilesPage.selectProfile(0);
      await expect(profilesPage.firstNameInput).toHaveValue('UpdatedFirst');
    });

    test('should show validation error for empty first name', async () => {
      await profilesPage.selectProfile(0);
      await profilesPage.firstNameInput.fill('');
      await profilesPage.saveButton.click();
      await expect(profilesPage.firstNameError).toBeVisible();
    });

    test('should show validation error for empty last name', async () => {
      await profilesPage.selectProfile(0);
      await profilesPage.lastNameInput.fill('');
      await profilesPage.saveButton.click();
      await expect(profilesPage.lastNameError).toBeVisible();
    });

    test('should cancel changes when clicking cancel', async () => {
      await profilesPage.selectProfile(0);
      const originalFirst = await profilesPage.firstNameInput.inputValue();
      await profilesPage.firstNameInput.fill('TempChange');
      await profilesPage.cancelButton.click();

      // Re-select and verify unchanged
      await profilesPage.selectProfile(0);
      await expect(profilesPage.firstNameInput).toHaveValue(originalFirst);
    });
  });

  test.describe('Edit Panel Title', () => {
    test('should show correct profile type in edit panel title', async () => {
      await profilesPage.selectProfile(0);
      await expect(profilesPage.editPanelTitle).toBeVisible();
      const title = await profilesPage.editPanelTitle.textContent();
      expect(title).toMatch(/Edit .+ Profile/);
    });
  });

  test.describe('Board Title Field', () => {
    test('should show board title field for board member profiles', async () => {
      // Select a board member profile if available
      const cards = profilesPage.profileCards;
      const count = await cards.count();

      for (let i = 0; i < count; i++) {
        const cardText = await cards.nth(i).textContent();
        if (cardText?.includes('Board')) {
          await profilesPage.selectProfile(i);
          await expect(profilesPage.boardTitleInput).toBeVisible();
          return;
        }
      }
      // Skip if no board member profile exists
      test.skip();
    });
  });
});
