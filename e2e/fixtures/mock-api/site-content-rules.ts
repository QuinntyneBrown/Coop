/**
 * The API's site content rules (SaveSiteContentValidator, L2-REQ-093 to
 * L2-REQ-097): required values, safe links and photo addresses, photo
 * descriptions and length limits. Returns the first problem found, or null.
 */
export function siteContentError(content: any): string | null {
  const required: string[] = [
    'header.siteName',
    'home.hero.title',
    'home.about.title',
    'home.gallery.title',
    'home.notices.title',
    'home.board.title',
    'home.quote.text',
    'home.visit.title',
  ];
  for (const path of required) {
    const value = path.split('.').reduce((node: any, key) => node?.[key], content);
    if (typeof value !== 'string' || !value.trim()) return `Fill in ${path}`;
  }
  for (const row of content?.home?.features?.rows ?? []) {
    if (!String(row?.title ?? '').trim()) return 'Fill in the row title';
  }
  for (const figure of content?.home?.glance?.figures ?? []) {
    if (!String(figure?.value ?? '').trim() || !String(figure?.label ?? '').trim())
      return 'Fill in the figure';
  }
  for (const value of content?.home?.about?.values ?? []) {
    if (!String(value?.title ?? '').trim()) return 'Fill in the value card title';
    if (!['members', 'affordable', 'company'].includes(value?.icon)) return 'Unknown picture';
  }
  for (const item of content?.home?.gallery?.photos ?? []) {
    if (!['wide', 'tall', 'small'].includes(item?.size)) return 'Unknown photo size';
  }
  return walk(content);
}

function walk(node: any): string | null {
  if (typeof node === 'string') return node.length > 2000 ? 'Text too long' : null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const error = walk(child);
      if (error) return error;
    }
    return null;
  }
  if (node && typeof node === 'object') {
    if ('label' in node && 'href' in node) return linkError(node);
    if ('src' in node && 'alt' in node) return photoError(node);
    for (const child of Object.values(node)) {
      const error = walk(child);
      if (error) return error;
    }
  }
  return null;
}

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

function linkError(link: any): string | null {
  const label = String(link.label ?? '');
  const href = String(link.href ?? '');
  if (!label.trim() || label.length > 100) return 'Fill in the link label';
  if (!href.trim() || href.length > 2048 || !isSafeLink(href)) {
    return 'Use a page on this site, a web address, an e-mail address or a phone number.';
  }
  return null;
}

function photoError(photo: any): string | null {
  const src = String(photo.src ?? '');
  const alt = String(photo.alt ?? '');
  if (!src || src.length > 2048 || !isSafeImageAddress(src))
    return 'Use a photo from the Assets library.';
  if (!alt.trim()) return 'Describe this photo for people who cannot see it';
  if (alt.length > 250) return 'Keep the description under 250 characters';
  for (const size of [photo.width, photo.height]) {
    if (!Number.isInteger(size) || size < 1 || size > 10000) return 'Photo size out of range';
  }
  return null;
}
