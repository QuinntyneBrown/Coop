import { test as base, expect, type Page, type APIRequestContext } from '@playwright/test';

/**
 * Auth credentials for the default member user.
 */
export const MEMBER_CREDENTIALS = {
  username: 'member',
  password: 'Member123!',
};

export interface AuthTokenResponse {
  token: string;
  refreshToken: string;
  userId: string;
  username: string;
  roles: string[];
}

export interface AuthState {
  token: string;
  userId: string;
  username: string;
}

/**
 * Authenticates a user via the API and returns the auth state.
 */
async function loginViaApi(
  request: APIRequestContext,
  username: string,
  password: string,
): Promise<AuthState> {
  const response = await request.post('http://localhost:5000/api/user/token', {
    data: { username, password },
  });

  expect(response.ok(), `Login API should return 200 for user "${username}"`).toBeTruthy();

  const body = await response.json();

  return {
    token: body.token || body.accessToken,
    userId: body.userId,
    username: body.username || username,
  };
}

/**
 * Injects the auth token into the browser's localStorage so the Angular app
 * picks it up as an already-authenticated session.
 */
async function injectAuthState(page: Page, authState: AuthState): Promise<void> {
  await page.goto('http://localhost:4201');
  await page.evaluate((state) => {
    localStorage.setItem('auth_token', state.token);
    localStorage.setItem('auth_user_id', state.userId);
    localStorage.setItem('auth_username', state.username);
  }, authState);
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
  authState: async ({ request }, use) => {
    const state = await loginViaApi(
      request,
      MEMBER_CREDENTIALS.username,
      MEMBER_CREDENTIALS.password,
    );
    await use(state);
  },

  authenticatedPage: async ({ page, authState }, use) => {
    await injectAuthState(page, authState);
    await use(page);
  },

  loginAs: async ({ request }, use) => {
    const fn = async (targetPage: Page, username: string, password: string) => {
      const state = await loginViaApi(request, username, password);
      await injectAuthState(targetPage, state);
      return state;
    };
    await use(fn);
  },
});

export { expect } from '@playwright/test';
