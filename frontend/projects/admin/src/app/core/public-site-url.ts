/**
 * The public site's origin, used for the site preview and to preview photos
 * stored as public site paths such as `/own/hero.svg`. In development the
 * public site runs on port 4201; deployed, it is https://own.esplanade.technology.
 */
export function publicSiteUrlFor(hostname: string): string {
  return hostname === 'localhost' || hostname === '127.0.0.1'
    ? 'http://localhost:4201'
    : 'https://own.esplanade.technology';
}

export const PUBLIC_SITE_URL = publicSiteUrlFor(globalThis.location?.hostname ?? 'localhost');
