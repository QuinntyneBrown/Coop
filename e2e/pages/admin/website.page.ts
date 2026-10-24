import { type Locator, type Page, expect } from '@playwright/test';

/**
 * The admin Website area landing (`/website`), drawn in
 * docs/mocks/pages/admin-website/: the publish bar and the site tree in the
 * shape of the public site. Owns every selector; tests only state intent.
 */
export class WebsitePage {
  readonly page: Page;

  readonly title: Locator;
  readonly tree: Locator;
  readonly treeLinks: Locator;
  readonly pagesGroup: Locator;
  readonly pageLinks: Locator;
  readonly addPageLink: Locator;
  readonly pagesLoading: Locator;
  readonly error: Locator;
  readonly retryButton: Locator;
  readonly breadcrumb: Locator;

  constructor(page: Page) {
    this.page = page;

    this.title = page.getByTestId('website-title');
    this.tree = page.getByRole('navigation', { name: 'Website' });
    this.treeLinks = this.tree.getByRole('link');
    this.pagesGroup = this.tree.getByTestId('site-tree-pages');
    this.pageLinks = this.tree.getByTestId('site-tree-page');
    this.addPageLink = this.tree.getByRole('link', { name: 'Add a page' });
    this.pagesLoading = this.tree.getByTestId('site-tree-pages-loading');
    this.error = page.getByTestId('website-error');
    this.retryButton = page.getByTestId('website-retry');
    this.breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
  }

  async goto() {
    await this.page.goto('/website');
    await this.page.waitForLoadState('networkidle');
  }

  async expectPageLoaded() {
    await expect(this.title).toHaveText('Website');
    await expect(this.tree).toBeVisible();
  }

  /** A fixed item of the tree by its label. */
  treeLink(name: string): Locator {
    return this.tree.getByRole('link', { name, exact: true });
  }

  /** True when the document is wider than the viewport, i.e. horizontal scrolling is possible. */
  async hasHorizontalScroll(): Promise<boolean> {
    return this.page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
  }
}
