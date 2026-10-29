import type { ContentRecord } from '../../../core/models/content-record';
import { readPath, writePath } from './content-path';
import type { SectionDefinition } from './section-definition';

/** The home page sections list of the site content, or an empty list. */
export function homeSections(content: ContentRecord): ContentRecord[] {
  const sections = content['home']?.['sections'];
  return Array.isArray(sections) ? sections : [];
}

/** The values of a section inside the site content: by path, or by kind in `home.sections` (L2-REQ-122). */
export function readSection(content: ContentRecord, section: SectionDefinition): ContentRecord {
  if (section.path) return readPath(content, section.path);
  return homeSections(content).find((s) => s['kind'] === section.kind) ?? {};
}

/**
 * A copy of the site content with one section's values replaced. A home page
 * section keeps its place, its kind and its hidden flag; one the list lacks
 * is added at the end.
 */
export function writeSection<T extends ContentRecord>(
  content: T,
  section: SectionDefinition,
  value: ContentRecord,
): T {
  if (section.path) return writePath(content, section.path, value);
  const sections = homeSections(content);
  const existing = sections.find((s) => s['kind'] === section.kind);
  const updated: ContentRecord = { ...existing, ...value, kind: section.kind };
  // French the office emptied is gone from the value; drop the saved copy too.
  if (!('fr' in value)) delete updated['fr'];
  const list = existing
    ? sections.map((s) => (s === existing ? updated : s))
    : [...sections, updated];
  return writePath(content, 'home.sections', list);
}
