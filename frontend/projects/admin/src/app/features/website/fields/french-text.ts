import type { ContentRecord } from '../../../core/models/content-record';

/**
 * The French of an item without its empty texts and lists, or undefined when
 * none is left, so empty French fields are not saved (L2-REQ-130 AC3, ADR 0023).
 */
export function frenchOf(french: ContentRecord | undefined): ContentRecord | undefined {
  const kept = Object.entries(french ?? {}).filter(
    ([, value]) => value !== null && value !== undefined && value !== '' && !isEmptyList(value),
  );
  return kept.length > 0 ? Object.fromEntries(kept) : undefined;
}

/** The label of a value's French field: "Title" becomes "Title in French" (L2-REQ-130 AC1). */
export function frenchLabel(label: string): string {
  return `${label.replace(/ \(optional\)$/, '')} in French`;
}

/** The path of a value's French text: `menuLinks.0.label` becomes `menuLinks.0.fr.label`. */
export function frenchPath(path: string, key: string): string {
  return `${path.slice(0, path.length - key.length)}fr.${key}`;
}

function isEmptyList(value: unknown): boolean {
  return Array.isArray(value) && value.length === 0;
}
