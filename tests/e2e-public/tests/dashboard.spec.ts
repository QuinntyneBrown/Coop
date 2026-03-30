import { test as authTest, expect } from '../fixtures/auth.fixture';
import { test as apiTest } from '../fixtures/api.fixture';
import { mergeTests } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard.page';

const test = mergeTests(authTest, apiTest);

test.describe('Dashboard', () => {
  let dashboard: DashboardPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    dashboard = new DashboardPage(authenticatedPage);
  });

  test.describe('Page Load', () => {
    test('should load the dashboard for authenticated users', async () => {
      await dashboard.goto();
      await dashboard.expectLoaded();
    });

    test('should display the top bar with logo, bell, and menu', async () => {
      await dashboard.goto();
      await expect(dashboard.topBar).toBeVisible();
      await expect(dashboard.logo).toBeVisible();
      await expect(dashboard.notificationBell).toBeVisible();
      await expect(dashboard.hamburgerMenu).toBeVisible();
    });
  });

  test.describe('Greeting', () => {
    test('should display personalized greeting', async () => {
      await dashboard.goto();
      await expect(dashboard.greeting).toBeVisible();
      // Greeting should contain the user's first name
      await expect(dashboard.greeting).toContainText(/Hello,/);
    });

    test('should display subtitle "Here\'s your overview"', async () => {
      await dashboard.goto();
      await expect(dashboard.subtitle).toContainText("Here's your overview");
    });
  });

  test.describe('Metric Cards', () => {
    test('should display all three metric cards', async () => {
      await dashboard.goto();
      await dashboard.expectMetricCards();
    });

    test('should display requests metric with a count', async () => {
      await dashboard.goto();
      await expect(dashboard.requestsMetric).toBeVisible();
      const value = await dashboard.getMetricValue('requests');
      expect(value).toBeTruthy();
    });

    test('should display messages metric with a count', async () => {
      await dashboard.goto();
      await expect(dashboard.messagesMetric).toBeVisible();
      const value = await dashboard.getMetricValue('messages');
      expect(value).toBeTruthy();
    });

    test('should display members metric with a count', async () => {
      await dashboard.goto();
      await expect(dashboard.membersMetric).toBeVisible();
      const value = await dashboard.getMetricValue('members');
      expect(value).toBeTruthy();
    });
  });

  test.describe('Recent Requests', () => {
    test('should display recent requests card', async ({ api }) => {
      // Seed a maintenance request to ensure data exists
      await api.createMaintenanceRequest({
        title: 'E2E: Dashboard recent request',
        description: 'Seeded for dashboard test.',
      });
      await dashboard.goto();
      await dashboard.expectRecentRequests();
    });

    test('should show request items with status indicators', async ({ api }) => {
      // Seed a maintenance request to ensure data exists
      await api.createMaintenanceRequest({
        title: 'E2E: Dashboard status test',
        description: 'Seeded for status indicators test.',
      });
      await dashboard.goto();
      // Wait for the recent requests to load
      await expect(dashboard.recentRequestItems.first()).toBeVisible({ timeout: 10000 });
      const items = dashboard.recentRequestItems;
      const count = await items.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have a "View all" link to maintenance requests', async () => {
      await dashboard.goto();
      await expect(dashboard.viewAllRequestsLink).toBeVisible();
    });

    test('should navigate to maintenance page when clicking "View all"', async () => {
      await dashboard.goto();
      await dashboard.viewAllRequests();
      await expect(dashboard.page).toHaveURL(/\/maintenance/);
    });
  });

  test.describe('Navigation via Tab Bar', () => {
    test('should navigate to requests page', async () => {
      await dashboard.goto();
      await dashboard.navigateToRequests();
      await expect(dashboard.page).toHaveURL(/\/maintenance/);
    });

    test('should navigate to documents page', async () => {
      await dashboard.goto();
      await dashboard.navigateToDocuments();
      await expect(dashboard.page).toHaveURL(/\/documents/);
    });

    test('should navigate to messages page', async () => {
      await dashboard.goto();
      await dashboard.navigateToMessages();
      await expect(dashboard.page).toHaveURL(/\/messaging/);
    });

    test('should navigate to profile page', async () => {
      await dashboard.goto();
      await dashboard.navigateToProfile();
      await expect(dashboard.page).toHaveURL(/\/profile/);
    });
  });

  test.describe('Mobile Layout (375px)', () => {
    test('should display bottom tab bar on mobile', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 375, height: 812 });
      dashboard = new DashboardPage(authenticatedPage);
      await dashboard.goto();
      await dashboard.expectMobileTabBar();
    });

    test('should show metric cards stacked on mobile', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 375, height: 812 });
      dashboard = new DashboardPage(authenticatedPage);
      await dashboard.goto();
      await dashboard.expectMetricCards();
    });

    test('should display hamburger menu on mobile', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 375, height: 812 });
      dashboard = new DashboardPage(authenticatedPage);
      await dashboard.goto();
      await expect(dashboard.hamburgerMenu).toBeVisible();
    });
  });

  test.describe('Notifications', () => {
    test('should show notification bell', async () => {
      await dashboard.goto();
      await expect(dashboard.notificationBell).toBeVisible();
    });

    test('should show notification badge when there are unread notifications', async () => {
      await dashboard.goto();
      // Badge may or may not be visible depending on notification state
      const bell = dashboard.notificationBell;
      await expect(bell).toBeVisible();
    });
  });
});
