import { test, expect } from '../../fixtures/admin/api.fixture';
import { AdminLandingPage } from '../../pages/admin/landing.page';

// Phone widths: the deployed site's screenshot (422 px) and a common small phone (360 px).
const phones = [
  { width: 422, height: 854 },
  { width: 360, height: 800 },
];

test.describe('Admin landing page', () => {
  test('welcomes visitors to the co-op by name, in Canadian English', async ({ page }) => {
    const landing = new AdminLandingPage(page);
    await landing.goto();

    await expect(landing.brand).toContainText('OWN Housing Co-op');
    await expect(landing.heroTitle).toHaveText('Welcome to OWN Housing Co-op');
    await expect(landing.heroSubtitle).not.toHaveText(/neighbor\b|neighbors|Your Cooperative/);
  });

  // L2-REQ-090 AC4: the header may wrap only at 320 px; at phone widths it stays one row.
  for (const viewport of phones) {
    test.describe(`at ${viewport.width} px wide`, () => {
      test.use({ viewport });

      test('Given a phone, when the landing page opens, then the site name, Sign In and Register share one row', async ({
        page,
      }) => {
        const landing = new AdminLandingPage(page);
        await landing.goto();
        await expect(landing.siteName).toContainText('OWN Housing Co-op');
        await expect(landing.signInLink).toBeVisible();
        await expect(landing.registerLink).toBeVisible();

        const { header, siteName, signIn, register } = await landing.headerBoxes();
        for (const item of [siteName, signIn, register]) {
          expect(item.top, 'shares a row with the others').toBeLessThan(
            Math.min(siteName.bottom, signIn.bottom, register.bottom),
          );
          expect(item.left, 'inside the viewport').toBeGreaterThanOrEqual(0);
          expect(item.right, 'inside the viewport').toBeLessThanOrEqual(viewport.width);
        }
        const tallest = Math.max(
          siteName.bottom - siteName.top,
          signIn.bottom - signIn.top,
          register.bottom - register.top,
        );
        // One row: no taller than its tallest item plus the bar's padding and border.
        expect(header.bottom - header.top, 'header is one row tall').toBeLessThanOrEqual(tallest + 24);
      });
    });
  }
});
