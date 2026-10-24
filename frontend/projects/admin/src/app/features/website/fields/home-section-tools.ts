import type { ContentRecord } from '../../../core/models/content-record';
import { writePath } from './content-path';
import { moveItem } from './move-item';
import { homeSections } from './section-store';

/** A copy of the site content with one home page section moved up (-1) or down (1) (L2-REQ-120 AC2). */
export function moveHomeSection<T extends ContentRecord>(
  content: T,
  kind: string,
  offset: -1 | 1,
): T {
  const sections = homeSections(content);
  const index = sections.findIndex((s) => s['kind'] === kind);
  if (index < 0) return content;
  return writePath(content, 'home.sections', moveItem(sections, index, offset));
}

/** A copy of the site content with one home page section hidden or shown (L2-REQ-120 AC3). */
export function setHomeSectionHidden<T extends ContentRecord>(
  content: T,
  kind: string,
  hidden: boolean,
): T {
  const sections = homeSections(content).map((s) => (s['kind'] === kind ? { ...s, hidden } : s));
  return writePath(content, 'home.sections', sections);
}

/** True when the home page section is hidden in the content. */
export function isHomeSectionHidden(content: ContentRecord, kind: string): boolean {
  return homeSections(content).find((s) => s['kind'] === kind)?.['hidden'] === true;
}
