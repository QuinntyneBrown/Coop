import { test as base, expect, MEMBER_CREDENTIALS } from './auth.fixture';
import type { MockApi } from '../mock-api/mock-api';
import type { MockUser } from '../mock-api/mock-store';

/**
 * Helpers that seed test data straight into the mock API as the member user.
 */
export class ApiHelper {
  constructor(
    private mockApi: MockApi,
    private user: MockUser,
  ) {}

  // ── Maintenance Requests ──────────────────────────────────────────

  async createMaintenanceRequest(data: {
    title: string;
    description: string;
    priority?: string;
    category?: string;
  }): Promise<string> {
    return this.mockApi.createMaintenanceRequest(this.user, data).maintenanceRequestId;
  }

  async addMaintenanceComment(requestId: string, comment: string): Promise<void> {
    this.mockApi.addComment(this.user, requestId, comment);
  }

  // ── Documents ─────────────────────────────────────────────────────

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

  // ── Messaging ─────────────────────────────────────────────────────

  async createConversation(data: {
    subject: string;
    participantIds: string[];
    initialMessage: string;
  }): Promise<string> {
    return this.mockApi.createConversation(this.user, data).conversationId;
  }

  async sendMessage(conversationId: string, content: string): Promise<void> {
    this.mockApi.sendMessage(this.user, conversationId, content);
  }

  // ── JSON Content (CMS) ───────────────────────────────────────────

  async getJsonContent(key: string): Promise<unknown> {
    const response = this.mockApi.call('GET', `json-content/${key}`, undefined, this.user);
    return response.status === 200 ? response.body : null;
  }

  // ── User / Profile ───────────────────────────────────────────────

  async getProfile(): Promise<Record<string, unknown>> {
    const response = this.mockApi.call('GET', 'user/profile', undefined, this.user);
    expect(response.status, 'Should fetch profile').toBe(200);
    return response.body as Record<string, unknown>;
  }

  async updateProfile(data: Record<string, unknown>): Promise<void> {
    const response = this.mockApi.call('PUT', 'user/profile', data, this.user);
    expect(response.status, 'Should update profile').toBe(200);
  }

  // ── Cleanup ───────────────────────────────────────────────────────

  async cleanup(): Promise<void> {
    // Each test owns its own in-memory store, so there is nothing to undo.
  }
}

// ── Fixture extension ─────────────────────────────────────────────────

type ApiFixtures = {
  /** An ApiHelper acting as the authenticated member. */
  api: ApiHelper;
};

export const test = base.extend<ApiFixtures>({
  api: async ({ mockApi }, use) => {
    const user = mockApi.store.users.find((u) => u.username === MEMBER_CREDENTIALS.username);
    if (!user) throw new Error('Mock API is missing the seeded member user');
    await use(new ApiHelper(mockApi, user));
  },
});

export { expect };
