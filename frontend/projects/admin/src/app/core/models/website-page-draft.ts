import type { PageBlock } from './page-block';

/** The page as the editor holds it; the API derives the slug from the title (L2-REQ-123). */
export interface WebsitePageDraft {
  title: string;
  heroImageUrl: string;
  /** The hero photo's description, needed when there is a photo (L2-REQ-097). */
  heroImageAlt: string;
  published: boolean;
  sections: PageBlock[];
}
