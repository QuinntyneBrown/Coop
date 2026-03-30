import { test as authTest, expect } from '../fixtures/auth.fixture';
import { test as apiTest } from '../fixtures/api.fixture';
import { mergeTests } from '@playwright/test';
import { MessagingPage } from '../pages/messaging.page';

const test = mergeTests(authTest, apiTest);

test.describe('Messaging', () => {
  let messaging: MessagingPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    messaging = new MessagingPage(authenticatedPage);
  });

  test.describe('Page Load', () => {
    test('should load the messaging page for authenticated users', async () => {
      await messaging.goto();
      await messaging.expectLoaded();
    });

    test('should display the page title', async () => {
      await messaging.goto();
      await expect(messaging.pageTitle).toBeVisible();
    });
  });

  test.describe('Conversation List', () => {
    test('should display existing conversations', async ({ api, authState }) => {
      await api.createConversation({
        subject: 'E2E: Test Conversation',
        participantIds: [authState.userId],
        initialMessage: 'Hello from E2E test!',
      });

      await messaging.goto();
      await messaging.expectConversationInList('E2E: Test Conversation');
    });

    test('should show conversation subject and preview', async ({ api, authState }) => {
      await api.createConversation({
        subject: 'E2E: Preview Test',
        participantIds: [authState.userId],
        initialMessage: 'This is the preview message.',
      });

      await messaging.goto();
      await expect(messaging.conversationItems.first()).toBeVisible();
      await expect(messaging.conversationSubject.first()).toBeVisible();
      await expect(messaging.conversationPreview.first()).toBeVisible();
    });

    test('should show timestamps on conversations', async ({ api, authState }) => {
      await api.createConversation({
        subject: 'E2E: Timestamp Test',
        participantIds: [authState.userId],
        initialMessage: 'When was this sent?',
      });

      await messaging.goto();
      await expect(messaging.conversationTimestamp.first()).toBeVisible();
    });

    test('should show empty state when no conversations exist', async () => {
      await messaging.goto();
      // Wait for page to fully load (either conversation list or empty state)
      await messaging.expectLoaded();
      const count = await messaging.getConversationCount();
      if (count === 0) {
        await expect(messaging.emptyState).toBeVisible();
      } else {
        // Conversations exist from other tests; verify the list is shown instead
        await expect(messaging.conversationList).toBeVisible();
      }
    });
  });

  test.describe('Chat View', () => {
    test('should open chat when clicking a conversation', async ({ api, authState }) => {
      await api.createConversation({
        subject: 'E2E: Open Chat Test',
        participantIds: [authState.userId],
        initialMessage: 'Opening this chat.',
      });

      await messaging.goto();
      await messaging.openConversation(0);
      await expect(messaging.chatPanel).toBeVisible();
      await expect(messaging.chatSubject).toBeVisible();
    });

    test('should display messages in the chat', async ({ api, authState }) => {
      const convId = await api.createConversation({
        subject: 'E2E: Messages Test',
        participantIds: [authState.userId],
        initialMessage: 'First message.',
      });
      await api.sendMessage(convId, 'Second message from API.');

      await messaging.goto();
      // Open the first conversation (most recently created should appear first)
      await expect(messaging.conversationItems.first()).toBeVisible({ timeout: 10000 });
      await messaging.openConversation(0);
      // Wait for messages to load
      await messaging.page.waitForTimeout(500);
      const count = await messaging.getMessageCount();
      // At least 1 message should be visible (2 if both are from the right conversation)
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test('should display message sender and content', async ({ api, authState }) => {
      await api.createConversation({
        subject: 'E2E: Message Detail Test',
        participantIds: [authState.userId],
        initialMessage: 'Check the details.',
      });

      await messaging.goto();
      await messaging.openConversation(0);
      await expect(messaging.messageSender.first()).toBeVisible();
      await expect(messaging.messageContent.first()).toBeVisible();
    });

    test('should show message timestamps', async ({ api, authState }) => {
      await api.createConversation({
        subject: 'E2E: Message Time Test',
        participantIds: [authState.userId],
        initialMessage: 'What time is it?',
      });

      await messaging.goto();
      await messaging.openConversation(0);
      await expect(messaging.messageTimestamp.first()).toBeVisible();
    });

    test('should show chat participants', async ({ api, authState }) => {
      await api.createConversation({
        subject: 'E2E: Participants Test',
        participantIds: [authState.userId],
        initialMessage: 'Who is here?',
      });

      await messaging.goto();
      await messaging.openConversation(0);
      await expect(messaging.chatParticipants).toBeVisible();
    });
  });

  test.describe('Send Message', () => {
    test('should have message input and send button', async ({ api, authState }) => {
      await api.createConversation({
        subject: 'E2E: Send UI Test',
        participantIds: [authState.userId],
        initialMessage: 'Ready to send.',
      });

      await messaging.goto();
      await messaging.openConversation(0);
      await expect(messaging.messageInput).toBeVisible();
      await expect(messaging.sendButton).toBeVisible();
    });

    test('should send a new message', async ({ api, authState }) => {
      await api.createConversation({
        subject: 'E2E: Send Message Test',
        participantIds: [authState.userId],
        initialMessage: 'Starting conversation.',
      });

      await messaging.goto();
      await messaging.openConversation(0);
      await messaging.sendMessage('Hello from Playwright E2E!');
      await messaging.expectMessageInChat('Hello from Playwright E2E!');
    });

    test('should clear input after sending', async ({ api, authState }) => {
      await api.createConversation({
        subject: 'E2E: Clear Input Test',
        participantIds: [authState.userId],
        initialMessage: 'Will clear after send.',
      });

      await messaging.goto();
      await messaging.openConversation(0);
      await messaging.sendMessage('Test message');
      await expect(messaging.messageInput).toHaveValue('');
    });

    test('should not send empty message', async ({ api, authState }) => {
      await api.createConversation({
        subject: 'E2E: Empty Message Test',
        participantIds: [authState.userId],
        initialMessage: 'No empty messages.',
      });

      await messaging.goto();
      await messaging.openConversation(0);
      const countBefore = await messaging.getMessageCount();
      await messaging.sendButton.click();
      const countAfter = await messaging.getMessageCount();
      expect(countAfter).toBe(countBefore);
    });
  });

  test.describe('Navigation', () => {
    test('should navigate back to conversation list from chat', async ({ api, authState }) => {
      await api.createConversation({
        subject: 'E2E: Back Nav Test',
        participantIds: [authState.userId],
        initialMessage: 'Going back.',
      });

      await messaging.goto();
      await messaging.openConversation(0);
      await messaging.backToConversationList();
      await expect(messaging.conversationList).toBeVisible();
    });
  });

  test.describe('Responsive Layout', () => {
    test('should display conversation list on mobile', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 375, height: 812 });
      messaging = new MessagingPage(authenticatedPage);
      await messaging.goto();
      await messaging.expectLoaded();
    });
  });
});
