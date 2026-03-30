import { type Locator, type Page, expect } from '@playwright/test';

export class MaintenancePage {
  readonly page: Page;

  // Left panel - requests list
  readonly requestsPanel: Locator;
  readonly requestsPanelTitle: Locator;
  readonly filterAll: Locator;
  readonly filterNew: Locator;
  readonly filterReceived: Locator;
  readonly filterStarted: Locator;
  readonly filterCompleted: Locator;
  readonly requestCards: Locator;

  // Right panel - detail view
  readonly detailPanel: Locator;
  readonly detailStatusBadge: Locator;
  readonly detailTitle: Locator;
  readonly detailSubmittedBy: Locator;
  readonly detailDate: Locator;
  readonly detailDescription: Locator;
  readonly detailAddress: Locator;
  readonly detailPhone: Locator;
  readonly detailUnattendedEntry: Locator;
  readonly detailPhotos: Locator;

  // Detail tabs
  readonly detailsTab: Locator;
  readonly commentsTab: Locator;

  // Actions
  readonly receiveRequestButton: Locator;
  readonly editDescriptionButton: Locator;

  // Comments
  readonly commentsSection: Locator;
  readonly commentItems: Locator;
  readonly commentInput: Locator;
  readonly commentSendButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.requestsPanel = page.getByTestId('maintenance-requests-panel');
    this.requestsPanelTitle = page.getByTestId('maintenance-requests-title');
    this.filterAll = page.getByTestId('maintenance-filter-all');
    this.filterNew = page.getByTestId('maintenance-filter-new');
    this.filterReceived = page.getByTestId('maintenance-filter-received');
    this.filterStarted = page.getByTestId('maintenance-filter-started');
    this.filterCompleted = page.getByTestId('maintenance-filter-completed');
    this.requestCards = page.getByTestId('maintenance-request-card');

    this.detailPanel = page.getByTestId('maintenance-detail-panel');
    this.detailStatusBadge = page.getByTestId('maintenance-detail-status');
    this.detailTitle = page.getByTestId('maintenance-detail-title');
    this.detailSubmittedBy = page.getByTestId('maintenance-detail-submitted-by');
    this.detailDate = page.getByTestId('maintenance-detail-date');
    this.detailDescription = page.getByTestId('maintenance-detail-description');
    this.detailAddress = page.getByTestId('maintenance-detail-address');
    this.detailPhone = page.getByTestId('maintenance-detail-phone');
    this.detailUnattendedEntry = page.getByTestId('maintenance-detail-unattended');
    this.detailPhotos = page.getByTestId('maintenance-detail-photos');

    this.detailsTab = page.getByTestId('maintenance-tab-details');
    this.commentsTab = page.getByTestId('maintenance-tab-comments');

    this.receiveRequestButton = page.getByTestId('maintenance-receive-button');
    this.editDescriptionButton = page.getByTestId('maintenance-edit-description');

    this.commentsSection = page.getByTestId('maintenance-comments-section');
    this.commentItems = page.getByTestId('maintenance-comment');
    this.commentInput = page.getByTestId('maintenance-comment-input');
    this.commentSendButton = page.getByTestId('maintenance-comment-send');
  }

  async goto() {
    await this.page.goto('/maintenance');
  }

  async expectPageLoaded() {
    await expect(this.requestsPanel).toBeVisible();
    await expect(this.requestsPanelTitle).toHaveText('All Requests');
  }

  async filterByStatus(status: 'all' | 'new' | 'received' | 'started' | 'completed') {
    const filterMap: Record<string, Locator> = {
      all: this.filterAll,
      new: this.filterNew,
      received: this.filterReceived,
      started: this.filterStarted,
      completed: this.filterCompleted,
    };
    await filterMap[status].click();
  }

  async selectRequest(index: number) {
    await this.requestCards.nth(index).click();
  }

  async expectDetailVisible() {
    await expect(this.detailPanel).toBeVisible();
    await expect(this.detailTitle).toBeVisible();
    await expect(this.detailStatusBadge).toBeVisible();
  }

  async expectRequestCardStatus(index: number, status: string) {
    const card = this.requestCards.nth(index);
    const badge = card.getByTestId('request-status-badge');
    await expect(badge).toContainText(status);
  }

  async addComment(text: string) {
    await this.commentsTab.click();
    await this.commentInput.fill(text);
    await this.commentSendButton.click();
  }

  async expectCommentVisible(text: string) {
    await expect(this.commentsSection.getByText(text)).toBeVisible();
  }

  async getRequestCount(): Promise<number> {
    return this.requestCards.count();
  }
}
