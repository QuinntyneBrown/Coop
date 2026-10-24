import { test as base, expect } from "@playwright/test";
import { MockApi } from "./mock-api";

/**
 * Base test for every suite. Each test gets its own MockApi, installed on the
 * browser context so the Angular apps never reach a real backend.
 */
export type MockApiFixtures = {
  mockApi: MockApi;
};

export const test = base.extend<MockApiFixtures>({
  mockApi: async ({}, use) => {
    await use(new MockApi());
  },

  context: async ({ context, mockApi }, use) => {
    await mockApi.install(context);
    await use(context);
  },
});

export { expect };
