import { test, expect } from '../fixtures/api.fixture';
import { UsersPage } from '../pages/users.page';
import { SidebarComponent } from '../pages/sidebar.component';

test.describe('Users Management', () => {
  let usersPage: UsersPage;
  let sidebar: SidebarComponent;

  test.beforeEach(async ({ authenticatedPage }) => {
    usersPage = new UsersPage(authenticatedPage);
    sidebar = new SidebarComponent(authenticatedPage);
    await usersPage.goto();
  });

  test.describe('Layout and Elements', () => {
    test('should display the users page title', async () => {
      await usersPage.expectPageLoaded();
    });

    test('should mark users as active in sidebar', async () => {
      await sidebar.expectActiveLink('users');
    });

    test('should display the search bar', async () => {
      await expect(usersPage.searchBar).toBeVisible();
    });

    test('should display the Add User button', async () => {
      await expect(usersPage.addUserButton).toBeVisible();
      await expect(usersPage.addUserButton).toContainText('Add User');
    });

    test('should display table headers', async () => {
      await usersPage.expectTableHeaders();
    });
  });

  test.describe('Table Data', () => {
    test('should display user rows in the table', async () => {
      const count = await usersPage.getRowCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should display username, role, and status for each row', async () => {
      const count = await usersPage.getRowCount();
      expect(count).toBeGreaterThan(0);

      // Check first row has required columns
      const firstRow = usersPage.tableRows.first();
      await expect(firstRow.getByTestId('user-username')).toBeVisible();
      await expect(firstRow.getByTestId('user-role-badge')).toBeVisible();
      await expect(firstRow.getByTestId('user-status-badge')).toBeVisible();
    });

    test('should display edit and delete action buttons', async () => {
      const firstRow = usersPage.tableRows.first();
      await expect(firstRow.getByTestId('user-edit-button')).toBeVisible();
      await expect(firstRow.getByTestId('user-delete-button')).toBeVisible();
    });

    test('should display status badges with correct values', async ({ authenticatedPage }) => {
      const rows = usersPage.tableRows;
      const count = await rows.count();
      const validStatuses = ['Active', 'Disabled'];

      for (let i = 0; i < Math.min(count, 5); i++) {
        const badge = rows.nth(i).getByTestId('user-status-badge');
        const text = await badge.textContent();
        expect(validStatuses).toContain(text?.trim());
      }
    });

    test('should display role badges', async ({ authenticatedPage }) => {
      const firstRow = usersPage.tableRows.first();
      const roleBadge = firstRow.getByTestId('user-role-badge');
      await expect(roleBadge).toBeVisible();
      const text = await roleBadge.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    });
  });

  test.describe('Pagination', () => {
    test('should display pagination controls', async () => {
      await expect(usersPage.pagination).toBeVisible();
    });

    test('should display pagination info text', async () => {
      await expect(usersPage.paginationInfo).toBeVisible();
      await expect(usersPage.paginationInfo).toContainText(/Showing \d+-\d+ of \d+ users/);
    });

    test('should navigate to next page', async () => {
      const initialInfo = await usersPage.paginationInfo.textContent();
      await usersPage.paginationNext.click();
      const newInfo = await usersPage.paginationInfo.textContent();
      expect(newInfo).not.toBe(initialInfo);
    });

    test('should navigate to specific page', async () => {
      await usersPage.goToPage(2);
      await expect(usersPage.paginationInfo).toContainText(/Showing \d+-\d+/);
    });
  });

  test.describe('Search', () => {
    test('should filter users by search query', async () => {
      await usersPage.searchUsers('admin');
      const count = await usersPage.getRowCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should show empty state when no results found', async ({ authenticatedPage }) => {
      await usersPage.searchUsers('zzz_nonexistent_user_zzz');
      const count = await usersPage.getRowCount();
      expect(count).toBe(0);
    });

    test('should clear search and show all users', async () => {
      await usersPage.searchUsers('admin');
      const filteredCount = await usersPage.getRowCount();

      await usersPage.searchUsers('');
      const allCount = await usersPage.getRowCount();
      expect(allCount).toBeGreaterThanOrEqual(filteredCount);
    });
  });

  test.describe('Add User', () => {
    test('should open add user dialog when clicking Add User', async () => {
      await usersPage.addUserButton.click();
      await expect(usersPage.userDialog).toBeVisible();
      await expect(usersPage.dialogTitle).toContainText(/add|new|create/i);
    });

    test('should close dialog when clicking cancel', async () => {
      await usersPage.addUserButton.click();
      await expect(usersPage.userDialog).toBeVisible();
      await usersPage.dialogCancelButton.click();
      await expect(usersPage.userDialog).toBeHidden();
    });

    test('should show validation errors for empty fields', async () => {
      await usersPage.addUserButton.click();
      await usersPage.dialogSaveButton.click();
      // Dialog should still be visible with errors
      await expect(usersPage.userDialog).toBeVisible();
    });

    test('should create a new user successfully', async () => {
      const initialCount = await usersPage.getRowCount();
      await usersPage.addUser('e2e_testuser', 'Member', 'TestPass123!');
      await expect(usersPage.userDialog).toBeHidden();

      // Table should update
      const newCount = await usersPage.getRowCount();
      expect(newCount).toBeGreaterThanOrEqual(initialCount);
    });
  });

  test.describe('Edit User', () => {
    test('should open edit dialog when clicking edit button', async () => {
      await usersPage.clickEditUser(0);
      await expect(usersPage.userDialog).toBeVisible();
      await expect(usersPage.dialogTitle).toContainText(/edit/i);
    });

    test('should pre-fill user data in edit dialog', async () => {
      await usersPage.clickEditUser(0);
      await expect(usersPage.dialogUsernameInput).not.toBeEmpty();
    });
  });

  test.describe('Delete User', () => {
    test('should show confirmation dialog when clicking delete', async () => {
      await usersPage.clickDeleteUser(0);
      await expect(usersPage.deleteDialog).toBeVisible();
    });

    test('should cancel deletion when clicking cancel', async () => {
      const initialCount = await usersPage.getRowCount();
      await usersPage.clickDeleteUser(0);
      await usersPage.deleteCancelButton.click();
      await expect(usersPage.deleteDialog).toBeHidden();
      const count = await usersPage.getRowCount();
      expect(count).toBe(initialCount);
    });

    test('should delete user when confirming', async ({ api }) => {
      // Seed a user to delete
      await api.createUser('e2e_delete_me', 'DeleteMe123!');
      await usersPage.goto(); // refresh

      const initialCount = await usersPage.getRowCount();
      // Delete the last row (the seeded user)
      await usersPage.clickDeleteUser(initialCount - 1);
      await usersPage.confirmDelete();
      await expect(usersPage.deleteDialog).toBeHidden();
    });
  });
});
