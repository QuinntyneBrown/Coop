import { type Locator, type Page, expect } from '@playwright/test';

export class InvitationsPage {
  readonly page: Page;

  // Top bar
  readonly pageTitle: Locator;
  readonly createInvitationButton: Locator;

  // Table
  readonly invitationsTable: Locator;
  readonly tableRows: Locator;
  readonly headerToken: Locator;
  readonly headerType: Locator;
  readonly headerExpires: Locator;
  readonly headerStatus: Locator;

  // Create invitation dialog
  readonly createDialog: Locator;
  readonly dialogTypeSelect: Locator;
  readonly dialogExpiresInput: Locator;
  readonly dialogCancelButton: Locator;
  readonly dialogCreateButton: Locator;

  // Token display dialog
  readonly tokenDialog: Locator;
  readonly tokenValue: Locator;
  readonly tokenCopyButton: Locator;
  readonly tokenCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.getByTestId('invitations-page-title');
    this.createInvitationButton = page.getByTestId('invitations-create-button');

    this.invitationsTable = page.getByTestId('invitations-table');
    this.tableRows = page.getByTestId('invitation-row');
    this.headerToken = page.getByTestId('invitations-header-token');
    this.headerType = page.getByTestId('invitations-header-type');
    this.headerExpires = page.getByTestId('invitations-header-expires');
    this.headerStatus = page.getByTestId('invitations-header-status');

    this.createDialog = page.getByTestId('invitation-create-dialog');
    this.dialogTypeSelect = page.getByTestId('invitation-dialog-type');
    this.dialogExpiresInput = page.getByTestId('invitation-dialog-expires');
    this.dialogCancelButton = page.getByTestId('invitation-dialog-cancel');
    this.dialogCreateButton = page.getByTestId('invitation-dialog-create');

    this.tokenDialog = page.getByTestId('invitation-token-dialog');
    this.tokenValue = page.getByTestId('invitation-token-value');
    this.tokenCopyButton = page.getByTestId('invitation-token-copy');
    this.tokenCloseButton = page.getByTestId('invitation-token-close');
  }

  async goto() {
    await this.page.goto('/invitations');
  }

  async expectPageLoaded() {
    await expect(this.pageTitle).toHaveText('Invitations');
    await expect(this.createInvitationButton).toBeVisible();
    await expect(this.invitationsTable).toBeVisible();
  }

  async expectTableHeaders() {
    await expect(this.headerToken).toBeVisible();
    await expect(this.headerType).toBeVisible();
    await expect(this.headerExpires).toBeVisible();
    await expect(this.headerStatus).toBeVisible();
  }

  async getRowCount(): Promise<number> {
    return this.tableRows.count();
  }

  async expectRowStatus(index: number, status: 'Active' | 'Expired' | 'Used') {
    const row = this.tableRows.nth(index);
    const badge = row.getByTestId('invitation-status-badge');
    await expect(badge).toContainText(status);
  }

  async createInvitation(type: string, expires?: string) {
    await this.createInvitationButton.click();
    await expect(this.createDialog).toBeVisible();
    await this.dialogTypeSelect.selectOption(type);
    if (expires) {
      await this.dialogExpiresInput.fill(expires);
    }
    await this.dialogCreateButton.click();
  }

  async expectTokenDialogVisible() {
    await expect(this.tokenDialog).toBeVisible();
    await expect(this.tokenValue).toBeVisible();
  }

  async getTokenValue(): Promise<string> {
    return (await this.tokenValue.textContent()) ?? '';
  }

  async copyToken() {
    await this.tokenCopyButton.click();
  }

  async closeTokenDialog() {
    await this.tokenCloseButton.click();
  }
}
