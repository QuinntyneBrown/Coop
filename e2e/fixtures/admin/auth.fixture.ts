import { type Page } from '@playwright/test';
import { test as base, expect } from '../mock-api/mock-api.fixture';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Admin123!';

interface AuthFixtures {
  authenticatedPage: Page;
  adminToken: string;
}

export const test = base.extend<AuthFixtures>({
  adminToken: async ({ mockApi }, use) => {
    await use(mockApi.login(ADMIN_USERNAME, ADMIN_PASSWORD).token);
  },

  authenticatedPage: async ({ page, mockApi }, use) => {
    const state = mockApi.login(ADMIN_USERNAME, ADMIN_PASSWORD);

    // Set the token in localStorage so the app starts already signed in.
    await page.goto('/');
    await page.evaluate((s) => {
      localStorage.setItem('auth_token', s.token);
      localStorage.setItem('auth_username', s.username);
      localStorage.setItem('auth_user_id', s.userId);
    }, state);

    await use(page);
  },
});

export { expect };
