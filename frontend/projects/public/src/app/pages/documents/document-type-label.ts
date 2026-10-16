/**
 * The category name shown on a document, matching the filter words
 * (Notices, By-Laws, Reports) in the singular.
 */
export function documentTypeLabel(type: string | null | undefined): string {
  const t = (type ?? '').toLowerCase().replace(/[^a-z]/g, '');
  if (!t) return 'Document';
  if (t.startsWith('notice')) return 'Notice';
  if (t.startsWith('bylaw')) return 'By-Law';
  if (t.startsWith('report')) return 'Report';
  return t.charAt(0).toUpperCase() + t.slice(1);
}
