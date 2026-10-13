import type { WebsitePage } from '../../core/models/website-page';
import type { WebsitePageDraft } from '../../core/models/website-page-draft';
import type { PageFormErrors } from './page-form-errors';
import { pageSlug } from './page-slug';

/**
 * Client-side checks before a save (L2-REQ-080 AC5, AC6). The API applies the
 * same rules and stays authoritative.
 */
export function validatePageDraft(
  draft: WebsitePageDraft,
  pages: WebsitePage[],
  editingPageId: string | null,
): PageFormErrors {
  const errors: PageFormErrors = {};
  const title = draft.title.trim();
  const slug = pageSlug(title);

  if (!title) {
    errors.title = 'Give the page a title';
  } else if (!slug) {
    errors.title = 'The title needs at least one letter or number.';
  } else if (pages.some((page) => page.slug === slug && page.pageId !== editingPageId)) {
    errors.title = `There is already a page called “${title}”. Choose a different title.`;
  }

  if (!draft.body.trim()) {
    errors.body = 'Write something for the page';
  }

  return errors;
}
