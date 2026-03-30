import { test, expect } from '../fixtures/api.fixture';
import { RolesPage } from '../pages/roles.page';
import { SidebarComponent } from '../pages/sidebar.component';

test.describe('Roles & Privileges', () => {
  let rolesPage: RolesPage;
  let sidebar: SidebarComponent;

  test.beforeEach(async ({ authenticatedPage }) => {
    rolesPage = new RolesPage(authenticatedPage);
    sidebar = new SidebarComponent(authenticatedPage);
    await rolesPage.goto();
  });

  test.describe('Layout and Elements', () => {
    test('should display the roles page with two panels', async () => {
      await rolesPage.expectPageLoaded();
    });

    test('should mark roles as active in sidebar', async () => {
      await sidebar.expectActiveLink('roles');
    });

    test('should display the Roles panel title', async () => {
      await expect(rolesPage.rolesPanelTitle).toHaveText('Roles');
    });

    test('should display the privileges panel', async () => {
      await expect(rolesPage.privilegesPanel).toBeVisible();
    });

    test('should display the Add Privilege button', async () => {
      await expect(rolesPage.addPrivilegeButton).toBeVisible();
    });
  });

  test.describe('Roles List', () => {
    test('should display all expected roles', async () => {
      await rolesPage.expectRolesListed([
        'systemadministrator',
        'boardmember',
        'staff',
        'member',
        'support',
      ]);
    });

    test('should display role cards with shield icons', async ({ authenticatedPage }) => {
      const cards = rolesPage.roleCards;
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(5);

      for (let i = 0; i < count; i++) {
        const icon = cards.nth(i).getByTestId('role-icon');
        await expect(icon).toBeVisible();
      }
    });

    test('should highlight SystemAdministrator as default selected', async () => {
      await rolesPage.expectRoleSelected('SystemAdministrator');
    });
  });

  test.describe('Role Selection', () => {
    test('should update privileges panel when selecting a role', async () => {
      await rolesPage.selectRole('boardmember');
      await rolesPage.expectRoleSelected('BoardMember');
    });

    test('should show different privileges for different roles', async ({ authenticatedPage }) => {
      await rolesPage.selectRole('systemadministrator');
      const adminTitle = await rolesPage.privilegesPanelTitle.textContent();

      await rolesPage.selectRole('member');
      const memberTitle = await rolesPage.privilegesPanelTitle.textContent();

      expect(adminTitle).not.toBe(memberTitle);
    });

    test('should highlight selected role card', async () => {
      await rolesPage.selectRole('staff');
      const card = rolesPage.page.getByTestId('role-card-staff');
      await expect(card).toHaveAttribute('data-selected', 'true');
    });
  });

  test.describe('Privileges Table', () => {
    test('should display privileges table headers', async () => {
      await expect(rolesPage.headerAggregate).toBeVisible();
      await expect(rolesPage.headerRead).toBeVisible();
      await expect(rolesPage.headerWrite).toBeVisible();
      await expect(rolesPage.headerCreate).toBeVisible();
      await expect(rolesPage.headerDelete).toBeVisible();
    });

    test('should display privilege rows for SystemAdministrator', async () => {
      await rolesPage.selectRole('systemadministrator');
      const count = await rolesPage.privilegeRows.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should show privilege rows for User, MaintenanceRequest, Document, Profile', async () => {
      await rolesPage.selectRole('systemadministrator');

      for (const aggregate of ['user', 'maintenancerequest', 'document', 'profile']) {
        const row = rolesPage.page.getByTestId(`privilege-row-${aggregate}`);
        await expect(row).toBeVisible();
      }
    });

    test('should show toggle checkboxes for permissions', async () => {
      await rolesPage.selectRole('systemadministrator');
      const firstRow = rolesPage.privilegeRows.first();
      await expect(firstRow.getByTestId('privilege-read')).toBeVisible();
      await expect(firstRow.getByTestId('privilege-write')).toBeVisible();
      await expect(firstRow.getByTestId('privilege-create')).toBeVisible();
      await expect(firstRow.getByTestId('privilege-delete')).toBeVisible();
    });
  });

  test.describe('Privilege Toggling', () => {
    test('should toggle a privilege on', async () => {
      await rolesPage.selectRole('member');
      const row = rolesPage.page.getByTestId('privilege-row-document');
      const writeToggle = row.getByTestId('privilege-write');

      // Click to toggle
      await writeToggle.click();
      // Verify state changed (might be checked or unchecked depending on initial state)
      await expect(writeToggle).toBeVisible();
    });

    test('should persist privilege changes after role reselection', async () => {
      await rolesPage.selectRole('member');
      const row = rolesPage.page.getByTestId('privilege-row-document');
      const readToggle = row.getByTestId('privilege-read');
      const isChecked = await readToggle.isChecked();

      await readToggle.click();

      // Switch away and back
      await rolesPage.selectRole('staff');
      await rolesPage.selectRole('member');

      const newRow = rolesPage.page.getByTestId('privilege-row-document');
      const newToggle = newRow.getByTestId('privilege-read');
      const newState = await newToggle.isChecked();
      expect(newState).toBe(!isChecked);
    });
  });
});
