// Acceptance Test
// Traces to: L2-REQ-112, L2-REQ-114, L2-REQ-036, L2-REQ-037
// Description: A member's dashboard, documents and messages on the admin
// site: no office counts or actions, read-only published documents, and only
// their own conversations.

import { test, expect } from '../../fixtures/admin/auth.fixture';
import { DashboardPage } from '../../pages/admin/dashboard.page';
import { DocumentsPage } from '../../pages/admin/documents.page';
import { MessagingPage } from '../../pages/admin/messaging.page';
import { ADMIN_ID, hoursAgo, newId } from '../../fixtures/mock-api/mock-store';

test.describe('The member view', () => {
  test.describe('Dashboard', () => {
    test('Given a member, when the dashboard loads, then it shows their counts and actions only', async ({ memberPage }) => {
      const dashboard = new DashboardPage(memberPage);
      await dashboard.goto();

      await expect(dashboard.openRequestsCard).toBeVisible();
      await expect(dashboard.unreadMessagesCard).toBeVisible();
      await expect(dashboard.documentsCard).toBeVisible();
      await expect(dashboard.activeMembersCard).toHaveCount(0);
      await expect(dashboard.newMaintenanceAction).toBeVisible();
      await expect(dashboard.newMessageAction).toBeVisible();
      await expect(dashboard.createDocumentAction).toHaveCount(0);
      await expect(dashboard.sendInvitationAction).toHaveCount(0);
    });

    test('Given requests from two households, when the dashboard loads, then only the member\'s own are recent', async ({
      memberPage,
    }) => {
      const dashboard = new DashboardPage(memberPage);
      await dashboard.goto();

      await expect(dashboard.maintenanceRequestItems).toHaveCount(2);
      await expect(dashboard.recentMaintenanceSection).toContainText('Hallway light flickering');
      await expect(dashboard.recentMaintenanceSection).not.toContainText('Lobby door closer');
    });

    test('Given the office, when the dashboard loads, then it still shows Active members and every quick action', async ({
      authenticatedPage,
    }) => {
      const dashboard = new DashboardPage(authenticatedPage);
      await dashboard.goto();

      await expect(dashboard.activeMembersCard).toBeVisible();
      await expect(dashboard.createDocumentAction).toBeVisible();
      await expect(dashboard.sendInvitationAction).toBeVisible();
    });
  });

  test.describe('Documents', () => {
    test('Given a published and a draft document, when a member opens Documents, then only published ones show and nothing can be changed', async ({
      memberPage,
    }) => {
      const documents = new DocumentsPage(memberPage);
      await documents.goto();

      await expect(documents.documentCards.filter({ hasText: 'Spring Garden Workday' })).toHaveCount(1);
      await expect(documents.documentCards.filter({ hasText: 'Annual Financial Report' })).toHaveCount(0);
      await expect(documents.newDocumentButton).toHaveCount(0);
      await expect(documents.documentCards.getByTestId('document-delete-button')).toHaveCount(0);
    });

    test('Given a member, when they open a document, then it shows in the viewer', async ({ memberPage }) => {
      const documents = new DocumentsPage(memberPage);
      await documents.goto();

      await documents.clickDocumentCard(0);

      await expect(memberPage.getByRole('dialog')).toBeVisible();
    });
  });

  test.describe('Messages', () => {
    test('Given conversations of other people, when a member opens Messages, then only their own are listed', async ({
      memberPage,
      mockApi,
    }) => {
      const board = mockApi.store.users.find((u) => u.username === 'board')!;
      const conversationId = newId();
      mockApi.store.conversations.push({
        conversationId,
        subject: 'Board budget',
        participantUserIds: [ADMIN_ID, board.userId],
        createdOn: hoursAgo(2),
      });
      mockApi.store.messages.push({
        messageId: newId(),
        conversationId,
        senderUserId: board.userId,
        body: 'The budget draft is ready.',
        createdOn: hoursAgo(2),
      });
      const messaging = new MessagingPage(memberPage);
      await messaging.goto();

      await expect(messaging.conversationItems).toHaveCount(1);
      await expect(messaging.conversationList).not.toContainText('Board budget');
    });

    test('Given the member\'s conversation, when they reply, then the reply shows', async ({ memberPage }) => {
      const messaging = new MessagingPage(memberPage);
      await messaging.goto();
      await messaging.selectConversation(0);

      await messaging.sendMessage('Thank you for the welcome.');

      await messaging.expectMessageVisible('Thank you for the welcome.');
    });
  });
});
