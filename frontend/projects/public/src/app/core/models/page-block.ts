import type { SiteLink } from '../site-content/site-link';
import type { SitePhoto } from '../site-content/site-photo';

/** One block of a website page's body, told apart by its `kind` (L2-REQ-123). */
export type PageBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'bullets'; items: string[] }
  | { kind: 'photo'; photo: SitePhoto }
  | ({ kind: 'link' } & SiteLink)
  | { kind: 'html'; html: string };
