import type { ContentRecord } from '../../core/models/content-record';
import type { ContentFieldKind } from './content-field-kind';

/** One value of a block, described for the generic block editor. */
export interface ContentField {
  kind: ContentFieldKind;
  /** The property that holds the value in the block or list item. */
  key: string;
  label: string;
  required?: boolean;
  maxLength?: number;
  help?: string;
  /** For a choice. */
  options?: { value: string; label: string }[];
  /** For a group or list: the fields of the group or of each item. */
  fields?: ContentField[];
  /** For a group or list: draw the fields side by side on wide screens. */
  columns?: boolean;
  /** For a list: what one item is called, for example "menu link". */
  itemName?: string;
  /** For a list: a new, empty item. */
  newItem?: () => ContentRecord;
}
