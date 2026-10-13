/** The fields of the page editor; the API derives the slug from the title. */
export interface WebsitePageDraft {
  title: string;
  heroImageUrl: string;
  body: string;
}
