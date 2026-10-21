import { test as base, expect } from '../mock-api/mock-api.fixture';
import type { MockApi } from '../mock-api/mock-api';

/**
 * Helpers that seed test data straight into the mock API. The public site is
 * anonymous (L2-REQ-110), so nothing here signs in.
 */
export class ApiHelper {
  constructor(private mockApi: MockApi) {}

  async createDocument(data: {
    title: string;
    type: string;
    content?: string;
    published?: boolean;
  }): Promise<string> {
    return this.mockApi.createDocument({
      title: data.title,
      type: data.type,
      content: data.content ?? 'Test document content.',
      published: data.published ?? true,
    }).documentId;
  }
}

type ApiFixtures = {
  api: ApiHelper;
};

export const test = base.extend<ApiFixtures>({
  api: async ({ mockApi }, use) => {
    await use(new ApiHelper(mockApi));
  },
});

export { expect };
