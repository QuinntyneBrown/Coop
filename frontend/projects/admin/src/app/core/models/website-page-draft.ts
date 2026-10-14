/** The fields of the page editor; the API derives the slug from the title. */
export interface WebsitePageDraft {
  title: string;
  heroImageUrl: string;
  /** The hero photo's description, needed when there is a photo (L2-REQ-097). */
  heroImageAlt: string;
  body: string;
}
