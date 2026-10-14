import type { HeroContent } from './hero-content';
import type { GlanceContent } from './glance-content';
import type { AboutContent } from './about-content';
import type { GalleryContent } from './gallery-content';
import type { FeaturesContent } from './features-content';
import type { NoticesContent } from './notices-content';
import type { SectionHead } from './section-head';
import type { QuoteContent } from './quote-content';
import type { VisitContent } from './visit-content';

/** The home page blocks, in page order. */
export interface HomeContent {
  hero: HeroContent;
  glance: GlanceContent;
  about: AboutContent;
  gallery: GalleryContent;
  features: FeaturesContent;
  notices: NoticesContent;
  board: SectionHead;
  quote: QuoteContent;
  visit: VisitContent;
}
