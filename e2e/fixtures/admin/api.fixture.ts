import { test as authTest, expect } from './auth.fixture';
import type { MockUser } from '../mock-api/mock-store';

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
  api: async ({ mockApi, adminToken }, use) => {
    const admin = mockApi.userByToken(adminToken) as MockUser;

    const apiCall = async (method: string, path: string, body?: any) => {
      const response = mockApi.call(method, path, body, admin);
      if (response.status >= 400) {
        throw new Error(
          `API ${method} ${path} failed: ${response.status} - ${JSON.stringify(response.body)}`,
        );
      }
      return response.body;
    };

    const api: ApiHelpers['api'] = {
      get: (path) => apiCall('GET', path),
      post: (path, body) => apiCall('POST', path, body),
      put: (path, body) => apiCall('PUT', path, body),
      delete: (path) => apiCall('DELETE', path),

      createUser: async (username, password) => {
        const user = mockApi.createUser({ username, password });
        return { userId: user.userId, id: user.userId, username: user.username };
      },

      deleteUser: async (userId) => {
        await apiCall('DELETE', `/api/user/${userId}`);
      },

      createInvitation: async (type = 'Member') => {
        const typeMap: Record<string, number> = { Member: 0, BoardMember: 1, StaffMember: 2 };
        const inv = mockApi.createInvitation({ type: typeMap[type] ?? 0 });
        return { token: inv.value, id: inv.invitationTokenId };
      },

      createMaintenanceRequest: async (data) => {
        const request = mockApi.createMaintenanceRequest(admin, {
          title: data.title,
          description: data.description,
          address: data.address,
          phone: data.phone,
          unattendedEntry: data.unattendedEntry,
        });
        return { ...request, id: request.maintenanceRequestId };
      },

      createDocument: async (data) => {
        const doc = mockApi.createDocument({
          title: data.title,
          type: data.type,
          content: data.content,
          status: data.status ?? 'Draft',
        });
        return { ...doc, id: doc.documentId };
      },

      createProfile: async (data) => {
        const profile = mockApi.createProfile(admin, {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        });
        return { ...profile, id: profile.profileId };
      },

      uploadAsset: async (fileName, content) => {
        const asset = mockApi.createAsset({ fileName, size: content.length });
        return { ...asset, id: asset.digitalAssetId };
      },

      cleanup: async () => {
        // Each test owns its own in-memory store, so there is nothing to undo.
      },
    };

    await use(api);
  },
});

export { expect };
