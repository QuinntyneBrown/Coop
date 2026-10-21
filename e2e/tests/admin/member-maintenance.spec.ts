// Acceptance Test
// Traces to: L2-REQ-115, L2-REQ-114, L2-REQ-088, L2-REQ-089, L2-REQ-021, L2-REQ-028
// Description: A member uses the admin Maintenance screen: only their own
// requests, plain-words statuses, no office steps, sending a request with
// photos, adding a photo later, and comments.

import { test, expect } from '../../fixtures/admin/auth.fixture';
import { MaintenancePage } from '../../pages/admin/maintenance.page';
import { MEMBER_ID } from '../../fixtures/mock-api/mock-store';

test.describe('Maintenance as a member', () => {
  let maintenance: MaintenancePage;

  test.beforeEach(async ({ memberPage }) => {
    maintenance = new MaintenancePage(memberPage);
  });

  test.describe('Own requests', () => {
    test('Given requests from two households, when the member opens Maintenance, then only their own are listed', async () => {
      await maintenance.goto();

      await expect(maintenance.requestCards.filter({ hasText: 'Hallway light flickering' })).toHaveCount(1);
      await expect(maintenance.requestCards.filter({ hasText: 'Radiator valve replaced' })).toHaveCount(1);
      await expect(maintenance.requestCards.filter({ hasText: 'Lobby door closer' })).toHaveCount(0);
      await expect(maintenance.requestCards).toHaveCount(2);
    });

    test('Given a member with no requests, when Maintenance opens, then it says so and offers a new request', async ({
      mockApi,
    }) => {
      mockApi.store.maintenanceRequests = mockApi.store.maintenanceRequests.filter((r) => r.ownerUserId !== MEMBER_ID);

      await maintenance.goto();

      await expect(maintenance.emptyState).toBeVisible();
      await expect(maintenance.createButton).toBeVisible();
    });

    test('Given the member opens their request, then the detail offers no office steps', async () => {
      await maintenance.goto();
      await maintenance.selectRequestByTitle('Hallway light flickering');

      await maintenance.expectDetailVisible();
      await expect(maintenance.receiveRequestButton).toHaveCount(0);
      await expect(maintenance.startWorkButton).toHaveCount(0);
      await expect(maintenance.finishWorkButton).toHaveCount(0);
      await expect(maintenance.editDescriptionButton).toHaveCount(0);
    });
  });

  test.describe('Progress in plain words', () => {
    test('Given the office started a request, then the member sees "Started"', async ({ mockApi }) => {
      mockApi.store.maintenanceRequests.find((r) => r.title === 'Hallway light flickering')!.status = 'Started';

      await maintenance.goto();

      await expect(
        maintenance.requestCards.filter({ hasText: 'Hallway light flickering' }).getByTestId('request-status-badge'),
      ).toHaveText('Started');
    });

    test('Given a completed request, then the member sees "Completed" and can filter by each status', async () => {
      await maintenance.goto();

      await expect(
        maintenance.requestCards.filter({ hasText: 'Radiator valve replaced' }).getByTestId('request-status-badge'),
      ).toHaveText('Completed');
      for (const filter of [maintenance.filterAll, maintenance.filterNew, maintenance.filterReceived, maintenance.filterStarted, maintenance.filterCompleted]) {
        await expect(filter).toBeVisible();
      }
      await maintenance.filterByStatus('completed');
      await expect(maintenance.requestCards).toHaveCount(1);
    });
  });

  test.describe('Sending a request', () => {
    test('Given a filled form, when the member sends it, then the request is listed as New', async () => {
      await maintenance.goto();
      await maintenance.openCreate();
      await maintenance.fillRequest('Kitchen drawer stuck', 'The top kitchen drawer will not open.');

      await maintenance.submit();

      await expect(maintenance.createDialog).toBeHidden();
      await expect(
        maintenance.requestCards.filter({ hasText: 'Kitchen drawer stuck' }).getByTestId('request-status-badge'),
      ).toHaveText('New');
    });

    test('Given an empty form, when the member sends it, then nothing is sent and each field says what to write', async ({
      mockApi,
    }) => {
      const before = mockApi.store.maintenanceRequests.length;
      await maintenance.goto();
      await maintenance.openCreate();

      await maintenance.submit();

      await expect(maintenance.titleError).toHaveText('Give the request a title');
      await expect(maintenance.descriptionError).toHaveText('Say what is wrong');
      await expect(maintenance.titleInput).toHaveAttribute('aria-invalid', 'true');
      expect(mockApi.store.maintenanceRequests.length).toBe(before);
    });
  });

  test.describe('Photos', () => {
    test('Given the create form, when the member chooses a photo, then it is listed by name with Remove and the hint', async () => {
      await maintenance.goto();
      await maintenance.openCreate();

      await maintenance.choosePhotos(MaintenancePage.photo('leak.png'));

      await expect(maintenance.photoHint).toHaveText('JPEG, PNG or WebP, up to 10 MB each.');
      await expect(maintenance.chosenPhotos).toHaveCount(1);
      await expect(maintenance.chosenPhotos.first()).toContainText('leak.png');
      await maintenance.chosenPhotos.first().getByRole('button', { name: 'Remove leak.png' }).click();
      await expect(maintenance.chosenPhotos).toHaveCount(0);
    });

    test('Given a file that is not a photo, when it is chosen, then it is refused with a plain message', async () => {
      await maintenance.goto();
      await maintenance.openCreate();

      await maintenance.choosePhotos(MaintenancePage.photo('notes.pdf', 'application/pdf'));

      await expect(maintenance.photoError).toHaveText('“notes.pdf” is not a photo we can use. Choose a JPEG, PNG or WebP photo.');
      await expect(maintenance.chosenPhotos).toHaveCount(0);
    });

    test('Given a request with a photo, when the member sends it, then the request shows the photo', async () => {
      await maintenance.goto();
      await maintenance.openCreate();
      await maintenance.fillRequest('Water under the sink', 'There is a puddle under the kitchen sink.');
      await maintenance.choosePhotos(MaintenancePage.photo('puddle.png'));

      await maintenance.submit();

      await expect(maintenance.createDialog).toBeHidden();
      await maintenance.selectRequestByTitle('Water under the sink');
      await expect(maintenance.detailPhotoImages).toHaveCount(1);
      await expect(maintenance.detailPhotoImages.first()).toHaveAttribute('alt', 'Photo 1 of Water under the sink');
    });

    test('Given a photo fails after the request is created, then the page says so and the request is kept', async ({
      mockApi,
    }) => {
      mockApi.failing.add('POST maintenance-requests/:id/photos');
      await maintenance.goto();
      await maintenance.openCreate();
      await maintenance.fillRequest('Cracked tile', 'A bathroom floor tile is cracked.');
      await maintenance.choosePhotos(MaintenancePage.photo('tile.png'));

      await maintenance.submit();

      await expect(maintenance.createDialog).toBeHidden();
      await expect(maintenance.pageAlert).toHaveText(
        'Your request was sent, but a photo could not be added. Open the request to try again.',
      );
      await expect(maintenance.requestCards.filter({ hasText: 'Cracked tile' })).toHaveCount(1);
    });

    test('Given an existing request, when the member adds a photo, then it shows on the request', async () => {
      await maintenance.goto();
      await maintenance.selectRequestByTitle('Hallway light flickering');

      await maintenance.addPhotoToOpenRequest(MaintenancePage.photo('light.png'));

      await expect(maintenance.detailPhotoImages).toHaveCount(1);
    });

    test('Given adding a photo fails, then the detail says to try again', async ({ mockApi }) => {
      mockApi.failing.add('POST maintenance-requests/:id/photos');
      await maintenance.goto();
      await maintenance.selectRequestByTitle('Hallway light flickering');

      await maintenance.addPhotoToOpenRequest(MaintenancePage.photo('light.png'));

      await expect(maintenance.addPhotoError).toHaveText('The photo could not be added. Please try again.');
    });
  });

  test.describe('Comments', () => {
    test('Given a comment from the office on the member\'s request, then the member reads it and can reply', async () => {
      await maintenance.goto();
      await maintenance.selectRequestByTitle('Radiator valve replaced');
      await maintenance.commentsTab.click();

      await maintenance.expectCommentVisible('Replaced the valve and tested for leaks.');
      await maintenance.addComment('Thank you, it is warm again.');
      await maintenance.expectCommentVisible('Thank you, it is warm again.');
    });

    test('Given comments on another household\'s request, then the member never sees them', async ({ mockApi }) => {
      const theirs = mockApi.store.maintenanceRequests.find((r) => r.title === 'Lobby door closer')!;
      mockApi.addComment(mockApi.store.users.find((u) => u.username === 'board')!, theirs.maintenanceRequestId, 'A note for the board only.');
      await maintenance.goto();
      await maintenance.selectRequestByTitle('Hallway light flickering');
      await maintenance.commentsTab.click();

      await expect(maintenance.commentsSection.getByText('A note for the board only.')).toHaveCount(0);
    });
  });
});
