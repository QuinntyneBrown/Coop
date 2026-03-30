import { type Locator, type Page, expect } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;

  // Header
  readonly pageTitle: Locator;

  // Avatar
  readonly avatar: Locator;
  readonly avatarUploadButton: Locator;
  readonly avatarImage: Locator;

  // Profile info (view mode)
  readonly displayName: Locator;
  readonly username: Locator;
  readonly email: Locator;
  readonly phone: Locator;
  readonly unit: Locator;
  readonly memberSince: Locator;

  // Edit mode
  readonly editButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly successMessage: Locator;

  // Profile switching
  readonly profileSwitcher: Locator;
  readonly profileOptions: Locator;

  // Password change
  readonly changePasswordButton: Locator;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmNewPasswordInput: Locator;
  readonly updatePasswordButton: Locator;

  // Logout
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator('[data-testid="profile-page-title"]');

    this.avatar = page.locator('[data-testid="profile-avatar"]');
    this.avatarUploadButton = page.locator('[data-testid="profile-avatar-upload-btn"]');
    this.avatarImage = page.locator('[data-testid="profile-avatar-image"]');

    this.displayName = page.locator('[data-testid="profile-display-name"]');
    this.username = page.locator('[data-testid="profile-username"]');
    this.email = page.locator('[data-testid="profile-email"]');
    this.phone = page.locator('[data-testid="profile-phone"]');
    this.unit = page.locator('[data-testid="profile-unit"]');
    this.memberSince = page.locator('[data-testid="profile-member-since"]');

    this.editButton = page.locator('[data-testid="profile-edit-btn"]');
    this.firstNameInput = page.locator('[data-testid="profile-first-name-input"]');
    this.lastNameInput = page.locator('[data-testid="profile-last-name-input"]');
    this.emailInput = page.locator('[data-testid="profile-email-input"]');
    this.phoneInput = page.locator('[data-testid="profile-phone-input"]');
    this.saveButton = page.locator('[data-testid="profile-save-btn"]');
    this.cancelButton = page.locator('[data-testid="profile-cancel-btn"]');
    this.successMessage = page.locator('[data-testid="profile-success-message"]');

    this.profileSwitcher = page.locator('[data-testid="profile-switcher"]');
    this.profileOptions = page.locator('[data-testid="profile-switcher-option"]');

    this.changePasswordButton = page.locator('[data-testid="profile-change-password-btn"]');
    this.currentPasswordInput = page.locator('[data-testid="profile-current-password"]');
    this.newPasswordInput = page.locator('[data-testid="profile-new-password"]');
    this.confirmNewPasswordInput = page.locator('[data-testid="profile-confirm-new-password"]');
    this.updatePasswordButton = page.locator('[data-testid="profile-update-password-btn"]');

    this.logoutButton = page.locator('[data-testid="profile-logout-btn"]');
  }

  async goto() {
    await this.page.goto('/profile');
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
    await this.page.waitForURL('**/login');
  }
}
