import type { ContentRecord } from '../../../core/models/content-record';
import type { ContentField } from './content-field';

/**
 * The editor works on a copy of a block in which each list of lines (a
 * checklist) is one text, so the administrator can type new lines freely.
 */
export function toDraft(fields: ContentField[], value: ContentRecord): ContentRecord {
  const draft: ContentRecord = structuredClone(value ?? {});
  for (const field of fields) {
    if (field.kind === 'lines') {
      draft[field.key] = Array.isArray(draft[field.key]) ? draft[field.key].join('\n') : '';
    } else if (field.kind === 'group') {
      draft[field.key] = toDraft(field.fields ?? [], draft[field.key]);
    } else if (field.kind === 'list') {
      const items = Array.isArray(draft[field.key]) ? draft[field.key] : [];
      draft[field.key] = items.map((item: ContentRecord) => toDraft(field.fields ?? [], item));
    }
  }
  return draft;
}

/** The block to save: texts trimmed and each checklist split into its non-empty lines. */
export function fromDraft(fields: ContentField[], draft: ContentRecord): ContentRecord {
  const value: ContentRecord = { ...draft };
  for (const field of fields) {
    const current = draft[field.key];
    if (field.kind === 'lines') {
      value[field.key] = String(current ?? '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    } else if (field.kind === 'group') {
      value[field.key] = fromDraft(field.fields ?? [], current ?? {});
    } else if (field.kind === 'list') {
      value[field.key] = (current ?? []).map((item: ContentRecord) =>
        fromDraft(field.fields ?? [], item),
      );
    } else if (field.kind === 'photo') {
      value[field.key] = { ...current, alt: String(current?.alt ?? '').trim() };
    } else if (typeof current === 'string') {
      value[field.key] = current.trim();
    }
  }
  return value;
}
