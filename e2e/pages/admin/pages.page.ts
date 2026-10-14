import { type Locator, type Page, expect } from '@playwright/test';

/**
 * The admin "Pages" screen (`/pages`), drawn in docs/mocks/pages/admin-pages/
 * with its dialogs in dialogs/admin-page-editor/ and dialogs/admin-page-remove/.
 * Owns every selector; tests only state intent.
 */
export class PagesPage {
  readonly page: Page;

  readonly title: Locator;
  readonly newPageButton: Locator;
  readonly list: Locator;
  readonly cards: Locator;
  readonly empty: Locator;
  readonly error: Locator;
  readonly retryButton: Locator;
  readonly loading: Locator;
  readonly notice: Locator;

  readonly editor: Locator;
  readonly editorHeading: Locator;
  readonly titleInput: Locator;
  readonly heroInput: Locator;
  readonly heroAltInput: Locator;
  readonly heroAltError: Locator;
  readonly bodyInput: Locator;
  readonly editorErrors: Locator;
  readonly titleError: Locator;
  readonly bodyError: Locator;
  readonly editorFailed: Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator;

  readonly removeDialog: Locator;
  readonly removeHeading: Locator;
  readonly removeCancelButton: Locator;
  readonly removeConfirmButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.title = page.getByTestId('pages-title');
    this.newPageButton = page.getByTestId('pages-new-button');
    this.list = page.getByTestId('pages-list');
    this.cards = page.getByTestId('page-card');
    this.empty = page.getByTestId('pages-empty');
    this.error = page.getByTestId('pages-error');
    this.retryButton = page.getByTestId('pages-retry');
    this.loading = page.getByTestId('pages-loading');
    this.notice = page.getByTestId('pages-notice');

    this.editor = page.getByTestId('page-editor');
    this.editorHeading = page.getByTestId('page-editor-heading');
    this.titleInput = page.getByTestId('page-title-input');
    this.heroInput = page.getByTestId('page-hero-input');
    this.heroAltInput = page.getByTestId('page-hero-alt-input');
    this.heroAltError = page.getByTestId('page-hero-alt-error');
    this.bodyInput = page.getByTestId('page-body-input');
    this.editorErrors = page.getByTestId('page-editor-errors');
    this.titleError = page.getByTestId('page-title-error');
    this.bodyError = page.getByTestId('page-body-error');
    this.editorFailed = page.getByTestId('page-editor-failed');
    this.cancelButton = page.getByTestId('page-editor-cancel');
    this.saveButton = page.getByTestId('page-editor-save');

    this.removeDialog = page.getByTestId('page-remove-dialog');
    this.removeHeading = page.getByTestId('page-remove-heading');
    this.removeCancelButton = page.getByTestId('page-remove-cancel');
    this.removeConfirmButton = page.getByTestId('page-remove-confirm');
  }

  async goto() {
    await this.page.goto('/pages');
    await this.page.waitForLoadState('networkidle');
  }

  async expectPageLoaded() {
    await expect(this.title).toHaveText('Pages');
    await expect(this.newPageButton).toBeVisible();
  }

  card(title: string): Locator {
    return this.cards.filter({ has: this.page.getByTestId('page-card-title').getByText(title, { exact: true }) });
  }

  cardAddress(title: string): Locator {
    return this.card(title).getByTestId('page-card-address');
  }

  async openEditor() {
    await this.newPageButton.click();
    await expect(this.editor).toBeVisible();
  }

  async openEditorFor(title: string) {
    await this.card(title).getByTestId('page-card-edit').click();
    await expect(this.editor).toBeVisible();
  }

  async fillEditor(fields: { title?: string; hero?: string; heroAlt?: string; body?: string }) {
    if (fields.title !== undefined) await this.titleInput.fill(fields.title);
    if (fields.hero !== undefined) await this.heroInput.fill(fields.hero);
    if (fields.heroAlt !== undefined) await this.heroAltInput.fill(fields.heroAlt);
    if (fields.body !== undefined) await this.bodyInput.fill(fields.body);
  }

  async save() {
    await this.saveButton.click();
  }

  async openRemoveFor(title: string) {
    await this.card(title).getByTestId('page-card-remove').click();
    await expect(this.removeDialog).toBeVisible();
  }

  /** True when the document is wider than the viewport, i.e. horizontal scrolling is possible. */
  async hasHorizontalScroll(): Promise<boolean> {
    return this.page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
  }
}
