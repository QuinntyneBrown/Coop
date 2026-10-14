import type { ContentRecord } from '../../core/models/content-record';
import type { ContentField } from './content-field';

/** A part of the site content edited as a unit on the Website screen (L2-REQ-095, L2-REQ-096). */
export interface ContentBlock {
  id: string;
  name: string;
  group: 'every-page' | 'home';
  /** Where the block sits in the site content, for example `home.hero`. */
  path: string;
  /** One line that tells the block's current content. */
  summary: (block: ContentRecord) => string;
  /** The address of the block's first photo, when it has photos. */
  photo?: (block: ContentRecord) => string | undefined;
  fields: ContentField[];
}
