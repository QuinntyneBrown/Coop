/**
 * Global setup for E2E tests.
 * Ensures seed data exists for all test suites.
 */

const API_BASE_URL = 'http://localhost:5000';

async function getToken(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/user/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'Admin123!' }),
  });
  if (!response.ok) throw new Error(`Auth failed: ${response.status}`);
  const data = await response.json();
  return data.accessToken ?? data.token ?? data;
}

async function apiCall(token: string, method: string, path: string, body?: any) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  if (!response.ok) return null;
  const ct = response.headers.get('content-type');
  return ct?.includes('json') ? response.json() : null;
}

export default async function globalSetup() {
  try {
    const token = await getToken();

    // Ensure at least one member profile exists
    const profiles = await apiCall(token, 'GET', '/api/profiles');
    const profileList = profiles?.profiles || [];
    if (profileList.length === 0) {
      await apiCall(token, 'POST', '/api/members', {
        firstname: 'Admin',
        lastname: 'User',
        phoneNumber: '555-1234',
      });
    }

    // Ensure all roles have Document/Profile group privileges
    const rolesData = await apiCall(token, 'GET', '/api/role');
    const roles = rolesData?.roles || [];

    const requiredAggregates = ['Notice', 'ByLaw', 'Report', 'Member', 'BoardMember', 'StaffMember'];
    const accessRightForRole: Record<string, number> = {
      SystemAdministrator: 4,
      BoardMember: 3,
      Staff: 2,
      Support: 2,
      Member: 1,
    };

    for (const role of roles) {
      const existingAggregates = new Set((role.privileges || []).map((p: any) => p.aggregate));
      const accessRight = accessRightForRole[role.name] ?? 1;

      for (const agg of requiredAggregates) {
        if (!existingAggregates.has(agg)) {
          await apiCall(token, 'POST', '/api/privilege', {
            roleId: role.roleId,
            aggregate: agg,
            accessRight,
          });
        }
      }
    }
  } catch (e) {
    console.warn('Global setup warning:', e);
  }
}
