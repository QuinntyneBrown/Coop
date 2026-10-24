import type { IconName } from 'components';
import type { ContentRecord } from '../../../core/models/content-record';
import { ADDRESS_HELP, photo } from './field-helpers';
import type { SectionDefinition } from './section-definition';

/** Where a block appears, as the placement sentence says. */
const IN_THE_BODY = 'Appears in the page body, in this order.';

/**
 * The Page banner and the kinds of body block a website page is made of
 * (L2-REQ-123 AC1, AC9), as the page editor lists and edits them. A block
 * lives at `sections.{index}` of the page.
 */
export const PAGE_BANNER: SectionDefinition = {
  kind: 'banner',
  name: 'Page banner',
  placement: 'Appears at the top of the page: the title and the photo under it.',
  anchor: 'top',
  path: '',
  fields: [],
};

/** The block kinds "Add to the page" offers, in that order. */
export const BLOCK_KINDS = ['heading', 'paragraph', 'bullets', 'photo', 'link'] as const;

export type BlockKind = (typeof BLOCK_KINDS)[number] | 'html';

const BLOCK_NAMES: Record<BlockKind, string> = {
  heading: 'Heading',
  paragraph: 'Paragraph',
  bullets: 'Bullet list',
  photo: 'Photo',
  link: 'Link button',
  html: 'Existing content',
};

export const BLOCK_ICONS: Record<BlockKind, IconName> = {
  heading: 'heading',
  paragraph: 'paragraph',
  bullets: 'bullets',
  photo: 'photo',
  link: 'link',
  html: 'documents',
};

export function blockLabel(kind: string): string {
  return BLOCK_NAMES[kind as BlockKind] ?? 'Block';
}

/** A new, empty block of a kind. */
export function newBlock(kind: BlockKind): ContentRecord {
  switch (kind) {
    case 'heading':
    case 'paragraph':
      return { kind, text: '' };
    case 'bullets':
      return { kind, items: [] };
    case 'photo':
      return { kind, photo: { src: '', alt: '', width: 0, height: 0 } };
    case 'link':
      return { kind, label: '', href: '' };
    case 'html':
      return { kind, html: '' };
  }
}

/** The name the section list shows: the kind and the start of its text ("Heading: Who can apply"). */
export function blockName(block: ContentRecord): string {
  const label = blockLabel(block['kind']);
  const text = block['kind'] === 'link' ? block['label'] : block['text'];
  const start = String(text ?? '').trim();
  if (!start) return label;
  if (start.length <= 40) return `${label}: ${start}`;
  const cut = start.slice(0, 40);
  return `${label}: ${cut.slice(0, Math.max(cut.lastIndexOf(' '), 1)).trim()}…`;
}

/** The section definition of the block at `index` of the page. */
export function blockDefinition(block: ContentRecord, index: number): SectionDefinition {
  const kind = block['kind'] as BlockKind;
  const base = {
    kind: `block-${index}`,
    placement: IN_THE_BODY,
    anchor: 'main',
    path: `sections.${index}`,
  };
  switch (kind) {
    case 'heading':
      return {
        ...base,
        name: blockName(block),
        fields: [{ kind: 'text', key: 'text', label: 'Heading', required: true }],
      };
    case 'paragraph':
      return {
        ...base,
        name: blockName(block),
        fields: [{ kind: 'textarea', key: 'text', label: 'Paragraph', required: true }],
      };
    case 'bullets':
      return {
        ...base,
        name: blockName(block),
        fields: [
          { kind: 'lines', key: 'items', label: 'Bullet list (one item per line)', required: true },
        ],
      };
    case 'photo':
      return { ...base, name: blockName(block), fields: [photo()] };
    case 'link':
      return {
        ...base,
        name: blockName(block),
        fields: [
          { kind: 'text', key: 'label', label: 'Label', required: true, maxLength: 100 },
          { kind: 'address', key: 'href', label: 'Address', help: ADDRESS_HELP },
        ],
      };
    default:
      return {
        ...base,
        name: blockName(block),
        fields: [
          {
            kind: 'textarea',
            key: 'html',
            label: 'Existing content',
            required: true,
            help: 'This is the page as it was written before, as simple HTML. Replace it with headings, paragraphs and photos over time.',
          },
        ],
      };
  }
}
