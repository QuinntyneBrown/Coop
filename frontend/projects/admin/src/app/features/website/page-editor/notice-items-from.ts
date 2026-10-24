import type { LinkedItem } from './linked-summary-of';

const TORONTO = 'America/Toronto';

/** The published notices, newest first, as the "What's on" summary lists them. */
export function noticeItemsFrom(response: unknown): LinkedItem[] {
  const list = Array.isArray(response)
    ? response
    : ((response as { documents?: unknown[] } | null)?.documents ?? []);
  return list
    .filter((doc): doc is Record<string, unknown> => !!doc && typeof doc === 'object')
    .filter((doc) =>
      String(doc['documentType'] ?? doc['type'] ?? '')
        .toLowerCase()
        .startsWith('notice'),
    )
    .filter((doc) => doc['status'] === 'Published' || doc['published'] === true)
    .map((doc) => ({
      name: String(doc['name'] ?? doc['title'] ?? ''),
      createdOn: String(doc['createdOn'] ?? doc['createdAt'] ?? ''),
    }))
    .sort((a, b) => b.createdOn.localeCompare(a.createdOn))
    .map((doc) => ({ name: doc.name, detail: dateLabel(doc.createdOn) }));
}

function dateLabel(iso: string): string {
  const date = new Date(iso);
  if (!iso || Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TORONTO,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
