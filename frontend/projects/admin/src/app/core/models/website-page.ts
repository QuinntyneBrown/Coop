import type { PageBlock } from './page-block';

/** A website page as the API returns it (`GET /pages`, L2-REQ-123). */
export interface WebsitePage {
  pageId: string;
  title: string;
  slug: string;
  heroImageUrl: string | null;
  heroImageAlt?: string | null;
  /** The body blocks in order. */
  sections: PageBlock[];
  /** True when visitors can see the page in the menu and open it. */
  published: boolean;
}
