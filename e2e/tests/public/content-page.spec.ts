// Acceptance Test
// Traces to: L2-REQ-082, L2-REQ-083, L2-REQ-084, L2-REQ-097
// Description: A website page the office added renders at /pages/{slug}
// inside the shared header and footer with its title, hero photograph and
// sanitised body; the header marks it current; a removed or unknown page
// shows the not-found experience; a failed request offers Try again.

import { test, expect } from '../../fixtures/public/auth.fixture';
import { ContentPage } from '../../pages/public/content-page.page';

test.describe('Website page', () => {
  let content: ContentPage;

  test.beforeEach(async ({ page }) => {
    content = new ContentPage(page);
  });

  test('renders the title, hero photograph and text of a page the office added', async ({
    mockApi,
  }) => {
    const seeded = mockApi.store.pages[0];
    await content.goto(seeded.slug);
    await content.expectPage(seeded.title);
    await expect(content.page).toHaveTitle(`${seeded.title} · OWN Housing Co-op`);
    await expect(content.hero).toHaveAttribute('src', /garden\.svg$/);
    await expect(content.hero).toHaveAttribute('alt', String(seeded.heroImageAlt));
    await expect(content.body.getByRole('heading', { name: 'Who can apply' })).toBeVisible();
    await expect(content.body.getByRole('listitem').first()).toContainText('Women aged 55');
    await expect(content.header).toBeVisible();
    await expect(content.footer).toBeVisible();
  });

  test('marks the page current in the header and keeps Home not current', async ({ mockApi }) => {
    const seeded = mockApi.store.pages[0];
    await content.goto(seeded.slug);
    await expect(content.navPageLink(seeded.title)).toHaveAttribute('aria-current', 'page');
    await expect(content.homeLink).not.toHaveAttribute('aria-current', 'page');
  });

  test('reserves no space for a hero when the page has none', async ({ mockApi }) => {
    const plain = mockApi.createPage({ title: 'Our garden', body: '<p>Tomatoes in August.</p>' });
    await content.goto(plain.slug);
    await content.expectPage('Our garden');
    await expect(content.hero).toHaveCount(0);
  });

  test('does not run scripts or event handlers written into the page text', async ({
    mockApi,
    page,
  }) => {
    mockApi.createPage({
      title: 'Scripted',
      body: '<script>window.__pageScriptRan = true;</script><p onclick="window.__pageScriptRan = true">Plain words.</p>',
    });
    await content.goto('scripted');
    await content.expectPage('Scripted');
    await content.body.getByText('Plain words.').click();
    expect(await page.evaluate(() => (window as any).__pageScriptRan)).toBeUndefined();
    expect(await content.body.innerHTML()).not.toContain('<script');
  });

  test('opens a home page section from the header', async ({ mockApi, page }) => {
    await content.goto(mockApi.store.pages[0].slug);
    await content.nav.getByRole('link', { name: 'About us' }).click();
    await expect(page).toHaveURL(/\/#about$/);
  });

  test('shows the not-found experience for an unknown address', async ({ page }) => {
    await content.goto('no-such-page');
    await expect(content.notFound).toContainText("We can't find that page");
    await expect(content.notFound).toContainText(
      'It may have been removed, or the address may be wrong.',
    );
    await expect(page).toHaveTitle('Page not found · OWN Housing Co-op');
    await expect(content.header).toBeVisible();
    await expect(content.footer).toBeVisible();
    await content.goHomeLink.click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('shows the not-found experience for a removed page and drops it from the header', async ({
    mockApi,
  }) => {
    const removed = mockApi.store.pages[0];
    mockApi.store.pages = [];
    await content.goto(removed.slug);
    await expect(content.notFound).toBeVisible();
    await expect(content.navPageLinks).toHaveCount(0);
  });

  test('offers Try again when the page cannot be loaded', async ({ mockApi }) => {
    const seeded = mockApi.store.pages[0];
    mockApi.failing.add(`GET pages/${seeded.slug}`);
    await content.goto(seeded.slug);
    await expect(content.error).toContainText("We couldn't load this page right now.");
    mockApi.failing.clear();
    await content.retryButton.click();
    await content.expectPage(seeded.title);
  });

  for (const width of [360, 320]) {
    test(`fits a ${width} px viewport without horizontal scrolling`, async ({ mockApi, page }) => {
      await page.setViewportSize({ width, height: 800 });
      await content.goto(mockApi.store.pages[0].slug);
      await content.expectPage(mockApi.store.pages[0].title);
      expect(await content.hasHorizontalScroll()).toBe(false);
    });
  }
});
