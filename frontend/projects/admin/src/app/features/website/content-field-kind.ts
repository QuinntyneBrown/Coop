/**
 * How the block editor draws a value: a line of text, a paragraph, a list of
 * lines, a link address, a choice, a photo, a group of fields (such as a link's
 * label and address) or a repeatable list of items.
 */
export type ContentFieldKind =
  'text' | 'textarea' | 'lines' | 'address' | 'choice' | 'photo' | 'group' | 'list';
