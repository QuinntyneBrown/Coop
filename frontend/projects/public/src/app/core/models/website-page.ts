/** A website page from `GET api/pages` (L2-REQ-083). */
export interface WebsitePage {
  pageId: string;
  title: string;
  slug: string;
  heroImageUrl: string | null;
  /** The hero photo's description, its alternative text (L2-REQ-095). */
  heroImageAlt?: string | null;
  body: string;
}
