import { test, expect } from '../fixtures/api.fixture';
import { DashboardPage } from '../pages/dashboard.page';
import { SidebarComponent } from '../pages/sidebar.component';

test.describe('Dashboard', () => {
  let dashboard: DashboardPage;
  let sidebar: SidebarComponent;

  test.beforeEach(async ({ authenticatedPage }) => {
    dashboard = new DashboardPage(authenticatedPage);
    sidebar = new SidebarComponent(authenticatedPage);
    await dashboard.goto();
  });

  test.describe('Layout and Elements', () => {
    test('should display the dashboard page title', async () => {
      await dashboard.expectPageLoaded();
    });

    test('should display the sidebar with navigation', async () => {
      await sidebar.expectVisible();
    });

    test('should mark dashboard as active in sidebar', async () => {
      await sidebar.expectActiveLink('dashboard');
    });

    test('should display the search bar', async () => {
      await expect(dashboard.searchBar).toBeVisible();
    });

    test('should display the notification bell', async () => {
      await expect(dashboard.notificationBell).toBeVisible();
    });

    test('should display user info in sidebar', async () => {
      await expect(sidebar.userInfo).toBeVisible();
      await expect(sidebar.userName).toBeVisible();
      await expect(sidebar.userRole).toBeVisible();
    });
  });

  test.describe('Metric Cards', () => {
    test('should display all four metric cards', async () => {
      await dashboard.expectMetricCardsVisible();
    });

    test('should show Open Requests metric', async () => {
      await expect(dashboard.openRequestsCard).toBeVisible();
      await expect(dashboard.openRequestsCard).toContainText('Open Requests');
    });

    test('should show Unread Messages metric', async () => {
      await expect(dashboard.unreadMessagesCard).toBeVisible();
      await expect(dashboard.unreadMessagesCard).toContainText('Unread Messages');
    });

    test('should show Documents metric', async () => {
      await expect(dashboard.documentsCard).toBeVisible();
      await expect(dashboard.documentsCard).toContainText('Documents');
    });

    test('should show Active Members metric', async () => {
      await expect(dashboard.activeMembersCard).toBeVisible();
      await expect(dashboard.activeMembersCard).toContainText('Active Members');
    });

    test('should display numeric values in metric cards', async () => {
      const value = await dashboard.getMetricValue(dashboard.openRequestsCard);
      expect(value).toMatch(/\d+/);
    });
  });

  test.describe('Recent Maintenance Requests', () => {
    test('should display recent maintenance section', async () => {
      await dashboard.expectRecentMaintenanceVisible();
    });

    test('should show status badges on maintenance items', async ({ authenticatedPage }) => {
      const items = authenticatedPage.getByTestId('dashboard-maintenance-item');
      const count = await items.count();
      expect(count).toBeGreaterThan(0);

      // Check first item has a status badge
      const firstItem = items.first();
      const badge = firstItem.getByTestId('status-badge');
      await expect(badge).toBeVisible();
    });

    test('should show maintenance items with valid status values', async ({ authenticatedPage }) => {
      const items = authenticatedPage.getByTestId('dashboard-maintenance-item');
      const count = await items.count();
      const validStatuses = ['New', 'Received', 'Started', 'Completed'];

      for (let i = 0; i < Math.min(count, 5); i++) {
        const badge = items.nth(i).getByTestId('status-badge');
        const text = await badge.textContent();
        expect(validStatuses).toContain(text?.trim());
      }
    });
  });

  test.describe('Quick Actions', () => {
    test('should display all quick action buttons', async () => {
      await dashboard.expectQuickActionsVisible();
    });

    test('should navigate to new maintenance request on click', async ({ authenticatedPage }) => {
      await dashboard.newMaintenanceAction.click();
      await expect(authenticatedPage).toHaveURL(/maintenance/);
    });

    test('should navigate to create document on click', async ({ authenticatedPage }) => {
      await dashboard.createDocumentAction.click();
      await expect(authenticatedPage).toHaveURL(/document/);
    });

    test('should navigate to new message on click', async ({ authenticatedPage }) => {
      await dashboard.newMessageAction.click();
      await expect(authenticatedPage).toHaveURL(/message/);
    });

    test('should navigate to send invitation on click', async ({ authenticatedPage }) => {
      await dashboard.sendInvitationAction.click();
      await expect(authenticatedPage).toHaveURL(/invitation/);
    });
  });

  test.describe('Recent Notices', () => {
    test('should display recent notices panel', async () => {
      await expect(dashboard.recentNoticesPanel).toBeVisible();
    });
  });

  test.describe('Sidebar Navigation', () => {
    test('should navigate to maintenance from sidebar', async ({ authenticatedPage }) => {
      await sidebar.navigateTo('maintenance');
      await expect(authenticatedPage).toHaveURL(/maintenance/);
    });

    test('should navigate to documents from sidebar', async ({ authenticatedPage }) => {
      await sidebar.navigateTo('documents');
      await expect(authenticatedPage).toHaveURL(/documents/);
    });

    test('should navigate to messages from sidebar', async ({ authenticatedPage }) => {
      await sidebar.navigateTo('messages');
      await expect(authenticatedPage).toHaveURL(/messages/);
    });

    test('should navigate to users from sidebar', async ({ authenticatedPage }) => {
      await sidebar.navigateTo('users');
      await expect(authenticatedPage).toHaveURL(/users/);
    });

    test('should navigate to settings from sidebar', async ({ authenticatedPage }) => {
      await sidebar.navigateTo('settings');
      await expect(authenticatedPage).toHaveURL(/settings/);
    });
  });
});
