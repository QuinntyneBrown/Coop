import { type Locator, type Page, expect } from '@playwright/test';

/**
 * A website page (`/pages/{slug}`), drawn in docs/mocks/pages/public-page/.
 * Owns every selector; tests only state intent.
 */
export class ContentPage {
  readonly page: Page;

  readonly header: Locator;
  readonly nav: Locator;
  readonly navLinks: Locator;
  readonly navPageLinks: Locator;
  readonly homeLink: Locator;
  readonly footer: Locator;

  readonly title: Locator;
  readonly hero: Locator;
  readonly body: Locator;
  readonly loading: Locator;
  readonly error: Locator;
  readonly retryButton: Locator;
  readonly notFound: Locator;
  readonly goHomeLink: Locator;
  readonly languageButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.header = page.getByTestId('site-header');
    this.nav = page.getByTestId('site-nav');
    this.navLinks = this.nav.getByRole('link');
    this.navPageLinks = this.nav.getByTestId('site-nav-page-link');
    this.homeLink = this.nav.getByRole('link', { name: 'Home' });
    this.footer = page.getByTestId('site-footer');

    this.title = page.getByTestId('page-title');
    this.hero = page.getByTestId('page-hero');
    this.body = page.getByTestId('page-body');
    this.loading = page.getByTestId('page-loading');
    this.error = page.getByTestId('page-error');
    this.retryButton = page.getByTestId('page-retry');
    this.notFound = page.getByTestId('page-not-found');
    this.goHomeLink = page.getByTestId('page-home-link');
    this.languageButton = page.getByTestId('site-language-button');
  }

  async goto(slug: string) {
    await this.page.goto(`/pages/${slug}`);
    await this.page.waitForLoadState('networkidle');
  }

  async expectPage(title: string) {
    await expect(this.title).toHaveText(title);
    await expect(this.body).toBeVisible();
  }

  navPageLink(title: string): Locator {
    return this.navPageLinks.filter({ hasText: title });
  }

  /** True when the document is wider than the viewport, i.e. horizontal scrolling is possible. */
  async hasHorizontalScroll(): Promise<boolean> {
    return this.page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
  }
}
