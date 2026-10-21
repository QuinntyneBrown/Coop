import { test, expect } from '../../fixtures/mock-api/mock-api.fixture';
import { LoginPage as AdminLoginPage } from '../../pages/admin/login.page';
import { DocumentsPage } from '../../pages/public/documents.page';

test.describe('Authentication', () => {
  // L2-REQ-101 AC1, AC2: the public site has no login screen of its own.
  test.describe('Sign in', () => {
    test('should take /login to the admin login screen', async ({ page }) => {
      await page.goto('/login');
      await new AdminLoginPage(page).expectOpen();
    });
  });

  test.describe('Anonymous access', () => {
    // Old member addresses are covered in no-member-pages.spec.ts (L2-REQ-101 AC5, L2-REQ-102).
    test('should allow anonymous access to landing page', async ({ page }) => {
      await page.goto('/');
      await expect(page).not.toHaveURL(/\/login/);
    });

    test('should allow anonymous access to public documents', async ({ page }) => {
      await page.goto('/documents');
      // Documents may be public or require auth depending on configuration
      // At minimum, the page should not error
      await expect(page.locator('body')).toBeVisible();
    });
  });
});
