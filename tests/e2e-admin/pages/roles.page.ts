import { type Locator, type Page, expect } from '@playwright/test';

export class RolesPage {
  readonly page: Page;

  // Left panel - Roles list
  readonly rolesPanel: Locator;
  readonly rolesPanelTitle: Locator;
  readonly roleCards: Locator;

  // Right panel - Privileges
  readonly privilegesPanel: Locator;
  readonly privilegesPanelTitle: Locator;
  readonly addPrivilegeButton: Locator;
  readonly privilegesTable: Locator;
  readonly privilegeRows: Locator;

  // Table headers
  readonly headerAggregate: Locator;
  readonly headerRead: Locator;
  readonly headerWrite: Locator;
  readonly headerCreate: Locator;
  readonly headerDelete: Locator;

  constructor(page: Page) {
    this.page = page;

    this.rolesPanel = page.getByTestId('roles-panel');
    this.rolesPanelTitle = page.getByTestId('roles-panel-title');
    this.roleCards = page.getByTestId('role-card');

    this.privilegesPanel = page.getByTestId('privileges-panel');
    this.privilegesPanelTitle = page.getByTestId('privileges-panel-title');
    this.addPrivilegeButton = page.getByTestId('add-privilege-button');
    this.privilegesTable = page.getByTestId('privileges-table');
    this.privilegeRows = page.getByTestId('privilege-row');

    this.headerAggregate = page.getByTestId('privilege-header-aggregate');
    this.headerRead = page.getByTestId('privilege-header-read');
    this.headerWrite = page.getByTestId('privilege-header-write');
    this.headerCreate = page.getByTestId('privilege-header-create');
    this.headerDelete = page.getByTestId('privilege-header-delete');
  }

  async goto() {
    await this.page.goto('/roles');
  }

  async expectPageLoaded() {
    await expect(this.rolesPanel).toBeVisible();
    await expect(this.rolesPanelTitle).toHaveText('Roles');
    await expect(this.privilegesPanel).toBeVisible();
  }

  async selectRole(roleName: string) {
    const card = this.page.getByTestId(`role-card-${roleName.toLowerCase()}`);
    await card.click();
  }

  async expectRoleSelected(roleName: string) {
    const card = this.page.getByTestId(`role-card-${roleName.toLowerCase()}`);
    await expect(card).toHaveAttribute('data-selected', 'true');
    await expect(this.privilegesPanelTitle).toContainText(roleName);
  }

  async getRoleCount(): Promise<number> {
    return this.roleCards.count();
  }

  async expectRolesListed(roles: string[]) {
    for (const role of roles) {
      const card = this.page.getByTestId(`role-card-${role.toLowerCase()}`);
      await expect(card).toBeVisible();
    }
  }

  async expectPrivilegeRow(aggregate: string, permissions: { read: boolean; write: boolean; create: boolean; delete: boolean }) {
    const row = this.page.getByTestId(`privilege-row-${aggregate.toLowerCase()}`);
    await expect(row).toBeVisible();

    const readToggle = row.getByTestId('privilege-read');
    const writeToggle = row.getByTestId('privilege-write');
    const createToggle = row.getByTestId('privilege-create');
    const deleteToggle = row.getByTestId('privilege-delete');

    if (permissions.read) {
      await expect(readToggle).toBeChecked();
    }
    if (permissions.write) {
      await expect(writeToggle).toBeChecked();
    }
    if (permissions.create) {
      await expect(createToggle).toBeChecked();
    }
    if (permissions.delete) {
      await expect(deleteToggle).toBeChecked();
    }
  }

  async togglePrivilege(aggregate: string, permission: 'read' | 'write' | 'create' | 'delete') {
    const row = this.page.getByTestId(`privilege-row-${aggregate.toLowerCase()}`);
    await row.getByTestId(`privilege-${permission}`).click();
  }
}
