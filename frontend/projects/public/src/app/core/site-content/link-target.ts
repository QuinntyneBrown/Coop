/**
 * How a published link address is drawn (L2-REQ-098): a site path without a
 * section is a router link, anything else a plain `href`. Addresses on other
 * websites are marked external so they carry `rel="noopener noreferrer"`.
 */
export function linkTarget(href: string): { route?: string; href?: string; external: boolean } {
  if (href.startsWith('/') && !href.startsWith('//') && !href.includes('#')) {
    return { route: href, external: false };
  }
  return { href, external: /^https?:\/\//i.test(href) };
}
