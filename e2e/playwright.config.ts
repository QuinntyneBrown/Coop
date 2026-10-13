import { defineConfig, devices } from '@playwright/test';

/**
 * The suite never talks to a real backend: every request to the API origin is
 * answered by the in-process mock in `fixtures/mock-api/`. Only the two
 * Angular dev servers are started.
 */
export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'public',
      testDir: './tests/public',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:4201' },
    },
    {
      name: 'admin',
      testDir: './tests/admin',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:4200' },
    },
  ],
  webServer: [
    {
      command: 'cd ../frontend && npx ng serve public --port 4201',
      url: 'http://localhost:4201',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'cd ../frontend && npx ng serve admin --port 4200',
      url: 'http://localhost:4200',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});
