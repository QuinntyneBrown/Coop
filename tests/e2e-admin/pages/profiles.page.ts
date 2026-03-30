import { type Locator, type Page, expect } from '@playwright/test';

export class ProfilesPage {
  readonly page: Page;

  // Left panel - profile list
  readonly profilesPanel: Locator;
  readonly profilesPanelTitle: Locator;
  readonly editLink: Locator;
  readonly profileCards: Locator;

  // Right panel - edit profile
  readonly editPanel: Locator;
  readonly editPanelTitle: Locator;
  readonly avatar: Locator;
  readonly changeAvatarButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly boardTitleInput: Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator;

  // Validation
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.profilesPanel = page.getByTestId('profiles-panel');
    this.profilesPanelTitle = page.getByTestId('profiles-panel-title');
    this.editLink = page.getByTestId('profiles-edit-link');
    this.profileCards = page.getByTestId('profile-card');

    this.editPanel = page.getByTestId('profile-edit-panel');
    this.editPanelTitle = page.getByTestId('profile-edit-title');
    this.avatar = page.getByTestId('profile-avatar');
    this.changeAvatarButton = page.getByTestId('profile-change-avatar');
    this.firstNameInput = page.getByTestId('profile-first-name');
    this.lastNameInput = page.getByTestId('profile-last-name');
    this.phoneNumberInput = page.getByTestId('profile-phone');
    this.boardTitleInput = page.getByTestId('profile-board-title');
    this.cancelButton = page.getByTestId('profile-cancel');
    this.saveButton = page.getByTestId('profile-save');

    this.firstNameError = page.getByTestId('profile-first-name-error');
    this.lastNameError = page.getByTestId('profile-last-name-error');
  }

  async goto() {
    await this.page.goto('/profiles');
  }

  async expectPageLoaded() {
    await expect(this.profilesPanel).toBeVisible();
    await expect(this.profilesPanelTitle).toHaveText('My Profiles');
  }

  async selectProfile(index: number) {
    await this.profileCards.nth(index).click();
  }

  async expectProfileCardVisible(index: number, name: string) {
    const card = this.profileCards.nth(index);
    await expect(card).toBeVisible();
    await expect(card).toContainText(name);
  }

  async expectActiveProfile(index: number) {
    const card = this.profileCards.nth(index);
    const badge = card.getByTestId('profile-active-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('Active');
  }

  async editProfile(firstName: string, lastName: string, phone?: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    if (phone) {
      await this.phoneNumberInput.fill(phone);
    }
    await this.saveButton.click();
  }

  async expectEditPanelVisible(profileType: string) {
    await expect(this.editPanel).toBeVisible();
    await expect(this.editPanelTitle).toContainText(profileType);
  }
}
