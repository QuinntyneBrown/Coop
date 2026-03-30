import { test as base, expect, type APIRequestContext } from '@playwright/test';
import { type AuthState } from './auth.fixture';

const API_BASE = 'http://localhost:5000/api';

/**
 * Helpers that seed and tear down test data via the API.
 */
export class ApiHelper {
  private createdIds: { endpoint: string; id: string }[] = [];

  constructor(
    private request: APIRequestContext,
    private token: string,
  ) {}

  private headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  // ── Maintenance Requests ──────────────────────────────────────────

  async createMaintenanceRequest(data: {
    title: string;
    description: string;
    priority?: string;
    category?: string;
  }): Promise<string> {
    const response = await this.request.post(`${API_BASE}/maintenance-requests`, {
      headers: this.headers(),
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority ?? 'Medium',
        category: data.category ?? 'General',
      },
    });
    expect(response.ok(), 'Should create maintenance request').toBeTruthy();
    const body = await response.json();
    const id = body.id ?? body.maintenanceRequestId;
    this.createdIds.push({ endpoint: 'maintenance-requests', id });
    return id;
  }

  async addMaintenanceComment(requestId: string, comment: string): Promise<void> {
    const response = await this.request.post(
      `${API_BASE}/maintenance-requests/${requestId}/comments`,
      {
        headers: this.headers(),
        data: { content: comment },
      },
    );
    expect(response.ok(), 'Should add maintenance comment').toBeTruthy();
  }

  // ── Documents ─────────────────────────────────────────────────────

  async createDocument(data: {
    title: string;
    type: string;
    content?: string;
    published?: boolean;
  }): Promise<string> {
    const response = await this.request.post(`${API_BASE}/documents`, {
      headers: this.headers(),
      data: {
        title: data.title,
        type: data.type,
        content: data.content ?? 'Test document content.',
        published: data.published ?? true,
      },
    });
    expect(response.ok(), 'Should create document').toBeTruthy();
    const body = await response.json();
    const id = body.id ?? body.documentId;
    this.createdIds.push({ endpoint: 'documents', id });
    return id;
  }

  // ── Messaging ─────────────────────────────────────────────────────

  async createConversation(data: {
    subject: string;
    participantIds: string[];
    initialMessage: string;
  }): Promise<string> {
    const response = await this.request.post(`${API_BASE}/conversations`, {
      headers: this.headers(),
      data: {
        subject: data.subject,
        participantIds: data.participantIds,
        initialMessage: data.initialMessage,
      },
    });
    expect(response.ok(), 'Should create conversation').toBeTruthy();
    const body = await response.json();
    const id = body.id ?? body.conversationId;
    this.createdIds.push({ endpoint: 'conversations', id });
    return id;
  }

  async sendMessage(conversationId: string, content: string): Promise<void> {
    const response = await this.request.post(
      `${API_BASE}/conversations/${conversationId}/messages`,
      {
        headers: this.headers(),
        data: { content },
      },
    );
    expect(response.ok(), 'Should send message').toBeTruthy();
  }

  // ── JSON Content (CMS) ───────────────────────────────────────────

  async getJsonContent(key: string): Promise<unknown> {
    const response = await this.request.get(`${API_BASE}/json-content/${key}`, {
      headers: this.headers(),
    });
    if (!response.ok()) return null;
    return response.json();
  }

  // ── User / Profile ───────────────────────────────────────────────

  async getProfile(): Promise<Record<string, unknown>> {
    const response = await this.request.get(`${API_BASE}/user/profile`, {
      headers: this.headers(),
    });
    expect(response.ok(), 'Should fetch profile').toBeTruthy();
    return response.json();
  }

  async updateProfile(data: Record<string, unknown>): Promise<void> {
    const response = await this.request.put(`${API_BASE}/user/profile`, {
      headers: this.headers(),
      data,
    });
    expect(response.ok(), 'Should update profile').toBeTruthy();
  }

  // ── Cleanup ───────────────────────────────────────────────────────

  async cleanup(): Promise<void> {
    for (const { endpoint, id } of this.createdIds.reverse()) {
      try {
        await this.request.delete(`${API_BASE}/${endpoint}/${id}`, {
          headers: this.headers(),
        });
      } catch {
        // Best-effort cleanup; ignore errors.
      }
    }
    this.createdIds = [];
  }
}

// ── Fixture extension ─────────────────────────────────────────────────

type ApiFixtures = {
  /** An ApiHelper seeded with the authenticated member's token. */
  api: ApiHelper;
};

export const test = base.extend<ApiFixtures>({
  api: async ({ request }, use) => {
    // Obtain a token for seeding data
    const loginResponse = await request.post(`${API_BASE}/user/token`, {
      data: { username: 'member', password: 'Member123!' },
    });
    expect(loginResponse.ok(), 'API login for fixture should succeed').toBeTruthy();
    const body = await loginResponse.json();
    const token = body.token || body.accessToken;

    const helper = new ApiHelper(request, token);
    await use(helper);
    await helper.cleanup();
  },
});

export { expect } from '@playwright/test';
