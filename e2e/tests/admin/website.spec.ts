// Acceptance Test
// Traces to: L2-REQ-118, L2-REQ-112
// Description: The office opens one Website area from a grouped sidebar: the
// site tree lists Home, the pages with Add a page, Menu and footer, Board of
// directors, Photos and Look in the shape of the public site; choosing an
// item opens its screen with a breadcrumb back; the former addresses
// redirect; every route carries a title from the registry; a member who types
// a Website address lands on the dashboard.

import { test, expect } from '../../fixtures/admin/api.fixture';
import { SidebarComponent } from '../../pages/admin/sidebar.component';
import { WebsitePage } from '../../pages/admin/website.page';

const TREE = [
  'Home',
  'How to apply',
  'Add a page',
  'Menu and footer',
  'Board of directors',
  'Photos',
  'Look',
];

test.describe('Website area', () => {
  let website: WebsitePage;
  let sidebar: SidebarComponent;

  test.beforeEach(async ({ authenticatedPage }) => {
    website = new WebsitePage(authenticatedPage);
    sidebar = new SidebarComponent(authenticatedPage);
  });

  test.describe('Site tree', () => {
    test('lists the site in the shape visitors see it, from the Website sidebar entry', async ({
      authenticatedPage,
    }) => {
      await website.goto();
      await website.expectPageLoaded();
      await sidebar.expectActiveLink('website');
      await expect(website.treeLinks).toHaveText(TREE);
      await expect(website.pageLinks).toHaveText(['How to apply']);
      await expect(authenticatedPage).toHaveTitle('Website · OWN Housing Co-op Office');
    });

    test('shows Add a page only when there are no pages', async ({ mockApi }) => {
      mockApi.store.pages = [];
      await website.goto();
      await expect(website.pageLinks).toHaveCount(0);
      await expect(website.addPageLink).toBeVisible();
    });

    test('offers Try again when the pages cannot be loaded', async ({ mockApi }) => {
      mockApi.failing.add('GET pages');
      await website.goto();
      await expect(website.error).toContainText(
        "We couldn't load the website. Check your connection and try again.",
      );
      mockApi.failing.clear();
      await website.retryButton.click();
      await expect(website.pageLinks).toHaveText(['How to apply']);
      await expect(website.error).toBeHidden();
    });

    test('opens the board of directors beside the tree with a breadcrumb back', async ({
      authenticatedPage,
    }) => {
      await authenticatedPage.setViewportSize({ width: 1280, height: 900 });
      await website.goto();
      await website.treeLink('Board of directors').click();
      await expect(authenticatedPage).toHaveURL(/\/website\/board$/);
      await expect(authenticatedPage).toHaveTitle('Board of directors · OWN Housing Co-op Office');
      await expect(website.breadcrumb).toContainText('Website');
      await expect(website.treeLink('Board of directors')).toHaveAttribute('aria-current', 'page');
      await sidebar.expectActiveLink('website');
      await website.breadcrumb.getByRole('link', { name: 'Website' }).click();
      await website.expectPageLoaded();
    });

    test('opens Photos and Look from the tree', async ({ authenticatedPage }) => {
      await website.goto();
      await website.treeLink('Photos').click();
      await expect(authenticatedPage).toHaveURL(/\/website\/photos$/);
      await expect(authenticatedPage.getByRole('heading', { level: 1 })).toHaveText('Photos');
      await website.goto();
      await website.treeLink('Look').click();
      await expect(authenticatedPage).toHaveURL(/\/website\/look$/);
      await expect(authenticatedPage).toHaveTitle('Look · OWN Housing Co-op Office');
    });

    test('fits a 320 px viewport without horizontal scrolling', async ({ authenticatedPage }) => {
      await authenticatedPage.setViewportSize({ width: 320, height: 800 });
      await website.goto();
      await website.expectPageLoaded();
      expect(await website.hasHorizontalScroll()).toBe(false);
      await expect(website.treeLink('Look')).toBeVisible();
    });
  });

  test.describe('Former addresses', () => {
    for (const [from, to] of [
      ['/pages', /\/website$/],
      ['/board', /\/website\/board$/],
      ['/assets', /\/website\/photos$/],
    ] as const) {
      test(`sends ${from} to the Website area`, async ({ authenticatedPage }) => {
        await authenticatedPage.goto(from);
        await expect(authenticatedPage).toHaveURL(to);
      });
    }
  });
});
