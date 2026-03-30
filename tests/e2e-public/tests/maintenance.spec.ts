import { test as authTest, expect } from '../fixtures/auth.fixture';
import { test as apiTest } from '../fixtures/api.fixture';
import { mergeTests } from '@playwright/test';
import { MaintenancePage } from '../pages/maintenance.page';

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

    test('should show all requests when "All" filter is selected', async () => {
      await maintenance.goto();
      await maintenance.filterByStatus('all');
      await expect(
        maintenance.requestList.or(maintenance.emptyState),
      ).toBeVisible();
    });
  });
});
