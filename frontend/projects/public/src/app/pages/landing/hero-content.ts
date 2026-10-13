import type { LandingPhoto } from './landing-photo';

/** The hero block. `title` and `subtitle` come from the `Hero` CMS content when published. */
export interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  photo: LandingPhoto;
  badge: string;
}
