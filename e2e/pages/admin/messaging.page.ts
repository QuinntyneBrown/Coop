import { type Locator, type Page, expect } from '@playwright/test';

export class MessagingPage {
  readonly page: Page;

  // Conversation list
  readonly conversationList: Locator;
  readonly conversationListTitle: Locator;
  readonly newConversationButton: Locator;
  readonly conversationSearch: Locator;
  readonly conversationItems: Locator;

  // Chat panel
  readonly chatPanel: Locator;
  readonly chatHeader: Locator;
  readonly chatHeaderAvatar: Locator;
  readonly chatHeaderName: Locator;
  readonly messageBubbles: Locator;
  readonly messageInput: Locator;
  readonly messageSendButton: Locator;

  // New conversation dialog
  readonly newConversationDialog: Locator;
  readonly recipientInput: Locator;
  readonly dialogCancelButton: Locator;
  readonly dialogStartButton: Locator;

  // Empty state
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;

    this.conversationList = page.getByTestId('conversation-list');
    this.conversationListTitle = page.getByTestId('conversation-list-title');
    this.newConversationButton = page.getByTestId('new-conversation-button');
    this.conversationSearch = page.getByTestId('conversation-search');
    this.conversationItems = page.getByTestId('conversation-item');

    this.chatPanel = page.getByTestId('chat-panel');
    this.chatHeader = page.getByTestId('chat-header');
    this.chatHeaderAvatar = page.getByTestId('chat-header-avatar');
    this.chatHeaderName = page.getByTestId('chat-header-name');
    this.messageBubbles = page.getByTestId('message-bubble');
    this.messageInput = page.getByTestId('message-input');
    this.messageSendButton = page.getByTestId('message-send-button');

    this.newConversationDialog = page.getByTestId('new-conversation-dialog');
    this.recipientInput = page.getByTestId('new-conversation-recipient');
    this.dialogCancelButton = page.getByTestId('new-conversation-cancel');
    this.dialogStartButton = page.getByTestId('new-conversation-start');

    this.emptyState = page.getByTestId('chat-empty-state');
  }

  async goto() {
    await this.page.goto('/messages');
  }

  async expectPageLoaded() {
    await expect(this.conversationList).toBeVisible();
    await expect(this.conversationListTitle).toHaveText('Messages');
  }

  async selectConversation(index: number) {
    await this.conversationItems.nth(index).click();
  }

  async expectConversationSelected(name: string) {
    await expect(this.chatHeaderName).toHaveText(name);
    await expect(this.chatPanel).toBeVisible();
  }

  async sendMessage(text: string) {
    await this.messageInput.fill(text);
    await this.messageSendButton.click();
  }

  async expectMessageVisible(text: string) {
    await expect(this.chatPanel.getByText(text)).toBeVisible();
  }

  async expectUnreadIndicator(conversationIndex: number) {
    const item = this.conversationItems.nth(conversationIndex);
    const indicator = item.getByTestId('unread-indicator');
    await expect(indicator).toBeVisible();
  }

  async searchConversations(query: string) {
    await this.conversationSearch.fill(query);
    await this.page.waitForTimeout(300);
  }

  async startNewConversation(recipient: string, firstMessage: string) {
    await this.newConversationButton.click();
    await expect(this.newConversationDialog).toBeVisible();
    await this.recipientInput.fill(recipient);
    await this.dialogStartButton.click();
    await this.sendMessage(firstMessage);
  }

  async getConversationCount(): Promise<number> {
    return this.conversationItems.count();
  }

  async expectConversationPreview(index: number, name: string, preview: string) {
    const item = this.conversationItems.nth(index);
    await expect(item.getByTestId('conversation-name')).toContainText(name);
    await expect(item.getByTestId('conversation-preview')).toContainText(preview);
  }
}
