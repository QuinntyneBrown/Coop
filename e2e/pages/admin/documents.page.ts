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
  readonly dialogCloseButton: Locator;
  readonly dialogSendCheckbox: Locator;
  readonly dialogSendHint: Locator;
  readonly dialogError: Locator;

  // Status message after a notice is sent
  readonly statusMessage: Locator;

  // Delete dialog
  readonly deleteDialog: Locator;
  readonly deleteConfirmButton: Locator;
  readonly deleteCloseButton: Locator;

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
    this.dialogCloseButton = this.documentDialog.getByRole('button', { name: 'Close' });
    this.dialogSendCheckbox = page.getByRole('checkbox', {
      name: 'Also send to members by email and text',
    });
    this.dialogSendHint = this.documentDialog.getByText(
      'Only members who asked for new notices on their profile get one.',
    );
    this.dialogError = this.documentDialog.getByRole('alert');

    this.statusMessage = page.getByRole('status').filter({ hasText: 'is published and sent' });

    this.deleteDialog = page.getByTestId('document-delete-dialog');
    this.deleteConfirmButton = page.getByTestId('document-delete-confirm');
    this.deleteCloseButton = this.deleteDialog.getByRole('button', { name: 'Close' });
  }

  async goto() {
    await this.page.goto('/documents');
    // Lists render after the mocked API responds; wait for requests to settle.
    await this.page.waitForLoadState('networkidle');
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

  async fillDocument(title: string, type: string, content: string, status: string) {
    await this.newDocumentButton.click();
    await expect(this.documentDialog).toBeVisible();
    await this.dialogTitleInput.fill(title);
    await this.dialogTypeSelect.selectOption(type);
    await this.dialogContentInput.fill(content);
    await this.dialogStatusSelect.selectOption(status);
  }

  async publishNoticeAndSend(title: string, content: string) {
    await this.fillDocument(title, 'Notice', content, 'Published');
    await this.dialogSendCheckbox.check();
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
