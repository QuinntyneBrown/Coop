/**
 * The API's rules for addresses (L2-REQ-096): a link goes to a site path
 * starting with one "/", an http(s) address, a mailto: address or a tel:
 * number; a photo is a site path or an http(s) address. The server rules stay
 * authoritative.
 */
export function isSafeLink(href: string): boolean {
  return (
    isSitePath(href) || isWebAddress(href) || /^mailto:.+/i.test(href) || /^tel:.+/i.test(href)
  );
}

export function isSafeImageAddress(src: string): boolean {
  return isSitePath(src) || isWebAddress(src);
}

function isSitePath(value: string): boolean {
  return value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\');
}

function isWebAddress(value: string): boolean {
  return /^https?:\/\/[^/\s]+/i.test(value);
}
