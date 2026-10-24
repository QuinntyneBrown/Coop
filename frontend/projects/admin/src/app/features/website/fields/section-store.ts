import type { ContentRecord } from '../../../core/models/content-record';
import { readPath, writePath } from './content-path';
import type { SectionDefinition } from './section-definition';

/** The values of a section inside the site content. */
export function readSection(content: ContentRecord, section: SectionDefinition): ContentRecord {
  return readPath(content, section.path);
}

/** A copy of the site content with one section's values replaced. */
export function writeSection<T extends ContentRecord>(
  content: T,
  section: SectionDefinition,
  value: ContentRecord,
): T {
  return writePath(content, section.path, value);
}
