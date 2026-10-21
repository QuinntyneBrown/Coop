// Every public screen at 400% zoom (WCAG 1.4.10 Reflow, 320 CSS px wide):
// content reflows to one column with no horizontal scrolling, and every
// control stays inside the viewport.
import { test } from '../../fixtures/mock-api/mock-api.fixture';
import { REFLOW_WIDTH, ReflowPage } from '../../pages/reflow.page';

test.use({ viewport: { width: REFLOW_WIDTH, height: 800 } });

// The public site is anonymous; it has no member screens (L2-REQ-102).
const anonymousScreens = ['/', '/pages/how-to-apply', '/documents'];

test.describe('Reflow at 400% zoom', () => {
  for (const path of anonymousScreens) {
    test(`Given ${path} at 320 px wide, then it reflows without horizontal scrolling`, async ({ page }) => {
      const reflow = new ReflowPage(page);
      await reflow.open(path);
      await reflow.expectReflows();
    });
  }
});
