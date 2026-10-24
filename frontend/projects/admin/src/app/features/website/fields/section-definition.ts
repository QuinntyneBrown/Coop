import type { ContentField } from './content-field';
import type { LinkedSectionKind } from './linked-section-kind';

/** A section of a page as the page editor lists and edits it (L2-REQ-119). */
export interface SectionDefinition {
  /** The section's kind in the content, for example `hero`; also its key in the list. */
  kind: string;
  /** The name the office sees, in plain words. */
  name: string;
  /** One plain sentence saying where the section appears on the public page (L2-REQ-119 AC4). */
  placement: string;
  /** The id of the public section the preview scrolls to. */
  anchor: string;
  /** Where the section's values sit in the site content, for example `header`; a home page section lives in `home.sections` by its kind (L2-REQ-122). */
  path?: string;
  fields: ContentField[];
  /** For a section whose items come from another screen (L2-REQ-124). */
  linked?: LinkedSectionKind;
}
