import { type Locator, type Page, expect } from '@playwright/test';

/** The heading area at the top of an admin screen's main column. */
export class PageHeaderComponent {
  readonly page: Page;
  readonly topBars: Locator;
  readonly headings: Locator;

  constructor(page: Page) {
    this.page = page;
    this.topBars = page.locator('[data-testid="topbar"], [data-testid="dashboard-top-bar"]');
    this.headings = page.getByRole('heading', { level: 1 });
  }

  async open(path: string) {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  async expectNoTopBar() {
    await expect(this.topBars).toHaveCount(0);
  }

  async expectSingleHeading(text: string | RegExp) {
    await expect(this.headings).toHaveCount(1);
    await expect(this.headings).toHaveText(text);
  }
}
