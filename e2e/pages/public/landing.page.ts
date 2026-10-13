import { type Locator, type Page, expect } from '@playwright/test';

/**
 * The public home page (`/`), drawn in docs/mocks/pages/public-landing/.
 * Owns every selector; tests only state intent.
 */
export class LandingPage {
  readonly page: Page;

  // Header and phone menu
  readonly header: Locator;
  readonly brand: Locator;
  readonly nav: Locator;
  readonly signInLink: Locator;
  readonly menuButton: Locator;
  readonly menu: Locator;
  readonly menuLinks: Locator;
  readonly menuSignInLink: Locator;
  readonly navPageLinks: Locator;
  readonly menuPageLinks: Locator;

  // Hero
  readonly hero: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly heroCta: Locator;
  readonly heroSecondaryCta: Locator;
  readonly heroPhoto: Locator;

  // Body blocks
  readonly stats: Locator;
  readonly about: Locator;
  readonly gallery: Locator;
  readonly galleryPhotos: Locator;
  readonly features: Locator;
  readonly quote: Locator;
  readonly visit: Locator;

  // Notices ("What's on")
  readonly noticesSection: Locator;
  readonly noticeCards: Locator;
  readonly noticesEmpty: Locator;

  // Board
  readonly boardSection: Locator;
  readonly boardMembers: Locator;

  // Footer
  readonly footer: Locator;
  readonly footerPhone: Locator;

  constructor(page: Page) {
    this.page = page;

    // The header and footer are shared with the website pages (site-header, site-footer).
    this.header = page.getByTestId('site-header');
    this.brand = page.getByTestId('site-brand');
    this.nav = page.getByTestId('site-nav');
    this.signInLink = page.getByTestId('site-signin-link');
    this.menuButton = page.getByTestId('site-menu-button');
    this.menu = page.getByTestId('site-menu');
    this.menuLinks = this.menu.getByTestId('site-menu-link');
    this.menuSignInLink = page.getByTestId('site-menu-signin-link');
    this.navPageLinks = this.nav.getByTestId('site-nav-page-link');
    this.menuPageLinks = this.menu.getByTestId('site-menu-page-link');

    this.hero = page.getByTestId('landing-hero');
    this.heroTitle = page.getByTestId('landing-hero-title');
    this.heroSubtitle = page.getByTestId('landing-hero-subtitle');
    this.heroCta = page.getByTestId('landing-hero-cta');
    this.heroSecondaryCta = page.getByTestId('landing-hero-secondary-cta');
    this.heroPhoto = page.getByTestId('landing-hero-photo');

    this.stats = page.getByTestId('landing-stats');
    this.about = page.getByTestId('landing-about');
    this.gallery = page.getByTestId('landing-gallery');
    this.galleryPhotos = this.gallery.getByRole('img');
    this.features = page.getByTestId('landing-features');
    this.quote = page.getByTestId('landing-quote');
    this.visit = page.getByTestId('landing-visit');

    this.noticesSection = page.getByTestId('landing-notices-section');
    this.noticeCards = page.getByTestId('landing-notice-card');
    this.noticesEmpty = page.getByTestId('landing-notices-empty');

    this.boardSection = page.getByTestId('landing-board-section');
    this.boardMembers = page.getByTestId('landing-board-member');

    this.footer = page.getByTestId('site-footer');
    this.footerPhone = page.getByTestId('site-footer-phone');
  }

  async goto() {
    await this.page.goto('/');
    // CMS content renders after the mocked API responds; wait for requests to settle.
    await this.page.waitForLoadState('networkidle');
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

  boardMember(name: string): Locator {
    return this.boardMembers.filter({ hasText: name });
  }

  noticeCard(title: string): Locator {
    return this.noticeCards.filter({ hasText: title });
  }

  async navigateToLogin() {
    await this.signInLink.click();
    await this.page.waitForURL('**/login');
  }

  async openMenu() {
    await this.menuButton.click();
    await expect(this.menu).toBeVisible();
  }

  async closeMenuWithEscape() {
    await this.page.keyboard.press('Escape');
  }

  /** True when the document is wider than the viewport, i.e. horizontal scrolling is possible. */
  async hasHorizontalScroll(): Promise<boolean> {
    return this.page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
  }
}
