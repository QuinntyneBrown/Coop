import type { ContentRecord } from '../../core/models/content-record';
import type { ContentField } from './content-field';
import { isSafeLink } from './safe-address';

export const UNSAFE_LINK =
  'Use a page on this site, a web address, an e-mail address or a phone number.';
const TEXT_MAX_LENGTH = 2000;

/**
 * Client-side checks before a save (L2-REQ-093 AC4, L2-REQ-094 AC4,
 * L2-REQ-095 AC2 and AC3, L2-REQ-096 AC1): a message per field path, such as
 * `title` or `menuLinks.2.href`. The API applies the same rules and stays
 * authoritative.
 */
export function validateBlock(
  fields: ContentField[],
  draft: ContentRecord,
  prefix = '',
  item = '',
): Record<string, string> {
  const errors: Record<string, string> = {};
  const fillIn = (label: string) => `Fill in “${label}”${item ? ` for ${item}` : ''}`;

  for (const field of fields) {
    const path = prefix + field.key;
    const value = draft?.[field.key];
    switch (field.kind) {
      case 'text':
      case 'textarea':
      case 'lines': {
        const text = String(value ?? '').trim();
        if (field.required && !text) errors[path] = fillIn(field.label);
        else if (field.maxLength && text.length > field.maxLength) {
          errors[path] = `Keep “${field.label}” under ${field.maxLength} characters`;
        } else if (text.length > TEXT_MAX_LENGTH) {
          errors[path] = `Keep “${field.label}” under ${TEXT_MAX_LENGTH} characters`;
        }
        break;
      }
      case 'address': {
        const href = String(value ?? '').trim();
        if (!href) errors[path] = fillIn(field.label);
        else if (href.length > 2048 || !isSafeLink(href)) errors[path] = UNSAFE_LINK;
        break;
      }
      case 'photo': {
        const alt = String(value?.alt ?? '').trim();
        if (!value?.src) errors[`${path}.src`] = `Choose a photo${item ? ` for ${item}` : ''}`;
        if (!alt) errors[`${path}.alt`] = 'Describe this photo for people who cannot see it';
        else if (alt.length > 250)
          errors[`${path}.alt`] = 'Keep the description under 250 characters';
        break;
      }
      case 'group':
        Object.assign(errors, validateBlock(field.fields ?? [], value, `${path}.`, item));
        break;
      case 'list':
        (value ?? []).forEach((entry: ContentRecord, index: number) => {
          Object.assign(
            errors,
            validateBlock(
              field.fields ?? [],
              entry,
              `${path}.${index}.`,
              `${field.itemName} ${index + 1}`,
            ),
          );
        });
        break;
    }
  }
  return errors;
}
