import type { HomeSectionBase } from './home-section-base';
import type { SitePhoto } from './site-photo';

/** The "A word from a member" block. */
export interface QuoteContent extends HomeSectionBase<'quote'> {
  text: string;
  attribution: string;
  photo: SitePhoto;
}
