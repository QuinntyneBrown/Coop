/**
 * The admin site's login screen. The public site has no login screen of its
 * own; every sign-in link and redirect opens this one (L2-REQ-101, ADR 0011).
 * In development the admin site runs on port 4200; deployed, it is
 * https://app.esplanade.technology.
 */
export function adminLoginUrlFor(hostname: string): string {
  return hostname === 'localhost' || hostname === '127.0.0.1'
    ? 'http://localhost:4200/login'
    : 'https://app.esplanade.technology/login';
}

export const ADMIN_LOGIN_URL = adminLoginUrlFor(globalThis.location?.hostname ?? 'localhost');
