import { type Locator, type Page, expect } from '@playwright/test';

export class LandingPage {
  readonly page: Page;

  // Hero section
  readonly hero: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly heroCta: Locator;

  // Board of Directors section
  readonly boardSection: Locator;
  readonly boardMembers: Locator;

  // Public notices / announcements
  readonly noticesSection: Locator;
  readonly noticeCards: Locator;

  // Navigation
  readonly loginLink: Locator;
  readonly registerLink: Locator;
  readonly navBar: Locator;

  constructor(page: Page) {
    this.page = page;

    this.hero = page.locator('[data-testid="landing-hero"]');
    this.heroTitle = page.locator('[data-testid="landing-hero-title"]');
    this.heroSubtitle = page.locator('[data-testid="landing-hero-subtitle"]');
    this.heroCta = page.locator('[data-testid="landing-hero-cta"]');

    this.boardSection = page.locator('[data-testid="landing-board-section"]');
    this.boardMembers = page.locator('[data-testid="landing-board-member"]');

    this.noticesSection = page.locator('[data-testid="landing-notices-section"]');
    this.noticeCards = page.locator('[data-testid="landing-notice-card"]');

    this.loginLink = page.locator('[data-testid="landing-login-link"]');
    this.registerLink = page.locator('[data-testid="landing-register-link"]');
    this.navBar = page.locator('[data-testid="landing-navbar"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async expectLoaded() {
    await expect(this.hero).toBeVisible();
    await expect(this.heroTitle).toBeVisible();
  }

  async expectBoardSectionVisible() {
    await expect(this.boardSection).toBeVisible();
    await expect(this.boardMembers.first()).toBeVisible();
  }

  async expectNoticesVisible() {
    await expect(this.noticesSection).toBeVisible();
  }

  async getBoardMemberCount(): Promise<number> {
    return this.boardMembers.count();
  }

  async getNoticeCount(): Promise<number> {
    return this.noticeCards.count();
  }

  async navigateToLogin() {
    await this.loginLink.click();
    await this.page.waitForURL('**/login');
  }

  async navigateToRegister() {
    await this.registerLink.click();
    await this.page.waitForURL('**/register');
  }
}
