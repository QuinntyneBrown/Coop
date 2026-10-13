import { type Page } from '@playwright/test';
import { test as base, expect } from '../mock-api/mock-api.fixture';
import type { MockApi } from '../mock-api/mock-api';

/**
 * Auth credentials for the default member user (seeded in the mock API).
 */
export const MEMBER_CREDENTIALS = {
  username: 'member',
  password: 'Member123!',
};

export interface AuthState {
  token: string;
  userId: string;
  username: string;
}

/**
 * Injects the auth token into the browser's localStorage so the Angular app
 * picks it up as an already-authenticated session.
 */
async function injectAuthState(page: Page, authState: AuthState): Promise<void> {
  await page.goto('/');
  await page.evaluate((state) => {
    localStorage.setItem('auth_token', state.token);
    localStorage.setItem('auth_user_id', state.userId);
    localStorage.setItem('auth_username', state.username);
  }, authState);
}

function loginViaMock(mockApi: MockApi, username: string, password: string): AuthState {
  return mockApi.login(username, password);
}

/**
 * Extended test fixtures that provide authenticated and anonymous contexts.
 */
type AuthFixtures = {
  /** A page that is already authenticated as the default member. */
  authenticatedPage: Page;
  /** The auth state (token, userId, username) for the default member. */
  authState: AuthState;
  /** Helper to log in as any user and inject auth into a page. */
  loginAs: (page: Page, username: string, password: string) => Promise<AuthState>;
};

export const test = base.extend<AuthFixtures>({
  authState: async ({ mockApi }, use) => {
    await use(loginViaMock(mockApi, MEMBER_CREDENTIALS.username, MEMBER_CREDENTIALS.password));
  },

  authenticatedPage: async ({ page, authState }, use) => {
    await injectAuthState(page, authState);
    await use(page);
  },

  loginAs: async ({ mockApi }, use) => {
    const fn = async (targetPage: Page, username: string, password: string) => {
      const state = loginViaMock(mockApi, username, password);
      await injectAuthState(targetPage, state);
      return state;
    };
    await use(fn);
  },
});

export { expect };
