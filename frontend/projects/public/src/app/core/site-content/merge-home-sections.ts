import type { HomeSection } from './home-section';
import { mergeContent } from './merge-content';

/**
 * Lays the published `home.sections` over the default sections (L2-REQ-122
 * AC4, AC5): when the published value is a list, each entry whose `kind`
 * names a default section is laid over that default value by value, keeps
 * `hidden` when it is true, and the published order is kept; entries with an
 * unknown kind, and a kind repeated, are dropped. When the value is not a
 * list the defaults show in the default order.
 */
export function mergeHomeSections(defaults: HomeSection[], published: unknown): HomeSection[] {
  if (!Array.isArray(published)) return defaults;
  const seen = new Set<string>();
  const merged: HomeSection[] = [];
  for (const entry of published) {
    const kind = (entry as { kind?: unknown } | null)?.kind;
    const fallback = defaults.find((section) => section.kind === kind);
    if (typeof kind !== 'string' || !fallback || seen.has(kind)) continue;
    seen.add(kind);
    const section = mergeContent(fallback, entry);
    section.hidden = (entry as { hidden?: unknown }).hidden === true;
    merged.push(section);
  }
  return merged;
}
