import { emptyPhoto, eyebrow, lead, link, paragraph, photo, text, title } from './field-helpers';
import type { SectionDefinition } from './section-definition';

/**
 * The home page sections in the order visitors see them by default
 * (L2-REQ-096, L2-REQ-119, L2-REQ-122), each with its plain name, where it
 * appears, and the fields the page editor draws.
 */
export const HOME_SECTIONS: SectionDefinition[] = [
  {
    kind: 'hero',
    name: 'Welcome banner',
    placement: 'Appears first on the home page, under the menu.',
    anchor: 'top',
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
    kind: 'glance',
    name: 'Numbers at a glance',
    placement: 'Appears under the welcome banner, as three large numbers.',
    anchor: 'glance',
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
    kind: 'about',
    name: 'Who we are',
    placement: 'Appears under the numbers, with three value cards.',
    anchor: 'about',
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
    kind: 'gallery',
    name: 'A look around',
    placement: 'Appears under “Who we are”, as a grid of photos with captions.',
    anchor: 'life',
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
    kind: 'features',
    name: 'Our building and community',
    placement: 'Appears under the photos, as rows with a photo beside a checklist.',
    anchor: 'features',
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
    kind: 'notices',
    name: "What's on",
    placement: 'Appears under “Our building and community”, with the published notices.',
    anchor: 'events',
    linked: 'notices',
    fields: [
      eyebrow(),
      title(),
      lead(),
      paragraph('emptyMessage', 'Message when no notice is published'),
    ],
  },
  {
    kind: 'board',
    name: 'Board of directors',
    placement: 'Appears under “What’s on”, with one card per director.',
    anchor: 'board',
    linked: 'board',
    fields: [eyebrow(), title()],
  },
  {
    kind: 'quote',
    name: 'A word from a member',
    placement: 'Appears under the board, as a large quotation with a photo.',
    anchor: 'quote',
    fields: [paragraph('text', 'Quotation', true), text('attribution', 'Who said it'), photo()],
  },
  {
    kind: 'visit',
    name: 'Visit or apply',
    placement: 'Appears last on the home page, above the footer.',
    anchor: 'visit',
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
