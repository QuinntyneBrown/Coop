import { test, expect } from '../../fixtures/public/auth.fixture';
import { Locator } from '@playwright/test';
import { DashboardPage } from '../../pages/public/dashboard.page';
import { MaintenancePage } from '../../pages/public/maintenance.page';
import { DocumentsPage } from '../../pages/public/documents.page';
import { MessagingPage } from '../../pages/public/messaging.page';
import { ProfilePage } from '../../pages/public/profile.page';

// The docked sidebar is 260 px wide; each page pads its content by 16 px.
const SIDEBAR_WIDTH = 260;

test.describe('Member layout on a desktop', () => {
  test('Given a 1280 px window, then every page starts its content at the same left edge beside the sidebar', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.setViewportSize({ width: 1280, height: 800 });
    const pages: [string, { goto(): Promise<void> }, Locator][] = [];
    const dashboard = new DashboardPage(authenticatedPage);
    const maintenance = new MaintenancePage(authenticatedPage);
    const documents = new DocumentsPage(authenticatedPage);
    const messaging = new MessagingPage(authenticatedPage);
    const profile = new ProfilePage(authenticatedPage);
    pages.push(
      ['dashboard', dashboard, dashboard.greeting],
      ['requests', maintenance, maintenance.pageTitle],
      ['documents', documents, documents.pageTitle],
      ['messages', messaging, messaging.pageTitle],
      ['profile', profile, profile.pageTitle],
    );

    const edges: Record<string, number> = {};
    for (const [name, screen, heading] of pages) {
      await screen.goto();
      await expect(heading).toBeVisible();
      edges[name] = Math.round((await heading.boundingBox())!.x);
    }

    const expected = Object.fromEntries(Object.keys(edges).map((name) => [name, SIDEBAR_WIDTH + 16]));
    expect(edges).toEqual(expected);
  });
});
