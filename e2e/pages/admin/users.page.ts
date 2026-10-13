import { type Locator, type Page, expect } from '@playwright/test';

export class UsersPage {
  readonly page: Page;

  // Top bar
  readonly pageTitle: Locator;
  readonly searchBar: Locator;
  readonly addUserButton: Locator;

  // Table
  readonly usersTable: Locator;
  readonly tableHeaderUsername: Locator;
  readonly tableHeaderRole: Locator;
  readonly tableHeaderStatus: Locator;
  readonly tableHeaderActions: Locator;
  readonly tableRows: Locator;

  // Pagination
  readonly pagination: Locator;
  readonly paginationInfo: Locator;
  readonly paginationPrev: Locator;
  readonly paginationNext: Locator;
  readonly paginationPages: Locator;

  // Add/Edit user dialog
  readonly userDialog: Locator;
  readonly dialogTitle: Locator;
  readonly dialogUsernameInput: Locator;
  readonly dialogRoleSelect: Locator;
  readonly dialogPasswordInput: Locator;
  readonly dialogCancelButton: Locator;
  readonly dialogSaveButton: Locator;

  // Delete confirmation dialog
  readonly deleteDialog: Locator;
  readonly deleteConfirmButton: Locator;
  readonly deleteCancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.getByTestId('users-page-title');
    this.searchBar = page.getByTestId('users-search');
    this.addUserButton = page.getByTestId('users-add-button');

    this.usersTable = page.getByTestId('users-table');
    this.tableHeaderUsername = page.getByTestId('users-header-username');
    this.tableHeaderRole = page.getByTestId('users-header-role');
    this.tableHeaderStatus = page.getByTestId('users-header-status');
    this.tableHeaderActions = page.getByTestId('users-header-actions');
    this.tableRows = page.getByTestId('users-table-row');

    this.pagination = page.getByTestId('users-pagination');
    this.paginationInfo = page.getByTestId('users-pagination-info');
    this.paginationPrev = page.getByTestId('users-pagination-prev');
    this.paginationNext = page.getByTestId('users-pagination-next');
    this.paginationPages = page.getByTestId('users-pagination-page');

    this.userDialog = page.getByTestId('user-dialog');
    this.dialogTitle = page.getByTestId('user-dialog-title');
    this.dialogUsernameInput = page.getByTestId('user-dialog-username');
    this.dialogRoleSelect = page.getByTestId('user-dialog-role');
    this.dialogPasswordInput = page.getByTestId('user-dialog-password');
    this.dialogCancelButton = page.getByTestId('user-dialog-cancel');
    this.dialogSaveButton = page.getByTestId('user-dialog-save');

    this.deleteDialog = page.getByTestId('user-delete-dialog');
    this.deleteConfirmButton = page.getByTestId('user-delete-confirm');
    this.deleteCancelButton = page.getByTestId('user-delete-cancel');
  }

  async goto() {
    await this.page.goto('/users');
  }

  async expectPageLoaded() {
    await expect(this.pageTitle).toHaveText('Users');
    await expect(this.usersTable).toBeVisible();
    await expect(this.addUserButton).toBeVisible();
  }

  async expectTableHeaders() {
    await expect(this.tableHeaderUsername).toBeVisible();
    await expect(this.tableHeaderRole).toBeVisible();
    await expect(this.tableHeaderStatus).toBeVisible();
    await expect(this.tableHeaderActions).toBeVisible();
  }

  async getRowCount(): Promise<number> {
    return this.tableRows.count();
  }

  async searchUsers(query: string) {
    await this.searchBar.fill(query);
    await this.page.waitForTimeout(300); // debounce
  }

  async clickEditUser(rowIndex: number) {
    const row = this.tableRows.nth(rowIndex);
    await row.getByTestId('user-edit-button').click();
  }

  async clickDeleteUser(rowIndex: number) {
    const row = this.tableRows.nth(rowIndex);
    await row.getByTestId('user-delete-button').click();
  }

  async confirmDelete() {
    await expect(this.deleteDialog).toBeVisible();
    await this.deleteConfirmButton.click();
  }

  async addUser(username: string, role: string, password: string) {
    await this.addUserButton.click();
    await expect(this.userDialog).toBeVisible();
    await this.dialogUsernameInput.fill(username);
    await this.dialogRoleSelect.selectOption(role);
    await this.dialogPasswordInput.fill(password);
    await this.dialogSaveButton.click();
  }

  async expectRowContains(rowIndex: number, username: string, role: string, status: string) {
    const row = this.tableRows.nth(rowIndex);
    await expect(row.getByTestId('user-username')).toContainText(username);
    await expect(row.getByTestId('user-role-badge')).toContainText(role);
    await expect(row.getByTestId('user-status-badge')).toContainText(status);
  }

  async expectPaginationInfo(text: string) {
    await expect(this.paginationInfo).toContainText(text);
  }

  async goToPage(pageNumber: number) {
    await this.paginationPages.nth(pageNumber - 1).click();
  }
}
