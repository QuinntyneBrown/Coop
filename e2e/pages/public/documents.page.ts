import { type Locator, type Page, expect } from "@playwright/test";

export class DocumentsPage {
  readonly page: Page;

  // Header
  readonly pageTitle: Locator;

  // Filter tabs
  readonly filterTabs: Locator;
  readonly filterAll: Locator;
  readonly filterNotices: Locator;
  readonly filterBylaws: Locator;
  readonly filterReports: Locator;

  // Document list
  readonly documentList: Locator;
  readonly documentCards: Locator;
  readonly emptyState: Locator;
  readonly error: Locator;
  readonly retryButton: Locator;

  // Document card contents
  readonly documentTitle: Locator;
  readonly documentType: Locator;
  readonly documentDate: Locator;

  // Document detail / viewer
  readonly documentViewer: Locator;
  readonly documentViewerTitle: Locator;
  readonly documentViewerContent: Locator;
  readonly documentViewerText: Locator;
  readonly documentViewerClose: Locator;
  readonly downloadButton: Locator;

  // Loading
  readonly loadingSpinner: Locator;

  // Layout: the logo only; no signed-in parts (L2-REQ-110)
  readonly topBar: Locator;
  readonly logo: Locator;
  readonly notificationBell: Locator;
  readonly menuButton: Locator;
  readonly tabBar: Locator;
  readonly memberLinks: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator('[data-testid="documents-page-title"]');
    this.topBar = page.getByTestId("site-top-bar");
    this.logo = page.getByTestId("site-logo");
    this.notificationBell = page.getByTestId("dashboard-notification-bell");
    this.menuButton = page.getByTestId("dashboard-hamburger-menu");
    this.tabBar = page.getByTestId("bottom-tab-bar");
    this.memberLinks = page.getByRole("link", {
      name: /^(Home|Requests|Messages|Profile)$/,
    });

    this.filterTabs = page.locator('[data-testid="documents-filter-tabs"]');
    this.filterAll = page.locator('[data-testid="documents-filter-all"]');
    this.filterNotices = page.locator(
      '[data-testid="documents-filter-notices"]',
    );
    this.filterBylaws = page.locator('[data-testid="documents-filter-bylaws"]');
    this.filterReports = page.locator(
      '[data-testid="documents-filter-reports"]',
    );

    this.documentList = page.locator('[data-testid="documents-list"]');
    this.documentCards = page.locator('[data-testid="document-card"]');
    this.emptyState = page.locator('[data-testid="documents-empty-state"]');
    this.error = page.getByTestId("documents-error");
    this.retryButton = page.getByTestId("documents-retry");

    this.documentTitle = page.locator('[data-testid="document-card-title"]');
    this.documentType = page.locator('[data-testid="document-card-type"]');
    this.documentDate = page.locator('[data-testid="document-card-date"]');

    this.documentViewer = page.locator('[data-testid="document-viewer"]');
    this.documentViewerTitle = page.locator(
      '[data-testid="document-viewer-title"]',
    );
    this.documentViewerContent = page.locator(
      '[data-testid="document-viewer-content"]',
    );
    this.documentViewerText =
      this.documentViewerContent.locator(".viewer-content");
    this.documentViewerClose = page.locator(
      '[data-testid="document-viewer-close"]',
    );
    this.downloadButton = page.locator('[data-testid="document-download-btn"]');

    this.loadingSpinner = page.locator('[data-testid="documents-loading"]');
  }

  async goto() {
    await this.page.goto("/documents");
  }

  async expectLoaded() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.documentList.or(this.emptyState)).toBeVisible();
  }

  async filterByType(type: "all" | "notices" | "bylaws" | "reports") {
    const filters = {
      all: this.filterAll,
      notices: this.filterNotices,
      bylaws: this.filterBylaws,
      reports: this.filterReports,
    };
    await filters[type].click();
  }

  async openDocument(index: number = 0) {
    await this.documentCards.nth(index).click();
    await expect(this.documentViewer).toBeVisible();
  }

  async closeDocumentViewer() {
    await this.documentViewerClose.click();
    await expect(this.documentViewer).not.toBeVisible();
  }

  async getDocumentCount(): Promise<number> {
    return this.documentCards.count();
  }

  async expectDocumentInList(title: string) {
    await expect(
      this.page.locator(`[data-testid="document-card"]:has-text("${title}")`),
    ).toBeVisible();
  }

  async expectFilterTabsVisible() {
    await expect(this.filterTabs).toBeVisible();
    await expect(this.filterAll).toBeVisible();
    await expect(this.filterNotices).toBeVisible();
    await expect(this.filterBylaws).toBeVisible();
    await expect(this.filterReports).toBeVisible();
  }
}
