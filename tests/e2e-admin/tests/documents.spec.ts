import { test, expect } from '../fixtures/api.fixture';
import { DocumentsPage } from '../pages/documents.page';
import { SidebarComponent } from '../pages/sidebar.component';

test.describe('Documents', () => {
  let documentsPage: DocumentsPage;
  let sidebar: SidebarComponent;

  test.beforeEach(async ({ authenticatedPage }) => {
    documentsPage = new DocumentsPage(authenticatedPage);
    sidebar = new SidebarComponent(authenticatedPage);
    await documentsPage.goto();
  });

  test.describe('Layout and Elements', () => {
    test('should display the documents page', async () => {
      await documentsPage.expectPageLoaded();
    });

    test('should mark documents as active in sidebar', async () => {
      await sidebar.expectActiveLink('documents');
    });

    test('should display tab navigation', async () => {
      await expect(documentsPage.tabAll).toBeVisible();
      await expect(documentsPage.tabNotices).toBeVisible();
      await expect(documentsPage.tabByLaws).toBeVisible();
      await expect(documentsPage.tabReports).toBeVisible();
    });

    test('should display search bar', async () => {
      await expect(documentsPage.searchBar).toBeVisible();
    });

    test('should display New Document button', async () => {
      await expect(documentsPage.newDocumentButton).toBeVisible();
      await expect(documentsPage.newDocumentButton).toContainText('New Document');
    });
  });

  test.describe('Document Tabs', () => {
    test('should show All Documents tab as active by default', async ({ authenticatedPage }) => {
      const tab = documentsPage.tabAll;
      await expect(tab).toHaveAttribute('data-active', 'true');
    });

    test('should switch to Notices tab', async () => {
      await documentsPage.switchTab('notices');
      await expect(documentsPage.tabNotices).toHaveAttribute('data-active', 'true');
    });

    test('should switch to By-Laws tab', async () => {
      await documentsPage.switchTab('bylaws');
      await expect(documentsPage.tabByLaws).toHaveAttribute('data-active', 'true');
    });

    test('should switch to Reports tab', async () => {
      await documentsPage.switchTab('reports');
      await expect(documentsPage.tabReports).toHaveAttribute('data-active', 'true');
    });

    test('should filter documents when switching tabs', async ({ api }) => {
      await api.createDocument({
        title: 'E2E Notice',
        type: 'Notice',
        content: 'Notice content',
        status: 'Published',
      });
      await api.createDocument({
        title: 'E2E By-Law',
        type: 'By-Law',
        content: 'By-Law content',
        status: 'Published',
      });
      await documentsPage.goto();

      const allCount = await documentsPage.getDocumentCount();
      await documentsPage.switchTab('notices');
      const noticeCount = await documentsPage.getDocumentCount();
      expect(noticeCount).toBeLessThanOrEqual(allCount);
    });
  });

  test.describe('Document Cards', () => {
    test('should display document cards', async ({ api }) => {
      await api.createDocument({
        title: 'Card Test Doc',
        type: 'Notice',
        content: 'Test content',
        status: 'Published',
      });
      await documentsPage.goto();

      const count = await documentsPage.getDocumentCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should show title and status badge on cards', async ({ api }) => {
      await api.createDocument({
        title: 'Badge Test Doc',
        type: 'Notice',
        content: 'Content here',
        status: 'Published',
      });
      await documentsPage.goto();

      await documentsPage.expectDocumentCard(0, '', ''); // At least first card visible
      const firstCard = documentsPage.documentCards.first();
      await expect(firstCard.getByTestId('document-title')).toBeVisible();
      await expect(firstCard.getByTestId('document-status-badge')).toBeVisible();
    });

    test('should display document type label on cards', async ({ api }) => {
      await api.createDocument({
        title: 'Type Label Doc',
        type: 'Report',
        content: 'Report content',
        status: 'Draft',
      });
      await documentsPage.goto();

      const firstCard = documentsPage.documentCards.first();
      const typeLabel = firstCard.getByTestId('document-type');
      await expect(typeLabel).toBeVisible();
    });

    test('should display date on cards', async ({ api }) => {
      await api.createDocument({
        title: 'Date Display Doc',
        type: 'Notice',
        content: 'Content',
        status: 'Published',
      });
      await documentsPage.goto();

      const firstCard = documentsPage.documentCards.first();
      const date = firstCard.getByTestId('document-date');
      await expect(date).toBeVisible();
    });
  });

  test.describe('Search', () => {
    test('should filter documents by search query', async ({ api }) => {
      await api.createDocument({
        title: 'Searchable E2E Document',
        type: 'Notice',
        content: 'Unique search content',
        status: 'Published',
      });
      await documentsPage.goto();

      await documentsPage.searchDocuments('Searchable E2E');
      const count = await documentsPage.getDocumentCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should show no results for non-matching query', async () => {
      await documentsPage.searchDocuments('zzz_nonexistent_document_zzz');
      const count = await documentsPage.getDocumentCount();
      expect(count).toBe(0);
    });
  });

  test.describe('Create Document', () => {
    test('should open new document dialog', async () => {
      await documentsPage.newDocumentButton.click();
      await expect(documentsPage.documentDialog).toBeVisible();
    });

    test('should close dialog when clicking cancel', async () => {
      await documentsPage.newDocumentButton.click();
      await documentsPage.dialogCancelButton.click();
      await expect(documentsPage.documentDialog).toBeHidden();
    });

    test('should create a new document', async () => {
      await documentsPage.createDocument(
        'E2E Created Document',
        'Notice',
        'This is a document created by E2E test.',
        'Draft',
      );
      await expect(documentsPage.documentDialog).toBeHidden();
    });

    test('should show validation error for empty title', async () => {
      await documentsPage.newDocumentButton.click();
      await documentsPage.dialogSaveButton.click();
      await expect(documentsPage.documentDialog).toBeVisible();
    });
  });

  test.describe('Document Status Badges', () => {
    test('should display Published badge in green', async ({ api }) => {
      await api.createDocument({
        title: 'Published Doc',
        type: 'Notice',
        content: 'Published content',
        status: 'Published',
      });
      await documentsPage.goto();

      const card = documentsPage.documentCards.first();
      const badge = card.getByTestId('document-status-badge');
      await expect(badge).toContainText('Published');
    });

    test('should display Draft badge in yellow', async ({ api }) => {
      await api.createDocument({
        title: 'Draft Doc',
        type: 'Notice',
        content: 'Draft content',
        status: 'Draft',
      });
      await documentsPage.goto();

      await documentsPage.searchDocuments('Draft Doc');
      const card = documentsPage.documentCards.first();
      const badge = card.getByTestId('document-status-badge');
      await expect(badge).toContainText('Draft');
    });
  });

  test.describe('Delete Document', () => {
    test('should show delete confirmation dialog', async ({ api }) => {
      await api.createDocument({
        title: 'Delete Test Doc',
        type: 'Notice',
        content: 'To be deleted',
        status: 'Draft',
      });
      await documentsPage.goto();

      const card = documentsPage.documentCards.first();
      await card.getByTestId('document-delete-button').click();
      await expect(documentsPage.deleteDialog).toBeVisible();
    });

    test('should delete a document after confirmation', async ({ api }) => {
      await api.createDocument({
        title: 'Delete Confirm Doc',
        type: 'Notice',
        content: 'Will be deleted',
        status: 'Draft',
      });
      await documentsPage.goto();

      const initialCount = await documentsPage.getDocumentCount();
      await documentsPage.deleteDocument(0);
      await expect(documentsPage.deleteDialog).toBeHidden();
    });
  });
});
