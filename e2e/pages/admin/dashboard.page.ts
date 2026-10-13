import { type Locator, type Page, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  // Top bar
  readonly pageTitle: Locator;
  readonly searchBar: Locator;
  readonly notificationBell: Locator;

  // Metric cards
  readonly metricCards: Locator;
  readonly openRequestsCard: Locator;
  readonly unreadMessagesCard: Locator;
  readonly documentsCard: Locator;
  readonly activeMembersCard: Locator;

  // Recent maintenance requests
  readonly recentMaintenanceSection: Locator;
  readonly maintenanceRequestItems: Locator;

  // Quick actions
  readonly quickActionsPanel: Locator;
  readonly newMaintenanceAction: Locator;
  readonly createDocumentAction: Locator;
  readonly newMessageAction: Locator;
  readonly sendInvitationAction: Locator;

  // Recent notices
  readonly recentNoticesPanel: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.getByTestId('dashboard-page-title');
    this.searchBar = page.getByTestId('dashboard-search');
    this.notificationBell = page.getByTestId('dashboard-notification-bell');

    this.metricCards = page.getByTestId('dashboard-metric-cards');
    this.openRequestsCard = page.getByTestId('metric-open-requests');
    this.unreadMessagesCard = page.getByTestId('metric-unread-messages');
    this.documentsCard = page.getByTestId('metric-documents');
    this.activeMembersCard = page.getByTestId('metric-active-members');

    this.recentMaintenanceSection = page.getByTestId('dashboard-recent-maintenance');
    this.maintenanceRequestItems = page.getByTestId('dashboard-maintenance-item');

    this.quickActionsPanel = page.getByTestId('dashboard-quick-actions');
    this.newMaintenanceAction = page.getByTestId('quick-action-maintenance');
    this.createDocumentAction = page.getByTestId('quick-action-document');
    this.newMessageAction = page.getByTestId('quick-action-message');
    this.sendInvitationAction = page.getByTestId('quick-action-invitation');

    this.recentNoticesPanel = page.getByTestId('dashboard-recent-notices');
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async expectPageLoaded() {
    await expect(this.pageTitle).toHaveText('Dashboard');
    await expect(this.metricCards).toBeVisible();
  }

  async expectMetricCardsVisible() {
    await expect(this.openRequestsCard).toBeVisible();
    await expect(this.unreadMessagesCard).toBeVisible();
    await expect(this.documentsCard).toBeVisible();
    await expect(this.activeMembersCard).toBeVisible();
  }

  async getMetricValue(card: Locator): Promise<string> {
    const valueLocator = card.getByTestId('metric-value');
    return (await valueLocator.textContent()) ?? '';
  }

  async expectQuickActionsVisible() {
    await expect(this.quickActionsPanel).toBeVisible();
    await expect(this.newMaintenanceAction).toBeVisible();
    await expect(this.createDocumentAction).toBeVisible();
    await expect(this.newMessageAction).toBeVisible();
    await expect(this.sendInvitationAction).toBeVisible();
  }

  async expectRecentMaintenanceVisible() {
    await expect(this.recentMaintenanceSection).toBeVisible();
    const items = this.page.getByTestId('dashboard-maintenance-item');
    await expect(items.first()).toBeVisible();
  }

  async expectStatusBadge(item: Locator, status: string) {
    const badge = item.getByTestId('status-badge');
    await expect(badge).toContainText(status);
  }
}
