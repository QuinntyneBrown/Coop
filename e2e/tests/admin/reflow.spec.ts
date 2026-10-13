// Every admin screen at 400% zoom (WCAG 1.4.10 Reflow, 320 CSS px wide):
// content reflows to one column with no horizontal scrolling, and every
// control stays inside the viewport.
import { test } from '../../fixtures/admin/auth.fixture';
import { expect } from '@playwright/test';
import { SidebarComponent } from '../../pages/admin/sidebar.component';
import { REFLOW_WIDTH, ReflowPage } from '../../pages/reflow.page';

test.use({ viewport: { width: REFLOW_WIDTH, height: 800 } });

const anonymousScreens = ['/', '/login', '/register', '/forgot-password'];
const signedInScreens = [
  '/dashboard',
  '/onboarding',
  '/change-password',
  '/profile',
  '/maintenance',
  '/documents',
  '/pages',
  '/board',
  '/messages',
  '/users',
  '/roles',
  '/profiles',
  '/assets',
  '/invitations',
  '/settings',
];

test.describe('Reflow at 400% zoom', () => {
  for (const path of anonymousScreens) {
    test(`Given ${path} at 320 px wide, then it reflows without horizontal scrolling`, async ({ page }) => {
      const reflow = new ReflowPage(page);
      await reflow.open(path);
      await reflow.expectReflows();
    });
  }

  for (const path of signedInScreens) {
    test(`Given a signed-in admin on ${path} at 320 px wide, then it reflows without horizontal scrolling`, async ({
      authenticatedPage,
    }) => {
      const reflow = new ReflowPage(authenticatedPage);
      await reflow.open(path);
      await reflow.expectReflows();
    });
  }

  test('Given a signed-in admin at 320 px wide, when they use the menu, then it takes them to another screen', async ({
    authenticatedPage,
  }) => {
    const reflow = new ReflowPage(authenticatedPage);
    const sidebar = new SidebarComponent(authenticatedPage);
    await reflow.open('/dashboard');

    await sidebar.expectVisible();
    await sidebar.maintenanceLink.click();

    await expect(authenticatedPage).toHaveURL(/\/maintenance$/);
  });
});
