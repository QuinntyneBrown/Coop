/**
 * The URL slug the API derives from a page title (Page.SlugFrom in the
 * backend), used here only to warn about a duplicate title before posting.
 */
export function pageSlug(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}
