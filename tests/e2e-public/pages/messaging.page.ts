import { type Locator, type Page, expect } from '@playwright/test';

export class MessagingPage {
  readonly page: Page;

  // Header
  readonly pageTitle: Locator;

  // Conversation list
  readonly conversationList: Locator;
  readonly conversationItems: Locator;
  readonly conversationSubject: Locator;
  readonly conversationPreview: Locator;
  readonly conversationTimestamp: Locator;
  readonly unreadBadge: Locator;
  readonly emptyState: Locator;

  // Chat view
  readonly chatPanel: Locator;
  readonly chatSubject: Locator;
  readonly chatParticipants: Locator;
  readonly messageList: Locator;
  readonly messageBubbles: Locator;
  readonly messageInput: Locator;
  readonly sendButton: Locator;
  readonly backToListButton: Locator;

  // Message bubble details
  readonly messageSender: Locator;
  readonly messageContent: Locator;
  readonly messageTimestamp: Locator;

  // Loading
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator('[data-testid="messaging-page-title"]');

    this.conversationList = page.locator('[data-testid="messaging-conversation-list"]');
    this.conversationItems = page.locator('[data-testid="messaging-conversation-item"]');
    this.conversationSubject = page.locator('[data-testid="messaging-conversation-subject"]');
    this.conversationPreview = page.locator('[data-testid="messaging-conversation-preview"]');
    this.conversationTimestamp = page.locator('[data-testid="messaging-conversation-timestamp"]');
    this.unreadBadge = page.locator('[data-testid="messaging-unread-badge"]');
    this.emptyState = page.locator('[data-testid="messaging-empty-state"]');

    this.chatPanel = page.locator('[data-testid="messaging-chat-panel"]');
    this.chatSubject = page.locator('[data-testid="messaging-chat-subject"]');
    this.chatParticipants = page.locator('[data-testid="messaging-chat-participants"]');
    this.messageList = page.locator('[data-testid="messaging-message-list"]');
    this.messageBubbles = page.locator('[data-testid="messaging-message-bubble"]');
    this.messageInput = page.locator('[data-testid="messaging-message-input"]');
    this.sendButton = page.locator('[data-testid="messaging-send-btn"]');
    this.backToListButton = page.locator('[data-testid="messaging-back-to-list"]');

    this.messageSender = page.locator('[data-testid="messaging-message-sender"]');
    this.messageContent = page.locator('[data-testid="messaging-message-content"]');
    this.messageTimestamp = page.locator('[data-testid="messaging-message-timestamp"]');

    this.loadingSpinner = page.locator('[data-testid="messaging-loading"]');
  }

  async goto() {
    await this.page.goto('/messaging');
  }

  async expectLoaded() {
    await expect(this.pageTitle).toBeVisible();
    await expect(
      this.conversationList.or(this.emptyState),
    ).toBeVisible();
  }

  async openConversation(index: number = 0) {
    await this.conversationItems.nth(index).click();
    await expect(this.chatPanel).toBeVisible();
  }

  async sendMessage(text: string) {
    await this.messageInput.fill(text);
    await this.sendButton.click();
  }

  async expectMessageInChat(text: string) {
    await expect(
      this.page.locator(`[data-testid="messaging-message-content"]:has-text("${text}")`),
    ).toBeVisible();
  }

  async getConversationCount(): Promise<number> {
    return this.conversationItems.count();
  }

  async getMessageCount(): Promise<number> {
    return this.messageBubbles.count();
  }

  async backToConversationList() {
    await this.backToListButton.click();
    await expect(this.conversationList).toBeVisible();
  }

  async expectConversationInList(subject: string) {
    await expect(
      this.page.locator(`[data-testid="messaging-conversation-item"]:has-text("${subject}")`),
    ).toBeVisible();
  }
}
