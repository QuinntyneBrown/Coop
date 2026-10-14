/** A website page as the API returns it (`GET /pages`). */
export interface WebsitePage {
  pageId: string;
  title: string;
  slug: string;
  heroImageUrl: string | null;
  heroImageAlt?: string | null;
  body: string;
}
