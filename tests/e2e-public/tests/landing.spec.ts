import { test, expect } from '@playwright/test';
import { LandingPage } from '../pages/landing.page';

test.describe('Landing Page', () => {
  let landing: LandingPage;

  test.beforeEach(async ({ page }) => {
    landing = new LandingPage(page);
  });

  test.describe('Page Load', () => {
    test('should load the landing page without authentication', async () => {
      await landing.goto();
      await landing.expectLoaded();
    });

    test('should display the hero section with cooperative information', async () => {
      await landing.goto();
      await expect(landing.hero).toBeVisible();
      await expect(landing.heroTitle).toBeVisible();
      await expect(landing.heroSubtitle).toBeVisible();
    });

    test('should display a call-to-action button in the hero', async () => {
      await landing.goto();
      await expect(landing.heroCta).toBeVisible();
    });
  });

  test.describe('CMS Content', () => {
    test('should render hero content from the JsonContent API', async ({ page }) => {
      // Intercept the CMS API call and verify it was made
      const apiPromise = page.waitForResponse(
        (resp) => resp.url().includes('/api/json-content') && resp.status() === 200,
      );
      await landing.goto();
      const response = await apiPromise;
      expect(response.ok()).toBeTruthy();
    });

    test('should display the Board of Directors section', async () => {
      await landing.goto();
      await landing.expectBoardSectionVisible();
    });

    test('should render at least one board member', async () => {
      await landing.goto();
      const count = await landing.getBoardMemberCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should display public notices/announcements section', async () => {
      await landing.goto();
      await landing.expectNoticesVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should have a visible navigation bar', async () => {
      await landing.goto();
      await expect(landing.navBar).toBeVisible();
    });

    test('should navigate to login page from landing', async () => {
      await landing.goto();
      await landing.navigateToLogin();
      await expect(landing.page).toHaveURL(/\/login/);
    });

    test('should navigate to register page from landing', async () => {
      await landing.goto();
      await landing.navigateToRegister();
      await expect(landing.page).toHaveURL(/\/register/);
    });
  });

  test.describe('Responsive Layout', () => {
    test('should display correctly on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      landing = new LandingPage(page);
      await landing.goto();
      await landing.expectLoaded();
      await expect(landing.hero).toBeVisible();
    });

    test('should display correctly on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      landing = new LandingPage(page);
      await landing.goto();
      await landing.expectLoaded();
    });

    test('should display correctly on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      landing = new LandingPage(page);
      await landing.goto();
      await landing.expectLoaded();
    });
  });
});
