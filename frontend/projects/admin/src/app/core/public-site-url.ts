/**
 * The public site's origin, used for the site preview and to preview photos
 * stored as public site paths such as `/own/hero.svg`. In development the
 * public site runs on port 4201; deployed, it is the admin's host without the
 * `app.` prefix (app.example.org serves the admin, example.org the public site).
 */
export function publicSiteUrlFor(location: { protocol: string; hostname: string }): string {
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    return 'http://localhost:4201';
  }
  return `${location.protocol}//${location.hostname.replace(/^app\./, '')}`;
}

export const PUBLIC_SITE_URL = publicSiteUrlFor(globalThis.location ?? { protocol: 'http:', hostname: 'localhost' });
