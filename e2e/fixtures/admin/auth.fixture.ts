import { type Page } from '@playwright/test';
import { test as base, expect } from '../mock-api/mock-api.fixture';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Admin123!';
const MEMBER_USERNAME = 'member';
const MEMBER_PASSWORD = 'Member123!';

interface AuthFixtures {
  authenticatedPage: Page;
  /** A page signed in as the seeded member (role Member), who sees only the member areas. */
  memberPage: Page;
  adminToken: string;
}

/** Sets the token in localStorage so the app starts already signed in. */
async function signIn(page: Page, state: { token: string; username: string; userId: string }) {
  await page.goto('/');
  await page.evaluate((s) => {
    localStorage.setItem('auth_token', s.token);
    localStorage.setItem('auth_username', s.username);
    localStorage.setItem('auth_user_id', s.userId);
  }, state);
}

export const test = base.extend<AuthFixtures>({
  adminToken: async ({ mockApi }, use) => {
    await use(mockApi.login(ADMIN_USERNAME, ADMIN_PASSWORD).token);
  },

  authenticatedPage: async ({ page, mockApi }, use) => {
    await signIn(page, mockApi.login(ADMIN_USERNAME, ADMIN_PASSWORD));
    await use(page);
  },

  memberPage: async ({ page, mockApi }, use) => {
    await signIn(page, mockApi.login(MEMBER_USERNAME, MEMBER_PASSWORD));
    await use(page);
  },
});

export { expect };
