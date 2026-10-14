import type { ContentBlock } from './content-block';
import type { ContentField } from './content-field';

const ADDRESS_HELP =
  'A page on this site such as /#visit, a web address, an e-mail address or a phone number.';

const text = (key: string, label: string, required = false): ContentField => ({
  kind: 'text',
  key,
  label: required ? label : `${label} (optional)`,
  required,
});

const paragraph = (key: string, label: string, required = false): ContentField => ({
  kind: 'textarea',
  key,
  label: required ? label : `${label} (optional)`,
  required,
});

const linkFields: ContentField[] = [
  { kind: 'text', key: 'label', label: 'Label', required: true, maxLength: 100 },
  { kind: 'address', key: 'href', label: 'Address', help: ADDRESS_HELP },
];

const link = (key: string, label: string): ContentField => ({
  kind: 'group',
  key,
  label,
  fields: linkFields,
  columns: true,
});

const links = (key: string, label: string, itemName: string): ContentField => ({
  kind: 'list',
  key,
  label,
  itemName,
  fields: linkFields,
  columns: true,
  newItem: () => ({ label: '', href: '' }),
});

const photo = (key = 'photo'): ContentField => ({ kind: 'photo', key, label: 'Photo' });

const emptyPhoto = () => ({ src: '', alt: '', width: 0, height: 0 });

const eyebrow = (label = 'Small heading above the title') => text('eyebrow', label);
const title = () => text('title', 'Title', true);
const lead = () => paragraph('lead', 'Introduction');

const count = (items: unknown, one: string, many: string) => {
  const n = Array.isArray(items) ? items.length : 0;
  return `${n} ${n === 1 ? one : many}`;
};

/**
 * Every block of the site content the Website screen lists, in the order the
 * public site shows them (L2-REQ-093, L2-REQ-094). The editor dialog draws
 * each block from its fields.
 */
