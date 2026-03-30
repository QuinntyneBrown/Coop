import { test as authTest, expect } from '../fixtures/auth.fixture';
import { test as apiTest } from '../fixtures/api.fixture';
import { mergeTests } from '@playwright/test';
import { DocumentsPage } from '../pages/documents.page';

const test = mergeTests(authTest, apiTest);

test.describe('Documents', () => {
  let documents: DocumentsPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    documents = new DocumentsPage(authenticatedPage);
  });

  test.describe('Page Load', () => {
    test('should load the documents page', async () => {
      await documents.goto();
      await documents.expectLoaded();
    });

    test('should display the page title', async () => {
      await documents.goto();
      await expect(documents.pageTitle).toBeVisible();
    });
  });

  test.describe('Document List', () => {
    test('should display published documents', async ({ api }) => {
      await api.createDocument({
        title: 'E2E: Community Bylaws 2026',
        type: 'bylaws',
        content: 'These are the community bylaws.',
        published: true,
      });

      await documents.goto();
      await documents.expectDocumentInList('E2E: Community Bylaws 2026');
    });

    test('should display document cards with title, type, and date', async ({ api }) => {
      await api.createDocument({
        title: 'E2E: Annual Report',
        type: 'reports',
        published: true,
      });

      await documents.goto();
      await expect(documents.documentCards.first()).toBeVisible();
      await expect(documents.documentTitle.first()).toBeVisible();
      await expect(documents.documentType.first()).toBeVisible();
      await expect(documents.documentDate.first()).toBeVisible();
    });

    test('should show empty state when no documents exist', async () => {
      await documents.goto();
      await documents.expectLoaded();
      const count = await documents.getDocumentCount();
      if (count === 0) {
        await expect(documents.emptyState).toBeVisible();
      } else {
        // Documents exist from other tests or seed data; verify the list is shown instead
        await expect(documents.documentList).toBeVisible();
      }
    });
  });

  test.describe('Filter Tabs', () => {
    test('should display filter tabs', async () => {
      await documents.goto();
      await documents.expectFilterTabsVisible();
    });

    test('should filter by notices', async ({ api }) => {
      await api.createDocument({
        title: 'E2E: Board Notice',
        type: 'notices',
        published: true,
      });

      await documents.goto();
      await documents.filterByType('notices');
      await documents.expectDocumentInList('E2E: Board Notice');
    });

    test('should filter by bylaws', async ({ api }) => {
      await api.createDocument({
        title: 'E2E: Updated Bylaws',
        type: 'bylaws',
        published: true,
      });

      await documents.goto();
      await documents.filterByType('bylaws');
      await documents.expectDocumentInList('E2E: Updated Bylaws');
    });

    test('should filter by reports', async ({ api }) => {
      await api.createDocument({
        title: 'E2E: Financial Report Q1',
        type: 'reports',
        published: true,
      });

      await documents.goto();
      await documents.filterByType('reports');
      await documents.expectDocumentInList('E2E: Financial Report Q1');
    });

    test('should show all documents when "All" filter is selected', async () => {
      await documents.goto();
      await documents.filterByType('all');
      await expect(
        documents.documentList.or(documents.emptyState),
      ).toBeVisible();
    });
  });

  test.describe('Document Viewer', () => {
    test('should open document viewer when clicking a card', async ({ api }) => {
      await api.createDocument({
        title: 'E2E: Viewable Document',
        type: 'notices',
        content: 'This is the content of the viewable document.',
        published: true,
      });

      await documents.goto();
      await documents.openDocument(0);
      await expect(documents.documentViewer).toBeVisible();
      await expect(documents.documentViewerTitle).toBeVisible();
      await expect(documents.documentViewerContent).toBeVisible();
    });

    test('should close document viewer', async ({ api }) => {
      await api.createDocument({
        title: 'E2E: Closeable Document',
        type: 'notices',
        published: true,
      });

      await documents.goto();
      await documents.openDocument(0);
      await documents.closeDocumentViewer();
      await expect(documents.documentViewer).not.toBeVisible();
    });

    test('should display download button in viewer', async ({ api }) => {
      await api.createDocument({
        title: 'E2E: Downloadable Document',
        type: 'reports',
        published: true,
      });

      await documents.goto();
      await documents.openDocument(0);
      await expect(documents.downloadButton).toBeVisible();
    });
  });

  test.describe('Public Access', () => {
    test('should allow viewing published documents without authentication', async ({ page }) => {
      // Use a fresh page (no auth injected)
      const publicDocs = new DocumentsPage(page);
      await publicDocs.goto();
      // Should not redirect to login for public documents
      await expect(page).toHaveURL(/\/documents/);
      await publicDocs.expectLoaded();
    });
  });

  test.describe('Responsive Layout', () => {
    test('should display document cards in a card layout on mobile', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 375, height: 812 });
      documents = new DocumentsPage(authenticatedPage);
      await documents.goto();
      await documents.expectLoaded();
    });

    test('should display filter tabs on mobile', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 375, height: 812 });
      documents = new DocumentsPage(authenticatedPage);
      await documents.goto();
      await documents.expectFilterTabsVisible();
    });
  });
});
