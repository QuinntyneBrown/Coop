import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4201',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'dotnet run --project ../../src/Coop.Api/Coop.Api.csproj',
      url: 'http://localhost:5000/api/user/exists/healthcheck',
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
    {
      command: 'cd ../../apps/coop-public && npx ng serve --port 4201',
      url: 'http://localhost:4201',
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
    },
  ],
});
