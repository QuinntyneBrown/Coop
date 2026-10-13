import { type Locator, type Page, expect } from '@playwright/test';

export class DocumentsPage {
  readonly page: Page;

  // Tabs
  readonly tabAll: Locator;
  readonly tabNotices: Locator;
  readonly tabByLaws: Locator;
  readonly tabReports: Locator;

  // Top bar
  readonly searchBar: Locator;
  readonly newDocumentButton: Locator;

  // Document cards
  readonly documentCards: Locator;

  // New/Edit document dialog
  readonly documentDialog: Locator;
  readonly dialogTitle: Locator;
  readonly dialogTitleInput: Locator;
  readonly dialogTypeSelect: Locator;
  readonly dialogContentInput: Locator;
  readonly dialogStatusSelect: Locator;
  readonly dialogCancelButton: Locator;
  readonly dialogSaveButton: Locator;

  // Delete dialog
  readonly deleteDialog: Locator;
  readonly deleteConfirmButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.tabAll = page.getByTestId('documents-tab-all');
    this.tabNotices = page.getByTestId('documents-tab-notices');
    this.tabByLaws = page.getByTestId('documents-tab-bylaws');
    this.tabReports = page.getByTestId('documents-tab-reports');

    this.searchBar = page.getByTestId('documents-search');
    this.newDocumentButton = page.getByTestId('documents-new-button');

    this.documentCards = page.getByTestId('document-card');

    this.documentDialog = page.getByTestId('document-dialog');
    this.dialogTitle = page.getByTestId('document-dialog-title');
    this.dialogTitleInput = page.getByTestId('document-dialog-title-input');
    this.dialogTypeSelect = page.getByTestId('document-dialog-type');
    this.dialogContentInput = page.getByTestId('document-dialog-content');
    this.dialogStatusSelect = page.getByTestId('document-dialog-status');
    this.dialogCancelButton = page.getByTestId('document-dialog-cancel');
    this.dialogSaveButton = page.getByTestId('document-dialog-save');

    this.deleteDialog = page.getByTestId('document-delete-dialog');
    this.deleteConfirmButton = page.getByTestId('document-delete-confirm');
  }

  async goto() {
    await this.page.goto('/documents');
  }

  async expectPageLoaded() {
    await expect(this.tabAll).toBeVisible();
    await expect(this.newDocumentButton).toBeVisible();
  }

  async switchTab(tab: 'all' | 'notices' | 'bylaws' | 'reports') {
    const tabMap: Record<string, Locator> = {
      all: this.tabAll,
      notices: this.tabNotices,
      bylaws: this.tabByLaws,
      reports: this.tabReports,
    };
    await tabMap[tab].click();
  }

  async searchDocuments(query: string) {
    await this.searchBar.fill(query);
    await this.page.waitForTimeout(300);
  }

  async getDocumentCount(): Promise<number> {
    return this.documentCards.count();
  }

  async expectDocumentCard(index: number, title: string, status: string) {
    const card = this.documentCards.nth(index);
    await expect(card.getByTestId('document-title')).toContainText(title);
    await expect(card.getByTestId('document-status-badge')).toContainText(status);
  }

  async createDocument(title: string, type: string, content: string, status: string) {
    await this.newDocumentButton.click();
    await expect(this.documentDialog).toBeVisible();
    await this.dialogTitleInput.fill(title);
    await this.dialogTypeSelect.selectOption(type);
    await this.dialogContentInput.fill(content);
    await this.dialogStatusSelect.selectOption(status);
    await this.dialogSaveButton.click();
  }

  async clickDocumentCard(index: number) {
    await this.documentCards.nth(index).click();
  }

  async deleteDocument(index: number) {
    const card = this.documentCards.nth(index);
    await card.getByTestId('document-delete-button').click();
    await expect(this.deleteDialog).toBeVisible();
    await this.deleteConfirmButton.click();
  }
}
