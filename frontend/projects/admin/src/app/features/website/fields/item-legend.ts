import type { ContentField } from './content-field';

/** A list item as the editor draws it: the item's name and number, such as "Menu link 2". */
export function itemLegend(field: ContentField, index: number): string {
  const name = field.itemName ?? 'item';
  return `${name[0].toUpperCase()}${name.slice(1)} ${index + 1}`;
}
