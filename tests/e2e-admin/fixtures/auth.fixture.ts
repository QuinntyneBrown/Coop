import { test as base, expect, type Page, type BrowserContext } from '@playwright/test';
import path from 'path';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Admin123!';
const API_BASE_URL = 'http://localhost:5000';
const AUTH_STORAGE_FILE = path.join(__dirname, '..', '.auth', 'admin.json');

interface AuthFixtures {
  authenticatedPage: Page;
  adminToken: string;
}

async function getAuthToken(username: string, password: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/user/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.token ?? data.access_token ?? data;
}

export const test = base.extend<AuthFixtures>({
  adminToken: async ({}, use) => {
    const token = await getAuthToken(ADMIN_USERNAME, ADMIN_PASSWORD);
    await use(token);
  },

  authenticatedPage: async ({ browser }, use) => {
    // Try to reuse stored auth state, or create new
    let context: BrowserContext;

    try {
      context = await browser.newContext({ storageState: AUTH_STORAGE_FILE });
    } catch {
      // No stored state, authenticate via API and store
      context = await browser.newContext();
      const page = context.pages()[0] ?? (await context.newPage());

      // Get token via API
      const token = await getAuthToken(ADMIN_USERNAME, ADMIN_PASSWORD);

      // Set token in localStorage (common SPA pattern)
      await page.goto('http://localhost:4200');
      await page.evaluate((t) => {
        localStorage.setItem('auth_token', t);
        localStorage.setItem('token', t);
      }, token);

      // Save storage state for reuse
      await context.storageState({ path: AUTH_STORAGE_FILE });
    }

    const page = context.pages()[0] ?? (await context.newPage());
    await use(page);
    await context.close();
  },
});

export { expect };

/**
 * Setup function for global auth - can be used in playwright.config.ts
 * as a global setup to pre-authenticate before all tests.
 */
export async function globalAuthSetup() {
  const token = await getAuthToken(ADMIN_USERNAME, ADMIN_PASSWORD);
  return { token, username: ADMIN_USERNAME };
}
