// Acceptance Test
// Traces to: L2-REQ-080
// Description: An office administrator lists, adds, edits and removes the
// website pages from the admin Pages screen: list, empty and error states,
// the editor dialog with its validation, duplicate-title check, failed save
// and prefilled edit, and the remove confirmation.

import { test, expect } from '../../fixtures/admin/api.fixture';
import { PagesPage } from '../../pages/admin/pages.page';
import { SidebarComponent } from '../../pages/admin/sidebar.component';

test.describe('Pages', () => {
  let pages: PagesPage;
  let sidebar: SidebarComponent;

  test.beforeEach(async ({ authenticatedPage }) => {
    pages = new PagesPage(authenticatedPage);
    sidebar = new SidebarComponent(authenticatedPage);
  });

  test.describe('List', () => {
    test('shows the Pages screen from the sidebar with every page and its address', async ({
      mockApi,
    }) => {
      const seeded = mockApi.store.pages[0];
      await pages.goto();
      await pages.expectPageLoaded();
      await sidebar.expectActiveLink('pages');
      await expect(pages.cards).toHaveCount(1);
      await expect(pages.cardAddress(seeded.title)).toHaveText(`/pages/${seeded.slug}`);
      await expect(pages.card(seeded.title).getByTestId('page-card-edit')).toBeVisible();
      await expect(pages.card(seeded.title).getByTestId('page-card-remove')).toBeVisible();
    });

    test('lists pages oldest first', async ({ mockApi }) => {
      mockApi.createPage({ title: 'Our garden', body: '<p>Tomatoes.</p>' });
      await pages.goto();
      await expect(pages.cards.getByTestId('page-card-title')).toHaveText([
        'How to apply',
        'Our garden',
      ]);
    });

    test('says when there are no pages yet', async ({ mockApi }) => {
      mockApi.store.pages = [];
      await pages.goto();
      await expect(pages.empty).toContainText('No pages yet');
      await expect(pages.empty.getByRole('button', { name: 'New page' })).toBeVisible();
      await expect(pages.cards).toHaveCount(0);
    });

    test('offers Try again when the list cannot be loaded', async ({ mockApi }) => {
      mockApi.failing.add('GET pages');
      await pages.goto();
      await expect(pages.error).toContainText(
        "We couldn't load the pages. Check your connection and try again.",
      );
      mockApi.failing.clear();
      await pages.retryButton.click();
      await expect(pages.cards).toHaveCount(1);
      await expect(pages.error).toBeHidden();
    });
  });

  test.describe('New page', () => {
    test('opens the editor with focus inside it and closes it with Cancel', async ({
      authenticatedPage,
    }) => {
      await pages.goto();
      await pages.openEditor();
      await expect(pages.editorHeading).toHaveText('New page');
      await expect(pages.titleInput).toBeFocused();
      await pages.cancelButton.click();
      await expect(pages.editor).toBeHidden();
      await expect(pages.newPageButton).toBeFocused();
    });

    test('closes the editor on Escape', async ({ authenticatedPage }) => {
      await pages.goto();
      await pages.openEditor();
      await authenticatedPage.keyboard.press('Escape');
      await expect(pages.editor).toBeHidden();
    });

    test('adds a page that appears in the list with a success message', async ({ mockApi }) => {
      await pages.goto();
      await pages.openEditor();
      await pages.fillEditor({
        title: 'About us',
        hero: '/own/lobby.svg',
        body: '<p>Older women built this place.</p>',
      });
      await pages.save();
      await expect(pages.editor).toBeHidden();
      await expect(pages.notice).toHaveText('“About us” is now on the website.');
      await expect(pages.cardAddress('About us')).toHaveText('/pages/about-us');
      const stored = mockApi.store.pages.find((p) => p.slug === 'about-us');
      expect(stored?.heroImageUrl).toBe('/own/lobby.svg');
      expect(stored?.body).toBe('<p>Older women built this place.</p>');
    });

    test('keeps the dialog open and marks the missing title and text', async ({ mockApi }) => {
      const before = mockApi.store.pages.length;
      await pages.goto();
      await pages.openEditor();
      await pages.save();
      await expect(pages.editor).toBeVisible();
      await expect(pages.titleError).toHaveText('Give the page a title');
      await expect(pages.bodyError).toHaveText('Write something for the page');
      await expect(pages.titleInput).toHaveAttribute('aria-invalid', 'true');
      await expect(pages.bodyInput).toHaveAttribute('aria-invalid', 'true');
      await expect(pages.editorErrors).toBeVisible();
      expect(mockApi.store.pages).toHaveLength(before);
    });

    test('refuses a title that another page already has', async ({ mockApi }) => {
      const seeded = mockApi.store.pages[0];
      await pages.goto();
      await pages.openEditor();
      await pages.fillEditor({ title: seeded.title.toUpperCase(), body: '<p>Again.</p>' });
      await pages.save();
      await expect(pages.editor).toBeVisible();
      await expect(pages.titleError).toHaveText(
        `There is already a page called “${seeded.title.toUpperCase()}”. Choose a different title.`,
      );
      expect(mockApi.store.pages).toHaveLength(1);
    });

    test('keeps the entered values and explains when the save fails', async ({ mockApi }) => {
      mockApi.failing.add('POST pages');
      await pages.goto();
      await pages.openEditor();
      await pages.fillEditor({ title: 'Our garden', body: '<p>Tomatoes in August.</p>' });
      await pages.save();
      await expect(pages.editor).toBeVisible();
      await expect(pages.editorFailed).toHaveText("We couldn't save the page. Try again.");
      await expect(pages.titleInput).toHaveValue('Our garden');
      await expect(pages.bodyInput).toHaveValue('<p>Tomatoes in August.</p>');
      mockApi.failing.clear();
      await pages.save();
      await expect(pages.editor).toBeHidden();
      await expect(pages.cardAddress('Our garden')).toHaveText('/pages/our-garden');
    });
  });

  test.describe('Edit page', () => {
    test('opens the editor filled in and saves the changes', async ({ mockApi }) => {
      const seeded = mockApi.store.pages[0];
      await pages.goto();
      await pages.openEditorFor(seeded.title);
      await expect(pages.editorHeading).toHaveText('Edit page');
      await expect(pages.titleInput).toHaveValue(seeded.title);
      await expect(pages.heroInput).toHaveValue(seeded.heroImageUrl ?? '');
      await expect(pages.bodyInput).toHaveValue(seeded.body);
      await pages.fillEditor({ title: 'How to join', body: '<p>One form, one visit.</p>' });
      await pages.save();
      await expect(pages.editor).toBeHidden();
      await expect(pages.notice).toHaveText('“How to join” is now on the website.');
      await expect(pages.cardAddress('How to join')).toHaveText('/pages/how-to-join');
      expect(mockApi.store.pages[0].body).toBe('<p>One form, one visit.</p>');
    });
  });

  test.describe('Remove page', () => {
    test('asks for confirmation and removes the page', async ({ mockApi }) => {
      const seeded = mockApi.store.pages[0];
      await pages.goto();
      await pages.openRemoveFor(seeded.title);
      await expect(pages.removeHeading).toHaveText(`Remove “${seeded.title}”?`);
      await pages.removeConfirmButton.click();
      await expect(pages.removeDialog).toBeHidden();
      await expect(pages.notice).toHaveText(`“${seeded.title}” was removed from the website.`);
      await expect(pages.empty).toBeVisible();
      expect(mockApi.store.pages).toHaveLength(0);
    });

    test('keeps the page when the confirmation is cancelled', async ({ mockApi }) => {
      const seeded = mockApi.store.pages[0];
      await pages.goto();
      await pages.openRemoveFor(seeded.title);
      await pages.removeCancelButton.click();
      await expect(pages.removeDialog).toBeHidden();
      await expect(pages.card(seeded.title)).toBeVisible();
      await expect(pages.card(seeded.title).getByTestId('page-card-remove')).toBeFocused();
      expect(mockApi.store.pages).toHaveLength(1);
    });
  });

  test.describe('Reflow', () => {
    test('fits a 360 px viewport without horizontal scrolling', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 360, height: 800 });
      await pages.goto();
      await pages.expectPageLoaded();
      expect(await pages.hasHorizontalScroll()).toBe(false);
      await pages.openEditor();
      expect(await pages.hasHorizontalScroll()).toBe(false);
    });
  });
});
