// Every public screen at 400% zoom (WCAG 1.4.10 Reflow, 320 CSS px wide):
// content reflows to one column with no horizontal scrolling, and every
// control stays inside the viewport.
import { test } from '../../fixtures/public/auth.fixture';
import { REFLOW_WIDTH, ReflowPage } from '../../pages/reflow.page';

test.use({ viewport: { width: REFLOW_WIDTH, height: 800 } });

const anonymousScreens = ['/', '/pages/how-to-apply', '/login', '/register', '/forgot-password', '/documents'];
const memberScreens = ['/dashboard', '/onboarding', '/maintenance', '/messaging', '/profile'];

test.describe('Reflow at 400% zoom', () => {
  for (const path of anonymousScreens) {
    test(`Given ${path} at 320 px wide, then it reflows without horizontal scrolling`, async ({ page }) => {
      const reflow = new ReflowPage(page);
      await reflow.open(path);
      await reflow.expectReflows();
    });
  }

  for (const path of memberScreens) {
    test(`Given a signed-in member on ${path} at 320 px wide, then it reflows without horizontal scrolling`, async ({
      authenticatedPage,
    }) => {
      const reflow = new ReflowPage(authenticatedPage);
      await reflow.open(path);
      await reflow.expectReflows();
    });
  }
});
