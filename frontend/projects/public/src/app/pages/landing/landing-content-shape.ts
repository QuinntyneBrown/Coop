import type { HeroContent } from './hero-content';
import type { LandingFeature } from './landing-feature';
import type { LandingFooter } from './landing-footer';
import type { LandingLink } from './landing-link';
import type { LandingPhoto } from './landing-photo';
import type { LandingQuote } from './landing-quote';
import type { LandingSectionHead } from './landing-section-head';
import type { LandingStat } from './landing-stat';
import type { LandingValue } from './landing-value';
import type { LandingVisit } from './landing-visit';

/** Every block of the home page, in page order. */
export interface LandingContent {
  siteName: string;
  siteSubtitle: string;
  navigation: LandingLink[];
  hero: HeroContent;
  stats: LandingStat[];
  about: LandingSectionHead;
  values: LandingValue[];
  gallery: LandingSectionHead;
  photos: LandingPhoto[];
  features: LandingFeature[];
  notices: LandingSectionHead;
  noticesEmpty: string;
  board: LandingSectionHead;
  quote: LandingQuote;
  visit: LandingVisit;
  footer: LandingFooter;
}
