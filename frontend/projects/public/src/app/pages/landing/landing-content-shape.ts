import type { HeroContent } from './hero-content';
import type { LandingFeature } from './landing-feature';
import type { LandingPhoto } from './landing-photo';
import type { LandingQuote } from './landing-quote';
import type { LandingSectionHead } from './landing-section-head';
import type { LandingStat } from './landing-stat';
import type { LandingValue } from './landing-value';
import type { LandingVisit } from './landing-visit';

/** Every block of the home page, in page order (header and footer copy is SITE_CONTENT). */
export interface LandingContent {
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
}
