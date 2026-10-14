import type { SitePhoto } from './site-photo';

/** The "A word from a member" block. */
export interface QuoteContent {
  text: string;
  attribution: string;
  photo: SitePhoto;
}
