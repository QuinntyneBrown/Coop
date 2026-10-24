import type { HomeSectionBase } from './home-section-base';
import type { SiteLink } from './site-link';
import type { SitePhoto } from './site-photo';

/** The home page hero. */
export interface HeroContent extends HomeSectionBase<'hero'> {
  eyebrow: string;
  title: string;
  lead: string;
  badge: string;
  primaryAction: SiteLink;
  secondaryAction: SiteLink;
  photo: SitePhoto;
}
