import type { HomeSection } from './home-section';

/** The home page sections in the order visitors see them (L2-REQ-122). */
export interface HomeContent {
  sections: HomeSection[];
}
