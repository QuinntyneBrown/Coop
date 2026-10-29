import type { ContentRecord } from '../../../core/models/content-record';
import type { ContentField } from './content-field';
import { frenchOf } from './french-text';

/**
 * The editor works on a copy of a block in which each list of lines (a
 * checklist) is one text, so the administrator can type new lines freely.
 * Every item and photo has an `fr` object for its French fields (L2-REQ-130).
 */
export function toDraft(fields: ContentField[], value: ContentRecord): ContentRecord {
  const draft: ContentRecord = structuredClone(value ?? {});
  draft['fr'] = { ...draft['fr'] };
  for (const field of fields) {
    if (field.kind === 'lines') {
      draft[field.key] = Array.isArray(draft[field.key]) ? draft[field.key].join('\n') : '';
      const french = draft['fr'][field.key];
      draft['fr'][field.key] = Array.isArray(french) ? french.join('\n') : '';
    } else if (field.kind === 'photo') {
      draft[field.key] = { ...draft[field.key], fr: { ...draft[field.key]?.fr } };
    } else if (field.kind === 'group') {
      draft[field.key] = toDraft(field.fields ?? [], draft[field.key]);
    } else if (field.kind === 'list') {
      const items = Array.isArray(draft[field.key]) ? draft[field.key] : [];
      draft[field.key] = items.map((item: ContentRecord) => toDraft(field.fields ?? [], item));
    }
  }
  return draft;
}

/**
 * The block to save: texts trimmed and each checklist split into its
 * non-empty lines, in English and in French; empty French is left out.
 */
export function fromDraft(fields: ContentField[], draft: ContentRecord): ContentRecord {
  const value: ContentRecord = { ...draft };
  const french: ContentRecord = { ...draft['fr'] };
  for (const field of fields) {
    const current = draft[field.key];
    if (field.kind === 'lines') {
      value[field.key] = linesOf(current);
      if (field.key in french) french[field.key] = linesOf(french[field.key]);
    } else if (field.kind === 'group') {
      value[field.key] = fromDraft(field.fields ?? [], current ?? {});
    } else if (field.kind === 'list') {
      value[field.key] = (current ?? []).map((item: ContentRecord) =>
        fromDraft(field.fields ?? [], item),
      );
    } else if (field.kind === 'photo') {
      const photo = { ...current, alt: String(current?.alt ?? '').trim() };
      withFrench(photo, { ...current?.fr, alt: String(current?.fr?.alt ?? '').trim() });
      value[field.key] = photo;
    } else if (typeof current === 'string') {
      value[field.key] = current.trim();
      if (typeof french[field.key] === 'string') french[field.key] = french[field.key].trim();
    }
  }
  withFrench(value, french);
  return value;
}

function linesOf(text: unknown): string[] {
  return String(text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Sets an item's French, or removes its `fr` object when no French is left. */
function withFrench(value: ContentRecord, french: ContentRecord): void {
  const kept = frenchOf(french);
  if (kept) value['fr'] = kept;
  else delete value['fr'];
}
