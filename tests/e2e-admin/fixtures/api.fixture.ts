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
        const typeMap: Record<string, number> = { 'Member': 0, 'BoardMember': 1, 'StaffMember': 2 };
        const typeInt = typeMap[type] ?? 0;
        const value = 'inv-' + Math.random().toString(36).substring(2, 10);
        const result = await apiCall('POST', '/api/invitationtoken', { type: typeInt, value });
        const inv = result.invitationToken ?? result;
        createdResources.push({ type: 'invitation', id: inv.invitationTokenId ?? inv.id });
        return { token: inv.value ?? inv.token ?? value, id: inv.invitationTokenId ?? inv.id };
      },

      createMaintenanceRequest: async (data) => {
        // Get a valid profile ID for the request
        let profileId = '00000000-0000-0000-0000-000000000000';
        try {
          const profiles = await apiCall('GET', '/api/profiles');
          const profileList = profiles?.profiles || (Array.isArray(profiles) ? profiles : []);
          if (profileList.length > 0) {
            profileId = profileList[0].profileId;
          }
        } catch {
          // Use default
        }

        // Ensure a member profile exists for the request
        if (profileId === '00000000-0000-0000-0000-000000000000') {
          try {
            const memberResult = await apiCall('POST', '/api/members', {
              firstname: 'E2E',
              lastname: 'TestUser',
              phoneNumber: '555-0000',
            });
            const member = memberResult?.member ?? memberResult;
            profileId = member?.profileId ?? profileId;
          } catch {
            // Profile may already exist
          }
        }

        const body: any = {
          title: data.title,
          description: data.description,
          phone: data.phone || '555-0000',
          unitNumber: data.address,
          requestedByName: 'E2E Test User',
          requestedByProfileId: profileId,
        };
        const result = await apiCall('POST', '/api/maintenancerequest', body);
        const mr = result?.maintenanceRequest ?? result;
        createdResources.push({
          type: 'maintenance',
          id: mr.maintenanceRequestId ?? mr.id,
        });
        return mr;
      },

      createDocument: async (data) => {
        // Use type-specific endpoint for proper document creation
        const typeMap: Record<string, string> = {
          'Notice': 'notice',
          'By-Law': 'bylaw',
          'ByLaw': 'bylaw',
          'Report': 'report',
        };
        const endpoint = typeMap[data.type] || 'notice';
        const body: any = { name: data.title, body: data.content };
        const result = await apiCall('POST', `/api/${endpoint}`, body);
        // Response is wrapped: { notice: {...} } or { byLaw: {...} } etc.
        const doc = result?.notice ?? result?.byLaw ?? result?.report ?? result?.document ?? result;
        const docId = doc?.documentId ?? doc?.id ?? result?.documentId ?? result?.id;
        createdResources.push({ type: 'document', id: docId });

        // Publish if requested
        if (data.status === 'Published' && docId) {
          try {
            await apiCall('PUT', '/api/document/publish', { documentId: docId });
          } catch {
            // Ignore publish errors
          }
        }
        return doc;
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

        const response = await fetch(`${API_BASE_URL}/api/digitalasset/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status}`);
        }
        const result = await response.json();
        const asset = result.digitalAsset ?? result;
        createdResources.push({ type: 'asset', id: asset.digitalAssetId ?? asset.id });
        return asset;
      },

      cleanup: async () => {
        // Clean up in reverse order
        for (const resource of createdResources.reverse()) {
          try {
            const pathMap: Record<string, string> = {
              user: `/api/user/${resource.id}`,
              invitation: `/api/invitationtoken/${resource.id}`,
              maintenance: `/api/maintenancerequest/${resource.id}`,
              document: `/api/document/${resource.id}`,
              profile: `/api/profile/${resource.id}`,
              asset: `/api/digitalasset/${resource.id}`,
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
