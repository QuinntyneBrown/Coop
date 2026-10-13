/** A website page from `GET api/pages` (L2-REQ-083). */
export interface WebsitePage {
  pageId: string;
  title: string;
  slug: string;
  heroImageUrl: string | null;
  body: string;
}