export const CONTENT_BLOCKS: ContentBlock[] = [
  {
    id: 'header',
    name: 'Header',
    group: 'every-page',
    path: 'header',
    summary: (block) => block['siteName'] ?? '',
    fields: [
      text('siteName', 'Site name', true),
      text('siteSubtitle', 'Subtitle under the site name'),
      links('menuLinks', 'Menu links', 'menu link'),
      link('signInLink', 'Sign-in button'),
      link('visitLink', 'Visit button in the phone menu'),
    ],
  },
  {
    id: 'footer',
    name: 'Footer',
    group: 'every-page',
    path: 'footer',
    summary: (block) => block['organisation'] ?? '',
    fields: [
      text('contactHeading', 'Heading over the contact details'),
      text('organisation', 'Organisation name'),
      text('area', 'Neighbourhood'),
      text('phone', 'Phone number'),
      text('email', 'E-mail address'),
      text('siteLinksHeading', 'Heading over the site links'),
      links('siteLinks', 'Site links', 'site link'),
      text('memberLinksHeading', 'Heading over the member links'),
      links('memberLinks', 'Member links', 'member link'),
      paragraph('copyright', 'Copyright line'),
      text('websiteLine', 'Website line'),
    ],
  },
  {
    id: 'hero',
    name: 'Hero',
    group: 'home',
    path: 'home.hero',
    summary: (block) => block['title'] ?? '',
    photo: (block) => block['photo']?.src,
    fields: [
      eyebrow(),
      title(),
      lead(),
      text('badge', 'Badge on the photo'),
      link('primaryAction', 'Main button'),
      link('secondaryAction', 'Second button'),
      photo(),
    ],
  },
  {
    id: 'glance',
    name: 'At a glance',
    group: 'home',
    path: 'home.glance',
    summary: (block) => count(block['figures'], 'figure', 'figures'),
    fields: [
      {
        kind: 'list',
        key: 'figures',
        label: 'Figures',
        itemName: 'figure',
        columns: true,
        fields: [text('value', 'Figure', true), text('label', 'What it counts', true)],
        newItem: () => ({ value: '', label: '' }),
      },
    ],
  },
  {
    id: 'about',
    name: 'Who we are',
    group: 'home',
    path: 'home.about',
    summary: (block) => block['title'] ?? '',
    fields: [
      eyebrow(),
      title(),
      lead(),
      {
        kind: 'list',
        key: 'values',
        label: 'Value cards',
        itemName: 'value card',
        fields: [
          {
            kind: 'choice',
            key: 'icon',
            label: 'Picture',
            options: [
              { value: 'members', label: 'People together' },
              { value: 'affordable', label: 'A home with a heart' },
              { value: 'company', label: 'A cup of tea' },
            ],
          },
          title(),
          paragraph('text', 'Text'),
        ],
        newItem: () => ({ icon: 'members', title: '', text: '' }),
      },
    ],
  },
  {
    id: 'gallery',
    name: 'A look around',
    group: 'home',
    path: 'home.gallery',
    summary: (block) => count(block['photos'], 'photo', 'photos'),
    photo: (block) => block['photos']?.[0]?.photo?.src,
    fields: [
      eyebrow(),
      title(),
      {
        kind: 'list',
        key: 'photos',
        label: 'Photos',
        itemName: 'photo',
        fields: [
          photo(),
          text('caption', 'Caption'),
          {
            kind: 'choice',
            key: 'size',
            label: 'Size',
            options: [
              { value: 'wide', label: 'Wide' },
              { value: 'tall', label: 'Tall' },
              { value: 'small', label: 'Small' },
            ],
          },
        ],
        newItem: () => ({ photo: emptyPhoto(), caption: '', size: 'small' }),
      },
    ],
  },
  {
    id: 'features',
    name: 'Our building and community',
    group: 'home',
    path: 'home.features',
    summary: (block) => count(block['rows'], 'row', 'rows'),
    photo: (block) => block['rows']?.[0]?.photo?.src,
    fields: [
      {
        kind: 'list',
        key: 'rows',
        label: 'Rows',
        itemName: 'row',
        fields: [
          eyebrow('Small heading'),
          title(),
          { kind: 'lines', key: 'items', label: 'Checklist (one item per line)' },
          photo(),
        ],
        newItem: () => ({ eyebrow: '', title: '', items: [], photo: emptyPhoto() }),
      },
    ],
  },
  {
    id: 'notices',
    name: "What's on",
    group: 'home',
    path: 'home.notices',
    summary: (block) => block['title'] ?? '',
    fields: [
      eyebrow(),
      title(),
      lead(),
      paragraph('emptyMessage', 'Message when no notice is published'),
    ],
  },
  {
    id: 'board',
    name: 'Meet the board',
    group: 'home',
    path: 'home.board',
    summary: (block) => block['title'] ?? '',
    fields: [eyebrow(), title()],
  },
  {
    id: 'quote',
    name: 'A word from a member',
    group: 'home',
    path: 'home.quote',
    summary: (block) => (block['text'] ? `“${block['text']}”` : ''),
    photo: (block) => block['photo']?.src,
    fields: [paragraph('text', 'Quotation', true), text('attribution', 'Who said it'), photo()],
  },
  {
    id: 'visit',
    name: 'Visit or apply',
    group: 'home',
    path: 'home.visit',
    summary: (block) => block['title'] ?? '',
    fields: [
      eyebrow(),
      title(),
      lead(),
      text('phone', 'Phone number'),
      text('hours', 'Office hours'),
      link('action', 'Button'),
    ],
  },
];

/** A list item as the editor draws it: the item's name and number, such as "Menu link 2". */
export function itemLegend(field: ContentField, index: number): string {
  const name = field.itemName ?? 'item';
  return `${name[0].toUpperCase()}${name.slice(1)} ${index + 1}`;
}

/** The blocks of one group of the Website screen. */
export function blocksIn(group: ContentBlock['group']): ContentBlock[] {
  return CONTENT_BLOCKS.filter((block) => block.group === group);
}
