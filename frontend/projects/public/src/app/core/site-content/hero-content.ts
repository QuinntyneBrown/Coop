import type { SiteLink } from './site-link';
import type { SitePhoto } from './site-photo';

/** The home page hero. */
export interface HeroContent {
  eyebrow: string;
  title: string;
  lead: string;
  badge: string;
  primaryAction: SiteLink;
  secondaryAction: SiteLink;
  photo: SitePhoto;
}
