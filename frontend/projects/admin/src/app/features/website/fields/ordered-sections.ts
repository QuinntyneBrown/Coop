import type { ContentRecord } from '../../../core/models/content-record';
import { homeSections } from './section-store';
import type { SectionDefinition } from './section-definition';

/**
 * The sections in the order visitors see them (L2-REQ-120 AC1): a home page
 * section's place comes from `home.sections`; a kind the content lacks is
 * listed last so it can still be edited; sections with a fixed path keep the
 * order they are defined in.
 */
export function orderedSections(
  content: ContentRecord,
  definitions: SectionDefinition[],
): SectionDefinition[] {
  const kinds = homeSections(content).map((s) => s['kind'] as string);
  const byKind = (kind: string) => definitions.find((d) => !d.path && d.kind === kind);
  const listed = kinds.map(byKind).filter((d): d is SectionDefinition => d !== undefined);
  const rest = definitions.filter((d) => d.path || !kinds.includes(d.kind));
  return [...listed, ...rest];
}
