import { test as authTest, expect } from './auth.fixture';

const API_BASE_URL = 'http://localhost:5000';

interface ApiHelpers {
  api: {
    get: (path: string) => Promise<any>;
    post: (path: string, body?: any) => Promise<any>;
    put: (path: string, body?: any) => Promise<any>;
    delete: (path: string) => Promise<any>;

    // Data seeding helpers
    createUser: (username: string, password: string) => Promise<any>;
    deleteUser: (userId: string) => Promise<void>;
    createInvitation: (type?: string) => Promise<{ token: string; id: string }>;
    createMaintenanceRequest: (data: MaintenanceRequestData) => Promise<any>;
    createDocument: (data: DocumentData) => Promise<any>;
    createProfile: (data: ProfileData) => Promise<any>;
    uploadAsset: (fileName: string, content: Buffer) => Promise<any>;

    // Cleanup
    cleanup: () => Promise<void>;
  };
}

interface MaintenanceRequestData {
  title: string;
  description: string;
  address?: string;
  phone?: string;
  unattendedEntry?: boolean;
}

interface DocumentData {
  title: string;
  type: string;
  content: string;
  status?: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
}

export const test = authTest.extend<ApiHelpers>({
  api: async ({ adminToken }, use) => {
    const createdResources: { type: string; id: string }[] = [];

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    };

    const apiCall = async (method: string, path: string, body?: any) => {
      const url = `${API_BASE_URL}${path}`;
      const options: RequestInit = { method, headers };
      if (body) {
        options.body = JSON.stringify(body);
      }
      const response = await fetch(url, options);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API ${method} ${path} failed: ${response.status} - ${text}`);
      }
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return response.json();
      }
      return response.text();
    };

    const api: ApiHelpers['api'] = {
      get: (path) => apiCall('GET', path),
      post: (path, body) => apiCall('POST', path, body),
      put: (path, body) => apiCall('PUT', path, body),
      delete: (path) => apiCall('DELETE', path),

      createUser: async (username, password) => {
        const result = await apiCall('POST', '/api/user', { username, password });
        createdResources.push({ type: 'user', id: result.id ?? result.userId });
        return result;
      },

      deleteUser: async (userId) => {
        await apiCall('DELETE', `/api/user/${userId}`);
      },

      createInvitation: async (type = 'Member') => {
        const result = await apiCall('POST', '/api/invitation', { type });
        createdResources.push({ type: 'invitation', id: result.id ?? result.invitationId });
        return { token: result.token, id: result.id ?? result.invitationId };
      },

      createMaintenanceRequest: async (data) => {
        const result = await apiCall('POST', '/api/maintenance-request', data);
        createdResources.push({
          type: 'maintenance',
          id: result.id ?? result.maintenanceRequestId,
        });
        return result;
      },

      createDocument: async (data) => {
        const result = await apiCall('POST', '/api/document', data);
        createdResources.push({ type: 'document', id: result.id ?? result.documentId });
        return result;
      },

      createProfile: async (data) => {
        const result = await apiCall('POST', '/api/profile', data);
        createdResources.push({ type: 'profile', id: result.id ?? result.profileId });
        return result;
      },

      uploadAsset: async (fileName, content) => {
        const formData = new FormData();
        const blob = new Blob([content]);
        formData.append('file', blob, fileName);

        const response = await fetch(`${API_BASE_URL}/api/digital-asset`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status}`);
        }
        const result = await response.json();
        createdResources.push({ type: 'asset', id: result.id ?? result.assetId });
        return result;
      },

      cleanup: async () => {
        // Clean up in reverse order
        for (const resource of createdResources.reverse()) {
          try {
            const pathMap: Record<string, string> = {
              user: `/api/user/${resource.id}`,
              invitation: `/api/invitation/${resource.id}`,
              maintenance: `/api/maintenance-request/${resource.id}`,
              document: `/api/document/${resource.id}`,
              profile: `/api/profile/${resource.id}`,
              asset: `/api/digital-asset/${resource.id}`,
            };
            const path = pathMap[resource.type];
            if (path) {
              await apiCall('DELETE', path);
            }
          } catch {
            // Ignore cleanup errors
          }
        }
        createdResources.length = 0;
      },
    };

    await use(api);

    // Auto-cleanup after each test
    await api.cleanup();
  },
});

export { expect };
