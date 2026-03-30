import { test, expect } from '../fixtures/api.fixture';
import { MaintenancePage } from '../pages/maintenance.page';
import { SidebarComponent } from '../pages/sidebar.component';

test.describe('Maintenance Requests', () => {
  let maintenancePage: MaintenancePage;
  let sidebar: SidebarComponent;

  test.beforeEach(async ({ authenticatedPage }) => {
    maintenancePage = new MaintenancePage(authenticatedPage);
    sidebar = new SidebarComponent(authenticatedPage);
    await maintenancePage.goto();
  });

  test.describe('Layout and Elements', () => {
    test('should display the maintenance page', async () => {
      await maintenancePage.expectPageLoaded();
    });

    test('should mark maintenance as active in sidebar', async () => {
      await sidebar.expectActiveLink('maintenance');
    });

    test('should display All Requests panel title', async () => {
      await expect(maintenancePage.requestsPanelTitle).toHaveText('All Requests');
    });

    test('should display filter tabs', async () => {
      await expect(maintenancePage.filterAll).toBeVisible();
      await expect(maintenancePage.filterNew).toBeVisible();
      await expect(maintenancePage.filterReceived).toBeVisible();
      await expect(maintenancePage.filterStarted).toBeVisible();
      await expect(maintenancePage.filterCompleted).toBeVisible();
    });
  });

  test.describe('Request List', () => {
    test('should display request cards', async ({ api }) => {
      // Seed data
      await api.createMaintenanceRequest({
        title: 'E2E Test Request',
        description: 'Test maintenance request for E2E testing',
        address: '123 Test St',
      });
      await maintenancePage.goto();

      const count = await maintenancePage.getRequestCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should show status badge on each request card', async ({ api }) => {
      await api.createMaintenanceRequest({
        title: 'Badge Test Request',
        description: 'Testing status badges',
      });
      await maintenancePage.goto();

      const firstCard = maintenancePage.requestCards.first();
      const badge = firstCard.getByTestId('request-status-badge');
      await expect(badge).toBeVisible();
    });

    test('should show request title on each card', async ({ api }) => {
      await api.createMaintenanceRequest({
        title: 'Title Display Test',
        description: 'Verifying title shows on card',
      });
      await maintenancePage.goto();

      const firstCard = maintenancePage.requestCards.first();
      const title = firstCard.getByTestId('request-title');
      await expect(title).toBeVisible();
    });
  });

  test.describe('Filtering', () => {
    test('should filter by New status', async () => {
      await maintenancePage.filterByStatus('new');
      const count = await maintenancePage.getRequestCount();
      // All visible cards should have New status
      for (let i = 0; i < Math.min(count, 5); i++) {
        await maintenancePage.expectRequestCardStatus(i, 'New');
      }
    });

    test('should filter by Received status', async () => {
      await maintenancePage.filterByStatus('received');
      const count = await maintenancePage.getRequestCount();
      for (let i = 0; i < Math.min(count, 5); i++) {
        await maintenancePage.expectRequestCardStatus(i, 'Received');
      }
    });

    test('should filter by Started status', async () => {
      await maintenancePage.filterByStatus('started');
      // Verify no mismatched statuses
      const count = await maintenancePage.getRequestCount();
      for (let i = 0; i < Math.min(count, 5); i++) {
        await maintenancePage.expectRequestCardStatus(i, 'Started');
      }
    });

    test('should filter by Completed status', async () => {
      await maintenancePage.filterByStatus('completed');
      const count = await maintenancePage.getRequestCount();
      for (let i = 0; i < Math.min(count, 5); i++) {
        await maintenancePage.expectRequestCardStatus(i, 'Completed');
      }
    });

    test('should show all requests when All filter is selected', async () => {
      await maintenancePage.filterByStatus('new');
      const newCount = await maintenancePage.getRequestCount();

      await maintenancePage.filterByStatus('all');
      const allCount = await maintenancePage.getRequestCount();

      expect(allCount).toBeGreaterThanOrEqual(newCount);
    });
  });

  test.describe('Request Detail', () => {
    test('should show detail panel when selecting a request', async ({ api }) => {
      await api.createMaintenanceRequest({
        title: 'Detail View Test',
        description: 'Testing the detail view',
        address: '456 Detail St',
        phone: '555-9876',
      });
      await maintenancePage.goto();

      await maintenancePage.selectRequest(0);
      await maintenancePage.expectDetailVisible();
    });

    test('should display request details including description', async ({ api }) => {
      await api.createMaintenanceRequest({
        title: 'Full Detail Test',
        description: 'This is a detailed description for testing.',
        address: '789 Full St',
        phone: '555-5555',
        unattendedEntry: true,
      });
      await maintenancePage.goto();

      await maintenancePage.selectRequest(0);
      await expect(maintenancePage.detailDescription).toBeVisible();
      await expect(maintenancePage.detailAddress).toBeVisible();
      await expect(maintenancePage.detailPhone).toBeVisible();
    });

    test('should show submitted by and date info', async ({ api }) => {
      await api.createMaintenanceRequest({
        title: 'Submitter Info Test',
        description: 'Testing submitter info display',
      });
      await maintenancePage.goto();

      await maintenancePage.selectRequest(0);
      await expect(maintenancePage.detailSubmittedBy).toBeVisible();
      await expect(maintenancePage.detailDate).toBeVisible();
    });

    test('should display Details and Comments tabs', async ({ api }) => {
      await api.createMaintenanceRequest({
        title: 'Tabs Test',
        description: 'Testing tabs',
      });
      await maintenancePage.goto();

      await maintenancePage.selectRequest(0);
      await expect(maintenancePage.detailsTab).toBeVisible();
      await expect(maintenancePage.commentsTab).toBeVisible();
    });

    test('should display action buttons', async ({ api }) => {
      await api.createMaintenanceRequest({
        title: 'Actions Test',
        description: 'Testing action buttons',
      });
      await maintenancePage.goto();

      await maintenancePage.selectRequest(0);
      await expect(maintenancePage.receiveRequestButton).toBeVisible();
      await expect(maintenancePage.editDescriptionButton).toBeVisible();
    });
  });

  test.describe('Comments', () => {
    test('should switch to comments tab', async ({ api }) => {
      await api.createMaintenanceRequest({
        title: 'Comments Test',
        description: 'Testing comments',
      });
      await maintenancePage.goto();

      await maintenancePage.selectRequest(0);
      await maintenancePage.commentsTab.click();
      await expect(maintenancePage.commentsSection).toBeVisible();
    });

    test('should display comment input and send button', async ({ api }) => {
      await api.createMaintenanceRequest({
        title: 'Comment Input Test',
        description: 'Testing comment input',
      });
      await maintenancePage.goto();

      await maintenancePage.selectRequest(0);
      await maintenancePage.commentsTab.click();
      await expect(maintenancePage.commentInput).toBeVisible();
      await expect(maintenancePage.commentSendButton).toBeVisible();
    });

    test('should add a comment to a request', async ({ api }) => {
      await api.createMaintenanceRequest({
        title: 'Add Comment Test',
        description: 'Testing adding comments',
      });
      await maintenancePage.goto();

      await maintenancePage.selectRequest(0);
      await maintenancePage.addComment('This is an E2E test comment');
      await maintenancePage.expectCommentVisible('This is an E2E test comment');
    });
  });

  test.describe('Status Actions', () => {
    test('should receive a new request', async ({ api }) => {
      await api.createMaintenanceRequest({
        title: 'Receive Test',
        description: 'Testing receive action',
      });
      await maintenancePage.goto();

      await maintenancePage.filterByStatus('new');
      const count = await maintenancePage.getRequestCount();
      if (count > 0) {
        await maintenancePage.selectRequest(0);
        await maintenancePage.receiveRequestButton.click();
        await expect(maintenancePage.detailStatusBadge).toContainText('Received');
      }
    });
  });

  test.describe('Photos', () => {
    test('should display attached photos grid', async ({ api }) => {
      await api.createMaintenanceRequest({
        title: 'Photos Test',
        description: 'Testing attached photos display',
      });
      await maintenancePage.goto();

      await maintenancePage.selectRequest(0);
      await expect(maintenancePage.detailPhotos).toBeVisible();
    });
  });
});
