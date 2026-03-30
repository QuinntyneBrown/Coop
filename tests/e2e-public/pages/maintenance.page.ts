import { type Locator, type Page, expect } from '@playwright/test';

export class MaintenancePage {
  readonly page: Page;

  // Header
  readonly pageTitle: Locator;
  readonly createRequestButton: Locator;

  // Request list
  readonly requestList: Locator;
  readonly requestCards: Locator;
  readonly emptyState: Locator;

  // Filters
  readonly filterAll: Locator;
  readonly filterNew: Locator;
  readonly filterStarted: Locator;
  readonly filterDone: Locator;

  // Create request form / modal
  readonly createModal: Locator;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly prioritySelect: Locator;
  readonly categorySelect: Locator;
  readonly photoUpload: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  // Request detail
  readonly detailPanel: Locator;
  readonly detailTitle: Locator;
  readonly detailDescription: Locator;
  readonly detailStatus: Locator;
  readonly detailPriority: Locator;
  readonly detailComments: Locator;
  readonly commentInput: Locator;
  readonly addCommentButton: Locator;
  readonly attachmentList: Locator;

  // Loading
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator('[data-testid="maintenance-page-title"]');
    this.createRequestButton = page.locator('[data-testid="maintenance-create-btn"]');

    this.requestList = page.locator('[data-testid="maintenance-request-list"]');
    this.requestCards = page.locator('[data-testid="maintenance-request-card"]');
    this.emptyState = page.locator('[data-testid="maintenance-empty-state"]');

    this.filterAll = page.locator('[data-testid="maintenance-filter-all"]');
    this.filterNew = page.locator('[data-testid="maintenance-filter-new"]');
    this.filterStarted = page.locator('[data-testid="maintenance-filter-started"]');
    this.filterDone = page.locator('[data-testid="maintenance-filter-done"]');

    this.createModal = page.locator('[data-testid="maintenance-create-modal"]');
    this.titleInput = page.locator('[data-testid="maintenance-title-input"]');
    this.descriptionInput = page.locator('[data-testid="maintenance-description-input"]');
    this.prioritySelect = page.locator('[data-testid="maintenance-priority-select"]');
    this.categorySelect = page.locator('[data-testid="maintenance-category-select"]');
    this.photoUpload = page.locator('[data-testid="maintenance-photo-upload"]');
    this.submitButton = page.locator('[data-testid="maintenance-submit-btn"]');
    this.cancelButton = page.locator('[data-testid="maintenance-cancel-btn"]');

    this.detailPanel = page.locator('[data-testid="maintenance-detail-panel"]');
    this.detailTitle = page.locator('[data-testid="maintenance-detail-title"]');
    this.detailDescription = page.locator('[data-testid="maintenance-detail-description"]');
    this.detailStatus = page.locator('[data-testid="maintenance-detail-status"]');
    this.detailPriority = page.locator('[data-testid="maintenance-detail-priority"]');
    this.detailComments = page.locator('[data-testid="maintenance-detail-comment"]');
    this.commentInput = page.locator('[data-testid="maintenance-comment-input"]');
    this.addCommentButton = page.locator('[data-testid="maintenance-add-comment-btn"]');
    this.attachmentList = page.locator('[data-testid="maintenance-attachment-list"]');

    this.loadingSpinner = page.locator('[data-testid="maintenance-loading"]');
  }

  async goto() {
    await this.page.goto('/maintenance');
  }

  async expectLoaded() {
    await expect(this.pageTitle).toBeVisible();
    await expect(
      this.requestList.or(this.emptyState),
    ).toBeVisible();
  }

  async openCreateForm() {
    await this.createRequestButton.click();
    await expect(this.createModal).toBeVisible();
  }

  async fillCreateForm(data: {
    title: string;
    description: string;
    priority?: string;
    category?: string;
  }) {
    await this.titleInput.fill(data.title);
    await this.descriptionInput.fill(data.description);
    if (data.priority) {
      await this.prioritySelect.selectOption(data.priority);
    }
    if (data.category) {
      await this.categorySelect.selectOption(data.category);
    }
  }

  async submitRequest() {
    await this.submitButton.click();
  }

  async createRequest(data: {
    title: string;
    description: string;
    priority?: string;
    category?: string;
  }) {
    await this.openCreateForm();
    await this.fillCreateForm(data);
    await this.submitRequest();
    await expect(this.createModal).not.toBeVisible();
  }

  async openRequestDetail(index: number = 0) {
    await this.requestCards.nth(index).click();
    await expect(this.detailPanel).toBeVisible();
  }

  async addComment(text: string) {
    await this.commentInput.fill(text);
    await this.addCommentButton.click();
  }

  async filterByStatus(status: 'all' | 'new' | 'started' | 'done') {
    const filters = {
      all: this.filterAll,
      new: this.filterNew,
      started: this.filterStarted,
      done: this.filterDone,
    };
    await filters[status].click();
  }

  async getRequestCount(): Promise<number> {
    return this.requestCards.count();
  }

  async expectRequestInList(title: string) {
    await expect(this.page.locator(`[data-testid="maintenance-request-card"]:has-text("${title}")`).first()).toBeVisible();
  }
}
