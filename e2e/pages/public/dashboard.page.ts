import { type Locator, type Page, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  // Top bar
  readonly topBar: Locator;
  readonly logo: Locator;
  readonly notificationBell: Locator;
  readonly hamburgerMenu: Locator;
  readonly notificationBadge: Locator;

  // Greeting
  readonly greeting: Locator;
  readonly subtitle: Locator;

  // Metric cards
  readonly metricCards: Locator;
  readonly requestsMetric: Locator;
  readonly requestsCount: Locator;
  readonly messagesMetric: Locator;
  readonly messagesCount: Locator;
  readonly membersMetric: Locator;
  readonly membersCount: Locator;

  // Recent requests
  readonly recentRequestsCard: Locator;
  readonly recentRequestItems: Locator;
  readonly viewAllRequestsLink: Locator;

  // Bottom tab bar (mobile)
  readonly bottomTabBar: Locator;
  readonly tabHome: Locator;
  readonly tabRequests: Locator;
  readonly tabDocs: Locator;
  readonly tabMessages: Locator;
  readonly tabProfile: Locator;

  constructor(page: Page) {
    this.page = page;

    this.topBar = page.locator('[data-testid="dashboard-top-bar"]');
    this.logo = page.locator('[data-testid="dashboard-logo"]');
    this.notificationBell = page.locator('[data-testid="dashboard-notification-bell"]');
    this.hamburgerMenu = page.locator('[data-testid="dashboard-hamburger-menu"]');
    this.notificationBadge = page.locator('[data-testid="dashboard-notification-badge"]');

    this.greeting = page.locator('[data-testid="dashboard-greeting"]');
    this.subtitle = page.locator('[data-testid="dashboard-subtitle"]');

    this.metricCards = page.locator('[data-testid="dashboard-metric-card"]');
    this.requestsMetric = page.locator('[data-testid="dashboard-metric-requests"]');
    this.requestsCount = page.locator('[data-testid="dashboard-metric-requests-count"]');
    this.messagesMetric = page.locator('[data-testid="dashboard-metric-messages"]');
    this.messagesCount = page.locator('[data-testid="dashboard-metric-messages-count"]');
    this.membersMetric = page.locator('[data-testid="dashboard-metric-members"]');
    this.membersCount = page.locator('[data-testid="dashboard-metric-members-count"]');

    this.recentRequestsCard = page.locator('[data-testid="dashboard-recent-requests"]');
    this.recentRequestItems = page.locator('[data-testid="dashboard-recent-request-item"]');
    this.viewAllRequestsLink = page.locator('[data-testid="dashboard-view-all-requests"]');

    this.bottomTabBar = page.locator('[data-testid="bottom-tab-bar"]');
    this.tabHome = page.locator('[data-testid="tab-home"]');
    this.tabRequests = page.locator('[data-testid="tab-requests"]');
    this.tabDocs = page.locator('[data-testid="tab-docs"]');
    this.tabMessages = page.locator('[data-testid="tab-messages"]');
    this.tabProfile = page.locator('[data-testid="tab-profile"]');
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async expectLoaded() {
    await expect(this.topBar).toBeVisible();
    await expect(this.greeting).toBeVisible();
    await expect(this.metricCards.first()).toBeVisible();
  }

  async expectGreeting(name: string) {
    await expect(this.greeting).toContainText(`Hello, ${name}`);
    await expect(this.subtitle).toContainText("Here's your overview");
  }

  async expectMetricCards() {
    await expect(this.requestsMetric).toBeVisible();
    await expect(this.messagesMetric).toBeVisible();
    await expect(this.membersMetric).toBeVisible();
  }

  async expectRecentRequests() {
    await expect(this.recentRequestsCard).toBeVisible();
    await expect(this.recentRequestItems.first()).toBeVisible();
  }

  async getMetricValue(metric: 'requests' | 'messages' | 'members'): Promise<string> {
    const locator = {
      requests: this.requestsCount,
      messages: this.messagesCount,
      members: this.membersCount,
    }[metric];
    return (await locator.textContent()) ?? '';
  }

  async navigateToRequests() {
    await this.tabRequests.click();
    await this.page.waitForURL('**/maintenance');
  }

  async navigateToDocuments() {
    await this.tabDocs.click();
    await this.page.waitForURL('**/documents');
  }

  async navigateToMessages() {
    await this.tabMessages.click();
    await this.page.waitForURL('**/messaging');
  }

  async navigateToProfile() {
    await this.tabProfile.click();
    await this.page.waitForURL('**/profile');
  }

  async viewAllRequests() {
    await this.viewAllRequestsLink.click();
    await this.page.waitForURL('**/maintenance');
  }

  async expectMobileTabBar() {
    await expect(this.bottomTabBar).toBeVisible();
    await expect(this.tabHome).toBeVisible();
    await expect(this.tabRequests).toBeVisible();
    await expect(this.tabDocs).toBeVisible();
    await expect(this.tabMessages).toBeVisible();
    await expect(this.tabProfile).toBeVisible();
  }
}
