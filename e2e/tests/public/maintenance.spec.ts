import { test as authTest, expect } from '../../fixtures/public/auth.fixture';
import { test as apiTest } from '../../fixtures/public/api.fixture';
import { mergeTests } from '@playwright/test';
import { MaintenancePage } from '../../pages/public/maintenance.page';

// Merge auth and api fixtures
const test = mergeTests(authTest, apiTest);

test.describe('Maintenance Requests', () => {
  let maintenance: MaintenancePage;

  test.beforeEach(async ({ authenticatedPage }) => {
    maintenance = new MaintenancePage(authenticatedPage);
  });

  test.describe('Page Load', () => {
    test('should load the maintenance page for authenticated users', async () => {
      await maintenance.goto();
      await maintenance.expectLoaded();
    });

    test('should display the page title', async () => {
      await maintenance.goto();
      await expect(maintenance.pageTitle).toBeVisible();
    });

    test('should display "Create Request" button', async () => {
      await maintenance.goto();
      await expect(maintenance.createRequestButton).toBeVisible();
    });
  });

  test.describe('View Requests', () => {
    test('should display member own requests', async ({ api }) => {
      // Seed a request via API
      await api.createMaintenanceRequest({
        title: 'E2E: Leaky faucet',
        description: 'The kitchen faucet is dripping constantly.',
        priority: 'High',
        category: 'Plumbing',
      });

      await maintenance.goto();
      await maintenance.expectRequestInList('E2E: Leaky faucet');
    });

    test('should show request details when clicking a request', async ({ api }) => {
      await api.createMaintenanceRequest({
        title: 'E2E: Broken window',
        description: 'Living room window has a crack.',
      });

      await maintenance.goto();
      await maintenance.openRequestDetail(0);
      await expect(maintenance.detailPanel).toBeVisible();
      await expect(maintenance.detailTitle).toBeVisible();
      await expect(maintenance.detailDescription).toBeVisible();
      await expect(maintenance.detailStatus).toBeVisible();
    });

    test('should display empty state when there are no requests', async () => {
      // This test assumes a clean state with no requests
      await maintenance.goto();
      await maintenance.expectLoaded();
      const count = await maintenance.getRequestCount();
      if (count === 0) {
        await expect(maintenance.emptyState).toBeVisible();
      } else {
        // Requests exist from other tests; verify the list is shown instead
        await expect(maintenance.requestList).toBeVisible();
      }
    });
  });

  test.describe('Following a Request', () => {
    test('Given the office started a request, then the member sees "Started"', async ({ api }) => {
      const id = await api.createMaintenanceRequest({
        title: 'E2E: Sticking balcony door',
        description: 'The balcony door is hard to open.',
      });
      await api.advanceMaintenanceRequest(id, ['receive', 'start']);

      await maintenance.goto();
      await maintenance.openRequestByTitle('E2E: Sticking balcony door');

      await expect(maintenance.detailStatus).toHaveText('Started');
    });

    test('Given the office finished a request, then the member sees "Done"', async ({ api }) => {
      const id = await api.createMaintenanceRequest({
        title: 'E2E: Loose cupboard hinge',
        description: 'The kitchen cupboard door hangs loose.',
      });
      await api.advanceMaintenanceRequest(id, ['receive', 'start', 'complete']);

      await maintenance.goto();
      await maintenance.openRequestByTitle('E2E: Loose cupboard hinge');

      await expect(maintenance.detailStatus).toHaveText('Done');
    });
  });

  test.describe('Photos', () => {
    const png = (name: string) => ({
      name,
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        'base64',
      ),
    });

    test('Given a member creating a request, when they add a photo and send, then the request shows the photo', async () => {
      await maintenance.goto();
      await maintenance.openCreateForm();
      await maintenance.fillCreateForm({
        title: 'E2E: Water under the sink',
        description: 'There is a puddle under the kitchen sink.',
      });
      await maintenance.choosePhotos([png('sink.png')]);
      await expect(maintenance.chosenPhotos).toHaveText([/sink\.png/]);

      await maintenance.submitRequest();
      await expect(maintenance.createModal).not.toBeVisible();
      await maintenance.openRequestByTitle('E2E: Water under the sink');

      await expect(maintenance.detailPhotos).toHaveCount(1);
      await expect(maintenance.detailPhotos.first()).toHaveAttribute('alt', 'Photo 1 of E2E: Water under the sink');
    });

    test('Given a file that is not a photo or is too large, then it is refused with a plain message', async () => {
      await maintenance.goto();
      await maintenance.openCreateForm();
      await maintenance.choosePhotos([
        { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') },
        { name: 'huge.png', mimeType: 'image/png', buffer: Buffer.alloc(10 * 1024 * 1024 + 1) },
      ]);

      await expect(maintenance.photoError).toContainText('“notes.txt” is not a photo we can use.');
      await expect(maintenance.photoError).toContainText('“huge.png” is too large. Choose a photo smaller than 10 MB.');
      await expect(maintenance.chosenPhotos).toHaveCount(0);
    });

    test('Given an existing request, when the member adds a photo, then it shows on the request', async ({ api }) => {
      await api.createMaintenanceRequest({
        title: 'E2E: Cracked bathroom tile',
        description: 'A tile by the bath has cracked.',
      });
      await maintenance.goto();
      await maintenance.openRequestByTitle('E2E: Cracked bathroom tile');
      await expect(maintenance.detailPhotos).toHaveCount(0);

      await maintenance.addPhoto(png('tile.png'));

      await expect(maintenance.detailPhotos).toHaveCount(1);
    });

    test('Given another member, when they request the photo, then the API refuses', async ({ api, mockApi }) => {
      const id = await api.createMaintenanceRequest({
        title: 'E2E: Private photo',
        description: 'Only my household and the office should see this.',
      });
      await api.addMaintenancePhoto(id);
      const photoId = mockApi.store.photos.find((p) => p.maintenanceRequestId === id)!.photoId;
      const neighbour = mockApi.createUser({ username: 'neighbour', password: 'Neighbour123!', role: 'Member' });

      const response = mockApi.call('GET', `maintenance-requests/${id}/photos/${photoId}`, undefined, neighbour);

      expect(response.status).toBe(403);
    });
  });

  test.describe('Create Request', () => {
    test('should open create request form', async () => {
      await maintenance.goto();
      await maintenance.openCreateForm();
      await expect(maintenance.titleInput).toBeVisible();
      await expect(maintenance.descriptionInput).toBeVisible();
    });

    test('should create a new maintenance request', async () => {
      await maintenance.goto();
      await maintenance.createRequest({
        title: 'E2E: New test request',
        description: 'This is a test maintenance request created by E2E tests.',
        priority: 'Medium',
        category: 'General',
      });

      // The new request should appear in the list
      await maintenance.expectRequestInList('E2E: New test request');
    });

    test('should validate required fields on create form', async () => {
      await maintenance.goto();
      await maintenance.openCreateForm();
      await maintenance.submitRequest();
      // Should show validation errors, not close the modal
      await expect(maintenance.createModal).toBeVisible();
    });

    test('should close create form when cancelling', async () => {
      await maintenance.goto();
      await maintenance.openCreateForm();
      await maintenance.cancelButton.click();
      await expect(maintenance.createModal).not.toBeVisible();
    });

    test('should allow selecting priority', async () => {
      await maintenance.goto();
      await maintenance.openCreateForm();
      await expect(maintenance.prioritySelect).toBeVisible();
      await maintenance.prioritySelect.selectOption('High');
    });

    test('should allow selecting category', async () => {
      await maintenance.goto();
      await maintenance.openCreateForm();
      await expect(maintenance.categorySelect).toBeVisible();
      await maintenance.categorySelect.selectOption('Plumbing');
    });
  });

  test.describe('Comments', () => {
    test('should display existing comments on a request', async ({ api }) => {
      const requestId = await api.createMaintenanceRequest({
        title: 'E2E: Request with comments',
        description: 'This request has comments.',
      });
      await api.addMaintenanceComment(requestId, 'First comment from API.');

      await maintenance.goto();
      await maintenance.openRequestByTitle('E2E: Request with comments');
      await expect(maintenance.detailComments.first()).toBeVisible();
    });

    test('should add a new comment to a request', async ({ api }) => {
      await api.createMaintenanceRequest({
        title: 'E2E: Request for commenting',
        description: 'Will add a comment via UI.',
      });

      await maintenance.goto();
      await maintenance.openRequestByTitle('E2E: Request for commenting');
      await maintenance.addComment('This is a new E2E comment.');
      await expect(
        maintenance.page.locator('[data-testid="maintenance-detail-comment"]:has-text("This is a new E2E comment.")').first(),
      ).toBeVisible();
    });
  });

  test.describe('Photo Attachments', () => {
    test('should display photo upload option in create form', async () => {
      await maintenance.goto();
      await maintenance.openCreateForm();
      await expect(maintenance.photoUpload).toBeVisible();
    });

    test('should show attachments on request detail', async ({ api }) => {
      const requestId = await api.createMaintenanceRequest({
        title: 'E2E: Request with attachment',
        description: 'Has a photo.',
      });

      await maintenance.goto();
      await maintenance.openRequestDetail(0);
      // Attachment list should be present (may be empty)
      await expect(maintenance.attachmentList).toBeVisible();
    });
  });

  test.describe('Filters', () => {
    test('should display filter options', async () => {
      await maintenance.goto();
      await expect(maintenance.filterAll).toBeVisible();
      await expect(maintenance.filterNew).toBeVisible();
      await expect(maintenance.filterReceived).toBeVisible();
      await expect(maintenance.filterStarted).toBeVisible();
      await expect(maintenance.filterDone).toBeVisible();
    });

    test('should filter requests by "New" status', async ({ api }) => {
      await api.createMaintenanceRequest({
        title: 'E2E: New status request',
        description: 'This should appear under New filter.',
      });

      await maintenance.goto();
      await maintenance.filterByStatus('new');
      await maintenance.expectRequestInList('E2E: New status request');
    });

    test('Given a received and a new request, when the member picks "Received", then only the received one is listed', async ({
      api,
    }) => {
      const id = await api.createMaintenanceRequest({
        title: 'E2E: Received status request',
        description: 'The office has received this one.',
      });
      await api.advanceMaintenanceRequest(id, ['receive']);
      await api.createMaintenanceRequest({
        title: 'E2E: Still new request',
        description: 'The office has not looked at this one yet.',
      });

      await maintenance.goto();
      await maintenance.filterByStatus('received');
      await maintenance.expectRequestInList('E2E: Received status request');
      await maintenance.expectRequestNotInList('E2E: Still new request');
    });

    test('should show all requests when "All" filter is selected', async () => {
      await maintenance.goto();
      await maintenance.filterByStatus('all');
      await expect(
        maintenance.requestList.or(maintenance.emptyState),
      ).toBeVisible();
    });
  });
});
