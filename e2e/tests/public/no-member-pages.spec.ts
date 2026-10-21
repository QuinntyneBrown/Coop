// Acceptance Test
// Traces to: L2-REQ-102, L2-REQ-103, L2-REQ-101
// Description: The public site is read-only and anonymous: old member
// addresses, register and forgot-password open the admin login, the
// documents page has no signed-in parts even with an old token in the
// browser, and the public app sends no token to the API.

import { test, expect } from '../../fixtures/mock-api/mock-api.fixture';
import { LoginPage as AdminLoginPage } from '../../pages/admin/login.page';
import { DocumentsPage } from '../../pages/public/documents.page';
import { LandingPage } from '../../pages/public/landing.page';

const OLD_ADDRESSES = ['/dashboard', '/maintenance', '/messaging', '/profile', '/onboarding', '/register', '/forgot-password'];

/** A token left in the browser by the public member pages before they were removed. */
async function leaveOldToken(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('auth_token', 'mock-token:a0000000-0000-4000-8000-000000000002');
    localStorage.setItem('auth_user_id', 'a0000000-0000-4000-8000-000000000002');
    localStorage.setItem('auth_username', 'member');
  });
}

test.describe('The public site has no signed-in features', () => {
  for (const path of OLD_ADDRESSES) {
    test(`Given a visitor, when they open ${path}, then the admin login opens`, async ({ page }) => {
      await page.goto(path);

      await new AdminLoginPage(page).expectOpen();
    });
  }

  test('Given a browser that still holds a member token, when /maintenance opens, then the admin login opens', async ({
    page,
  }) => {
    await leaveOldToken(page);

    await page.goto('/maintenance');

    await new AdminLoginPage(page).expectOpen();
  });

  for (const width of [360, 1280]) {
    test(`Given an old token at ${width} px, when the documents page loads, then it shows the logo and no signed-in parts`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 800 });
      await leaveOldToken(page);
      const documents = new DocumentsPage(page);

      await documents.goto();

      await expect(documents.pageTitle).toBeVisible();
      await expect(documents.logo).toContainText('OWN Housing');
      await expect(documents.notificationBell).toHaveCount(0);
      await expect(documents.menuButton).toHaveCount(0);
      await expect(documents.tabBar).toHaveCount(0);
      await expect(documents.memberLinks).toHaveCount(0);
    });
  }

  test('Given an old token, when public pages call the API, then no token is sent', async ({ page }) => {
    await leaveOldToken(page);
    const authorised: string[] = [];
    page.on('request', (request) => {
      if (request.url().startsWith('http://localhost:5000') && request.headers()['authorization']) {
        authorised.push(request.url());
      }
    });

    await new DocumentsPage(page).goto();
    await new LandingPage(page).goto();

    expect(authorised).toEqual([]);
  });

  test('Given the footer, when a visitor activates "Report a repair", then the admin login opens', async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.goto();

    await landing.footerLink('Report a repair').click();

    await new AdminLoginPage(page).expectOpen();
  });
});
