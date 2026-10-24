import type { ContentField } from './content-field';

/** Short ways to describe the fields of a section (L2-REQ-095 to L2-REQ-098). */

export const ADDRESS_HELP =
  'A page on this site such as /#visit, a web address, an e-mail address or a phone number.';

export const text = (key: string, label: string, required = false): ContentField => ({
  kind: 'text',
  key,
  label: required ? label : `${label} (optional)`,
  required,
});

export const paragraph = (key: string, label: string, required = false): ContentField => ({
  kind: 'textarea',
  key,
  label: required ? label : `${label} (optional)`,
  required,
});

export const linkFields: ContentField[] = [
  { kind: 'text', key: 'label', label: 'Label', required: true, maxLength: 100 },
  { kind: 'address', key: 'href', label: 'Address', help: ADDRESS_HELP },
];

export const link = (key: string, label: string): ContentField => ({
  kind: 'group',
  key,
  label,
  fields: linkFields,
  columns: true,
});

export const links = (key: string, label: string, itemName: string): ContentField => ({
  kind: 'list',
  key,
  label,
  itemName,
  fields: linkFields,
  columns: true,
  newItem: () => ({ label: '', href: '' }),
});

export const photo = (key = 'photo'): ContentField => ({ kind: 'photo', key, label: 'Photo' });

export const emptyPhoto = () => ({ src: '', alt: '', width: 0, height: 0 });

export const eyebrow = (label = 'Small heading above the title') => text('eyebrow', label);
export const title = () => text('title', 'Title', true);
export const lead = () => paragraph('lead', 'Introduction');
