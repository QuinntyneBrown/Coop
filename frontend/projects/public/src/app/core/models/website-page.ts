import type { PageBlock } from './page-block';

/** A website page from `GET api/pages` (L2-REQ-083, L2-REQ-123). */
export interface WebsitePage {
  pageId: string;
  title: string;
  slug: string;
  heroImageUrl: string | null;
  /** The hero photo's description, its alternative text (L2-REQ-097). */
  heroImageAlt?: string | null;
  /** The body blocks in order. */
  sections: PageBlock[];
  /** True when visitors can see the page. */
  published: boolean;
}
