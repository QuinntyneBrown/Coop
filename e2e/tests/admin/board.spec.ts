// Acceptance Test
// Traces to: L2-REQ-085, L2-REQ-086
// Description: An office administrator keeps the Board of Directors list the
// home page shows: list, empty and error states, the editor dialog with its
// validation, failed save and prefilled edit, reordering, the remove
// confirmation, the public home page reflecting the saved list, and the admin
// landing page showing the same list.

import { test, expect } from '../../fixtures/admin/api.fixture';
import { BoardPage } from '../../pages/admin/board.page';
import { AdminLandingPage } from '../../pages/admin/landing.page';
import { SidebarComponent } from '../../pages/admin/sidebar.component';

const SEEDED = ['Beatrice Hollis', 'Rosalind Petrov', 'Harriet Lindqvist'];

test.describe('Board of Directors', () => {
  let board: BoardPage;
  let sidebar: SidebarComponent;

  test.beforeEach(async ({ authenticatedPage }) => {
    board = new BoardPage(authenticatedPage);
    sidebar = new SidebarComponent(authenticatedPage);
  });

  test.describe('List', () => {
    test('shows the directors from the sidebar in the order the home page shows them', async () => {
      await board.goto();
      await board.expectPageLoaded();
      await sidebar.expectActiveLink('website');
      await expect(board.names).toHaveText(SEEDED);
      await expect(board.cardTitle('Rosalind Petrov')).toHaveText('Treasurer');
      await expect(board.moveUpButton(SEEDED[0])).toBeDisabled();
      await expect(board.moveDownButton(SEEDED[2])).toBeDisabled();
    });

    test('says when no director is listed yet', async ({ mockApi }) => {
      mockApi.store.jsonContents = mockApi.store.jsonContents.filter(
        (j) => j.name !== 'BoardOfDirectors',
      );
      await board.goto();
      await expect(board.empty).toContainText('No directors listed yet');
      await expect(board.empty.getByRole('button', { name: 'Add director' })).toBeVisible();
      await expect(board.cards).toHaveCount(0);
    });

    test('offers Try again when the list cannot be loaded', async ({ mockApi }) => {
      mockApi.failing.add('GET board-of-directors');
      await board.goto();
      await expect(board.error).toContainText(
        "We couldn't load the board list. Check your connection and try again.",
      );
      mockApi.failing.clear();
      await board.retryButton.click();
      await expect(board.names).toHaveText(SEEDED);
      await expect(board.error).toBeHidden();
    });
  });

  test.describe('Add director', () => {
    test('opens the editor with focus inside it and closes it with Cancel or Escape', async ({
      authenticatedPage,
    }) => {
      await board.goto();
      await board.openEditor();
      await expect(board.editorHeading).toHaveText('Add director');
      await expect(board.nameInput).toBeFocused();
      await board.cancelButton.click();
      await expect(board.editor).toBeHidden();
      await expect(board.addButton).toBeFocused();
      await board.openEditor();
      await authenticatedPage.keyboard.press('Escape');
      await expect(board.editor).toBeHidden();
    });

    test('adds a director at the end of the list and on the public home page', async () => {
      await board.goto();
      await board.openEditor();
      await board.fillEditor({ name: 'Winifred Osei', title: 'Member at large' });
      await board.save();
      await expect(board.editor).toBeHidden();
      await expect(board.notice).toHaveText('“Winifred Osei” is now on the board list.');
      await expect(board.names).toHaveText([...SEEDED, 'Winifred Osei']);

      const home = await board.openPublicHomePage();
      await expect(home.boardMembers).toHaveCount(4);
      await expect(home.boardMember('Winifred Osei')).toContainText('Member at large');
    });

    test('keeps the dialog open and marks the missing name and role', async ({ mockApi }) => {
      await board.goto();
      await board.openEditor();
      await board.save();
      await expect(board.editor).toBeVisible();
      await expect(board.nameError).toHaveText("Give the director's name");
      await expect(board.titleError).toHaveText("Give the director's role on the board");
      await expect(board.nameInput).toHaveAttribute('aria-invalid', 'true');
      await expect(board.titleInput).toHaveAttribute('aria-invalid', 'true');
      await expect(board.editorErrors).toBeVisible();
      const stored = mockApi.store.jsonContents.find((j) => j.name === 'BoardOfDirectors')!;
      expect(stored.content['members']).toHaveLength(SEEDED.length);
    });

    test('keeps the entered values and explains when the save fails', async ({ mockApi }) => {
      mockApi.failing.add('PUT board-of-directors');
      await board.goto();
      await board.openEditor();
      await board.fillEditor({ name: 'Winifred Osei', title: 'Member at large' });
      await board.save();
      await expect(board.editor).toBeVisible();
      await expect(board.editorFailed).toHaveText("We couldn't save the board list. Try again.");
      await expect(board.nameInput).toHaveValue('Winifred Osei');
      await expect(board.titleInput).toHaveValue('Member at large');
      mockApi.failing.clear();
      await board.save();
      await expect(board.editor).toBeHidden();
      await expect(board.card('Winifred Osei')).toBeVisible();
    });
  });

  test.describe('Edit director', () => {
    test('opens the editor filled in and saves the changes in the same place', async ({
      mockApi,
    }) => {
      await board.goto();
      await board.openEditorFor('Rosalind Petrov');
      await expect(board.editorHeading).toHaveText('Edit director');
      await expect(board.nameInput).toHaveValue('Rosalind Petrov');
      await expect(board.titleInput).toHaveValue('Treasurer');
      await board.fillEditor({ title: 'Vice-president', photo: '/own/portrait-2.svg' });
      await board.save();
      await expect(board.editor).toBeHidden();
      await expect(board.names).toHaveText(SEEDED);
      await expect(board.cardTitle('Rosalind Petrov')).toHaveText('Vice-president');
      const stored = mockApi.store.jsonContents.find((j) => j.name === 'BoardOfDirectors')!;
      expect(stored.content['members']).toContainEqual({
        name: 'Rosalind Petrov',
        title: 'Vice-president',
        photoUrl: '/own/portrait-2.svg',
      });
    });
  });

  test.describe('Reorder', () => {
    test('moves a director up, saves the order and keeps focus on the director', async () => {
      await board.goto();
      await board.moveUpButton('Harriet Lindqvist').click();
      await expect(board.notice).toHaveText('“Harriet Lindqvist” moved to position 2.');
      await expect(board.names).toHaveText([SEEDED[0], SEEDED[2], SEEDED[1]]);
      await expect(board.moveUpButton('Harriet Lindqvist')).toBeFocused();

      const home = await board.openPublicHomePage();
      await expect(home.boardMembers).toHaveText([
        new RegExp(SEEDED[0]),
        new RegExp(SEEDED[2]),
        new RegExp(SEEDED[1]),
      ]);
    });

    test('restores the saved order and explains when the move cannot be saved', async ({
      mockApi,
    }) => {
      mockApi.failing.add('PUT board-of-directors');
      await board.goto();
      await board.moveDownButton('Beatrice Hollis').click();
      await expect(board.saveError).toHaveText("We couldn't save the board list. Try again.");
      await expect(board.names).toHaveText(SEEDED);
    });
  });

  test.describe('Remove director', () => {
    test('asks for confirmation and removes the director from the home page', async () => {
      await board.goto();
      await board.openRemoveFor('Rosalind Petrov');
      await expect(board.removeHeading).toHaveText(
        'Remove “Rosalind Petrov” from the board list?',
      );
      await board.removeConfirmButton.click();
      await expect(board.removeDialog).toBeHidden();
      await expect(board.notice).toHaveText('“Rosalind Petrov” was removed from the board list.');
      await expect(board.names).toHaveText([SEEDED[0], SEEDED[2]]);

      const home = await board.openPublicHomePage();
      await expect(home.boardMembers).toHaveCount(2);
      await expect(home.boardMember('Rosalind Petrov')).toHaveCount(0);
    });

    test('keeps the director when the confirmation is cancelled', async () => {
      await board.goto();
      await board.openRemoveFor('Rosalind Petrov');
      await board.removeCancelButton.click();
      await expect(board.removeDialog).toBeHidden();
      await expect(board.names).toHaveText(SEEDED);
      await expect(board.card('Rosalind Petrov').getByTestId('director-remove')).toBeFocused();
    });
  });

  test.describe('Admin landing page', () => {
    test('Given a published notice, when the landing page loads, then its date reads like "Oct 13, 2026"', async ({
      authenticatedPage,
    }) => {
      const landing = new AdminLandingPage(authenticatedPage);
      await landing.goto();
      await expect(landing.noticeDates.first()).toHaveText(/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/);
    });

    test('shows the same directors as the Board list, in the same order', async ({
      authenticatedPage,
    }) => {
      const landing = new AdminLandingPage(authenticatedPage);
      await board.goto();
      await expect(board.names).toHaveText(SEEDED);
      await landing.goto();
      await expect(landing.boardMemberNames).toHaveText(SEEDED);
      await expect(landing.boardMember('Rosalind Petrov')).toContainText('Treasurer');
    });

    test('shows a director added on the Board screen', async ({ authenticatedPage }) => {
      const landing = new AdminLandingPage(authenticatedPage);
      await board.goto();
      await board.openEditor();
      await board.fillEditor({ name: 'Agnes Whitlow', title: 'Member at large' });
      await board.save();
      await expect(board.names).toHaveText([...SEEDED, 'Agnes Whitlow']);
      await landing.goto();
      await expect(landing.boardMemberNames).toHaveText([...SEEDED, 'Agnes Whitlow']);
    });
  });

  test.describe('Reflow', () => {
    test('fits a 360 px viewport without horizontal scrolling', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 360, height: 800 });
      await board.goto();
      await board.expectPageLoaded();
      expect(await board.hasHorizontalScroll()).toBe(false);
      await board.openEditor();
      expect(await board.hasHorizontalScroll()).toBe(false);
    });
  });
});
