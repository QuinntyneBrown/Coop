import { test, expect } from '../../fixtures/admin/api.fixture';
import { MaintenancePage } from '../../pages/admin/maintenance.page';
import { SidebarComponent } from '../../pages/admin/sidebar.component';

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

    test('Given a filter is selected, then the list heading names it', async () => {
      const headings = {
        new: 'New Requests',
        received: 'Received Requests',
        started: 'Started Requests',
        completed: 'Completed Requests',
        all: 'All Requests',
      } as const;
      for (const [status, heading] of Object.entries(headings)) {
        await maintenancePage.filterByStatus(status as keyof typeof headings);
        await expect(maintenancePage.requestsPanelTitle).toHaveText(heading);
      }
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

    test('Given a request, when the office views the list and detail, then dates read like "Oct 13, 2026, 8:00 AM"', async ({
      api,
    }) => {
      await api.createMaintenanceRequest({
        title: 'Date Format Test',
        description: 'Testing the readable date format',
      });
      await maintenancePage.goto();

      const readable = /^[A-Z][a-z]{2} \d{1,2}, \d{4}, \d{1,2}:\d{2} [AP]M$/;
      await maintenancePage.expectRequestCardDate(0, readable);
      await maintenancePage.selectRequest(0);
      await expect(maintenancePage.detailDate).toContainText(/[A-Z][a-z]{2} \d{1,2}, \d{4}, \d{1,2}:\d{2} [AP]M/);
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

    test('Given the requester has a profile picture, when the office opens the request, then it shows beside Submitted by', async ({
      api,
    }) => {
      const request = await api.createMaintenanceRequest({
        title: 'Submitter Photo Test',
        description: 'Testing the submitter picture',
      });
      await api.post(`profiles/${request.requestedByProfileId}/avatar`, {
        fileName: 'me.png',
        contentType: 'image/png',
        size: 68,
      });
      await maintenancePage.goto();

      await maintenancePage.selectRequest(0);

      await expect(maintenancePage.detailSubmitterPhoto).toHaveAttribute('src', /\/api\/digitalasset\/serve\//);
    });

    test('Given the requester has no profile picture, then no picture shows beside Submitted by', async ({ api }) => {
      await api.createMaintenanceRequest({
        title: 'Submitter Without Photo',
        description: 'Testing no submitter picture',
      });
      await maintenancePage.goto();

      await maintenancePage.selectRequest(0);

      await expect(maintenancePage.detailSubmittedBy).toBeVisible();
      await expect(maintenancePage.detailSubmitterPhoto).toHaveCount(0);
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

  test.describe('Start and Finish', () => {
    test('Given a received request, when the office starts it, then it shows as Started', async ({ api }) => {
      const request = await api.createMaintenanceRequest({
        title: 'Start Test',
        description: 'Testing the start action',
      });
      await api.put('/api/maintenancerequest/receive', { maintenanceRequestId: request.id });
      await maintenancePage.goto();

      await maintenancePage.selectRequestByTitle('Start Test');
      await expect(maintenancePage.receiveRequestButton).toHaveCount(0);
      await maintenancePage.startWork();

      await expect(maintenancePage.detailStatusBadge).toHaveText('Started');
      await expect(maintenancePage.startWorkButton).toHaveCount(0);
      await expect(maintenancePage.finishWorkButton).toBeVisible();
    });

    test('Given a started request, when the office finishes it, then it shows as Completed with no next step', async ({ api }) => {
      const request = await api.createMaintenanceRequest({
        title: 'Finish Test',
        description: 'Testing the finish action',
      });
      await api.put('/api/maintenancerequest/receive', { maintenanceRequestId: request.id });
      await api.put('/api/maintenancerequest/start', { maintenanceRequestId: request.id });
      await maintenancePage.goto();

      await maintenancePage.selectRequestByTitle('Finish Test');
      await maintenancePage.finishWork();

      await expect(maintenancePage.detailStatusBadge).toHaveText('Completed');
      await expect(maintenancePage.finishWorkButton).toHaveCount(0);
      await expect(maintenancePage.receiveRequestButton).toHaveCount(0);
    });

    test('Given a new request, when finish is posted, then the API rejects it', async ({ api }) => {
      const request = await api.createMaintenanceRequest({
        title: 'Skip Test',
        description: 'Testing a skipped step',
      });

      await expect(
        api.put('/api/maintenancerequest/complete', { maintenanceRequestId: request.id }),
      ).rejects.toThrow(/400.*Only a started request can be finished/);
    });
  });

  test.describe('Photos', () => {
    test('Given a request with a photo, when the office opens it, then the photo shows on the detail', async ({ api }) => {
      const request = await api.createMaintenanceRequest({
        title: 'Photo View Test',
        description: 'A request the household added a photo to',
      });
      await api.post(`/api/maintenance-requests/${request.id}/photos`, {
        fileName: 'leak.png',
        contentType: 'image/png',
        size: 68,
      });
      await maintenancePage.goto();

      await maintenancePage.selectRequestByTitle('Photo View Test');

      await expect(maintenancePage.detailPhotoImages).toHaveCount(1);
      await expect(maintenancePage.detailPhotoImages.first()).toHaveAttribute('alt', 'Photo 1 of Photo View Test');
    });

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
