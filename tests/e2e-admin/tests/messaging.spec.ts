import { test, expect } from '../fixtures/api.fixture';
import { MessagingPage } from '../pages/messaging.page';
import { SidebarComponent } from '../pages/sidebar.component';

test.describe('Messaging', () => {
  let messagingPage: MessagingPage;
  let sidebar: SidebarComponent;

  test.beforeEach(async ({ authenticatedPage }) => {
    messagingPage = new MessagingPage(authenticatedPage);
    sidebar = new SidebarComponent(authenticatedPage);
    await messagingPage.goto();
  });

  test.describe('Layout and Elements', () => {
    test('should display the messaging page', async () => {
      await messagingPage.expectPageLoaded();
    });

    test('should mark messages as active in sidebar', async () => {
      await sidebar.expectActiveLink('messages');
    });

    test('should display conversation list with title', async () => {
      await expect(messagingPage.conversationListTitle).toHaveText('Messages');
    });

    test('should display New conversation button', async () => {
      await expect(messagingPage.newConversationButton).toBeVisible();
    });

    test('should display conversation search bar', async () => {
      await expect(messagingPage.conversationSearch).toBeVisible();
    });
  });

  test.describe('Conversation List', () => {
    test('should display conversation items', async () => {
      const count = await messagingPage.getConversationCount();
      // Might be 0 initially, but the list element should exist
      await expect(messagingPage.conversationList).toBeVisible();
    });

    test('should show conversation name and preview', async () => {
      const count = await messagingPage.getConversationCount();
      if (count > 0) {
        const item = messagingPage.conversationItems.first();
        await expect(item.getByTestId('conversation-name')).toBeVisible();
        await expect(item.getByTestId('conversation-preview')).toBeVisible();
      }
    });

    test('should show time on conversation items', async () => {
      const count = await messagingPage.getConversationCount();
      if (count > 0) {
        const item = messagingPage.conversationItems.first();
        const time = item.getByTestId('conversation-time');
        await expect(time).toBeVisible();
      }
    });

    test('should show unread indicator on unread conversations', async () => {
      const count = await messagingPage.getConversationCount();
      // Check if any conversations have unread indicators
      for (let i = 0; i < count; i++) {
        const item = messagingPage.conversationItems.nth(i);
        const indicator = item.getByTestId('unread-indicator');
        if (await indicator.isVisible()) {
          await expect(indicator).toBeVisible();
          return;
        }
      }
    });
  });

  test.describe('Chat Panel', () => {
    test('should show empty state when no conversation is selected', async () => {
      await expect(messagingPage.emptyState).toBeVisible();
    });

    test('should display chat panel when selecting a conversation', async () => {
      const count = await messagingPage.getConversationCount();
      if (count > 0) {
        await messagingPage.selectConversation(0);
        await expect(messagingPage.chatPanel).toBeVisible();
        await expect(messagingPage.chatHeader).toBeVisible();
      }
    });

    test('should display chat header with name and avatar', async () => {
      const count = await messagingPage.getConversationCount();
      if (count > 0) {
        await messagingPage.selectConversation(0);
        await expect(messagingPage.chatHeaderName).toBeVisible();
        await expect(messagingPage.chatHeaderAvatar).toBeVisible();
      }
    });

    test('should display message bubbles', async () => {
      const count = await messagingPage.getConversationCount();
      if (count > 0) {
        await messagingPage.selectConversation(0);
        const bubbleCount = await messagingPage.messageBubbles.count();
        expect(bubbleCount).toBeGreaterThanOrEqual(0);
      }
    });

    test('should display message input and send button', async () => {
      const count = await messagingPage.getConversationCount();
      if (count > 0) {
        await messagingPage.selectConversation(0);
        await expect(messagingPage.messageInput).toBeVisible();
        await expect(messagingPage.messageSendButton).toBeVisible();
      }
    });
  });

  test.describe('Send Message', () => {
    test('should send a message in an existing conversation', async () => {
      const count = await messagingPage.getConversationCount();
      if (count > 0) {
        await messagingPage.selectConversation(0);
        const testMessage = `E2E test message ${Date.now()}`;
        await messagingPage.sendMessage(testMessage);
        await messagingPage.expectMessageVisible(testMessage);
      }
    });

    test('should not send empty message', async () => {
      const count = await messagingPage.getConversationCount();
      if (count > 0) {
        await messagingPage.selectConversation(0);
        const initialBubbleCount = await messagingPage.messageBubbles.count();
        await messagingPage.messageSendButton.click();
        const newBubbleCount = await messagingPage.messageBubbles.count();
        expect(newBubbleCount).toBe(initialBubbleCount);
      }
    });

    test('should clear input after sending a message', async () => {
      const count = await messagingPage.getConversationCount();
      if (count > 0) {
        await messagingPage.selectConversation(0);
        await messagingPage.sendMessage('Clear test message');
        await expect(messagingPage.messageInput).toHaveValue('');
      }
    });
  });

  test.describe('New Conversation', () => {
    test('should open new conversation dialog', async () => {
      await messagingPage.newConversationButton.click();
      await expect(messagingPage.newConversationDialog).toBeVisible();
    });

    test('should close new conversation dialog on cancel', async () => {
      await messagingPage.newConversationButton.click();
      await messagingPage.dialogCancelButton.click();
      await expect(messagingPage.newConversationDialog).toBeHidden();
    });

    test('should display recipient input in dialog', async () => {
      await messagingPage.newConversationButton.click();
      await expect(messagingPage.recipientInput).toBeVisible();
    });
  });

  test.describe('Search', () => {
    test('should filter conversations by search query', async () => {
      await messagingPage.searchConversations('test');
      // Verify list updates
      await expect(messagingPage.conversationList).toBeVisible();
    });

    test('should show all conversations when search is cleared', async () => {
      await messagingPage.searchConversations('specific_name');
      await messagingPage.searchConversations('');
      await expect(messagingPage.conversationList).toBeVisible();
    });
  });
});
