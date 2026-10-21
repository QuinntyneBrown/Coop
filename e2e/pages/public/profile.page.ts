import { type Locator, type Page, expect } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;

  // Header
  readonly pageTitle: Locator;
  readonly notificationBell: Locator;

  // Avatar
  readonly avatar: Locator;
  readonly avatarUploadButton: Locator;
  readonly avatarImage: Locator;
  readonly avatarPicture: Locator;
  readonly avatarInput: Locator;
  readonly savePhotoButton: Locator;
  readonly cancelPhotoButton: Locator;
  readonly removePhotoButton: Locator;
  readonly photoError: Locator;
  readonly photoNotice: Locator;

  // Profile info (view mode)
  readonly displayName: Locator;
  readonly username: Locator;
  readonly email: Locator;
  readonly phone: Locator;
  readonly unit: Locator;
  readonly memberSince: Locator;
  readonly notices: Locator;

  // Edit mode
  readonly editButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly successMessage: Locator;
  readonly noticeChoice: Locator;
  readonly noticeByEmail: Locator;
  readonly noticeByText: Locator;
  readonly noticeChoiceHint: Locator;
  readonly noticeChoiceError: Locator;

  // Profile switching
  readonly profileSwitcher: Locator;
  readonly profileOptions: Locator;

  // Password change
  readonly changePasswordButton: Locator;
  readonly passwordHeading: Locator;
  readonly cancelPasswordButton: Locator;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmNewPasswordInput: Locator;
  readonly updatePasswordButton: Locator;

  // Logout
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator('[data-testid="profile-page-title"]');
    this.notificationBell = page.locator('[data-testid="dashboard-notification-bell"]');

    this.avatar = page.locator('[data-testid="profile-avatar"]');
    this.avatarUploadButton = page.locator('[data-testid="profile-avatar-upload-btn"]');
    this.avatarImage = page.locator('[data-testid="profile-avatar-image"]');
    this.avatarPicture = page.locator('img[data-testid="profile-avatar-image"]');
    this.avatarInput = page.getByTestId('profile-avatar-input');
    this.savePhotoButton = page.getByTestId('profile-photo-save');
    this.cancelPhotoButton = page.getByTestId('profile-photo-cancel');
    this.removePhotoButton = page.getByRole('button', { name: 'Remove photo' });
    this.photoError = page.getByTestId('profile-photo-error');
    this.photoNotice = page.getByTestId('profile-photo-notice');

    this.displayName = page.locator('[data-testid="profile-display-name"]');
    this.username = page.locator('[data-testid="profile-username"]');
    this.email = page.locator('[data-testid="profile-email"]');
    this.phone = page.locator('[data-testid="profile-phone"]');
    this.unit = page.locator('[data-testid="profile-unit"]');
    this.memberSince = page.locator('[data-testid="profile-member-since"]');
    this.notices = page.getByTestId('profile-notices');

    this.editButton = page.locator('[data-testid="profile-edit-btn"]');
    this.firstNameInput = page.locator('[data-testid="profile-first-name-input"]');
    this.lastNameInput = page.locator('[data-testid="profile-last-name-input"]');
    this.emailInput = page.locator('[data-testid="profile-email-input"]');
    this.phoneInput = page.locator('[data-testid="profile-phone-input"]');
    this.saveButton = page.locator('[data-testid="profile-save-btn"]');
    this.cancelButton = page.locator('[data-testid="profile-cancel-btn"]');
    this.successMessage = page.locator('[data-testid="profile-success-message"]');
    this.noticeChoice = page.getByRole('group', {
      name: 'Send me new notices',
    });
    this.noticeByEmail = this.noticeChoice.getByRole('checkbox', {
      name: 'By email',
    });
    this.noticeByText = this.noticeChoice.getByRole('checkbox', {
      name: 'By text message',
    });
    this.noticeChoiceHint = this.noticeChoice.getByText(
      'We use the email address and phone number above.',
    );
    this.noticeChoiceError = this.noticeChoice.getByRole('alert');

    this.profileSwitcher = page.locator('[data-testid="profile-switcher"]');
    this.profileOptions = page.locator('[data-testid="profile-switcher-option"]');

    this.changePasswordButton = page.locator('[data-testid="profile-change-password-btn"]');
    this.passwordHeading = page.locator('[data-testid="profile-password-heading"]');
    this.cancelPasswordButton = page.locator('[data-testid="profile-password-cancel-btn"]');
    this.currentPasswordInput = page.locator('[data-testid="profile-current-password"]');
    this.newPasswordInput = page.locator('[data-testid="profile-new-password"]');
    this.confirmNewPasswordInput = page.locator('[data-testid="profile-confirm-new-password"]');
    this.updatePasswordButton = page.locator('[data-testid="profile-update-password-btn"]');

    this.logoutButton = page.locator('[data-testid="profile-logout-btn"]');
  }

  async goto() {
    await this.page.goto('/profile');
  }

  /** The header bell is on screen and nothing (such as the sidebar) is drawn over it. */
  async expectNotificationBellReachable() {
    await expect(this.notificationBell).toBeVisible();
    await this.notificationBell.click({ trial: true, timeout: 5000 });
  }

  async expectLoaded() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.avatar).toBeVisible();
    await expect(this.displayName).toBeVisible();
  }

  async expectProfileInfo() {
    await expect(this.displayName).toBeVisible();
    await expect(this.username).toBeVisible();
    await expect(this.email).toBeVisible();
  }

  async choosePhoto(file: { name: string; mimeType: string; buffer: Buffer }) {
    await this.avatarInput.setInputFiles(file);
  }

  async enterEditMode() {
    await this.editButton.click();
    await expect(this.firstNameInput).toBeVisible();
  }

  async editProfile(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }) {
    await this.enterEditMode();
    if (data.firstName) {
      await this.firstNameInput.clear();
      await this.firstNameInput.fill(data.firstName);
    }
    if (data.lastName) {
      await this.lastNameInput.clear();
      await this.lastNameInput.fill(data.lastName);
    }
    if (data.email) {
      await this.emailInput.clear();
      await this.emailInput.fill(data.email);
    }
    if (data.phone) {
      await this.phoneInput.clear();
      await this.phoneInput.fill(data.phone);
    }
    await this.saveButton.click();
  }

  async expectEditSuccess() {
    await expect(this.successMessage).toBeVisible();
  }

  async cancelEdit() {
    await this.cancelButton.click();
    await expect(this.firstNameInput).not.toBeVisible();
  }

  async changePassword(current: string, newPass: string, confirm: string) {
    await this.changePasswordButton.click();
    await this.currentPasswordInput.fill(current);
    await this.newPasswordInput.fill(newPass);
    await this.confirmNewPasswordInput.fill(confirm);
    await this.updatePasswordButton.click();
  }

  async switchProfile(index: number) {
    await this.profileSwitcher.click();
    await this.profileOptions.nth(index).click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}
