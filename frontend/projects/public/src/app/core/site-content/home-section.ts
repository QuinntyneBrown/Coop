import type { AboutContent } from './about-content';
import type { HeroContent } from './hero-content';
import type { GlanceContent } from './glance-content';
import type { GalleryContent } from './gallery-content';
import type { FeaturesContent } from './features-content';
import type { NoticesContent } from './notices-content';
import type { BoardContent } from './board-content';
import type { QuoteContent } from './quote-content';
import type { VisitContent } from './visit-content';

/** One home page section, told apart by its `kind`. */
export type HomeSection =
  | HeroContent
  | GlanceContent
  | AboutContent
  | GalleryContent
  | FeaturesContent
  | NoticesContent
  | BoardContent
  | QuoteContent
  | VisitContent;
