import { type Locator, type Page, expect } from '@playwright/test';
import { LandingPage } from '../public/landing.page';

/** The public app the Playwright config serves beside the admin app. */
const PUBLIC_APP_URL = 'http://localhost:4201/';

/**
 * The admin "Board" screen (`/board`), drawn in docs/mocks/pages/admin-board/
 * with its dialogs in dialogs/admin-director-editor/ and
 * dialogs/admin-director-remove/. Owns every selector; tests only state intent.
 */
export class BoardPage {
  readonly page: Page;

  readonly title: Locator;
  readonly addButton: Locator;
  readonly list: Locator;
  readonly cards: Locator;
  readonly names: Locator;
  readonly empty: Locator;
  readonly error: Locator;
  readonly saveError: Locator;
  readonly retryButton: Locator;
  readonly notice: Locator;

  readonly editor: Locator;
  readonly editorHeading: Locator;
  readonly nameInput: Locator;
  readonly titleInput: Locator;
  readonly photoInput: Locator;
  readonly editorErrors: Locator;
  readonly nameError: Locator;
  readonly titleError: Locator;
  readonly editorFailed: Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator;

  readonly removeDialog: Locator;
  readonly removeHeading: Locator;
  readonly removeCancelButton: Locator;
  readonly removeConfirmButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.title = page.getByTestId('board-title');
    this.addButton = page.getByTestId('board-add-button');
    this.list = page.getByTestId('board-list');
    this.cards = page.getByTestId('director-card');
    this.names = this.cards.getByTestId('director-card-name');
    this.empty = page.getByTestId('board-empty');
    this.error = page.getByTestId('board-error');
    this.saveError = page.getByTestId('board-save-error');
    this.retryButton = page.getByTestId('board-retry');
    this.notice = page.getByTestId('board-notice');

    this.editor = page.getByTestId('director-editor');
    this.editorHeading = page.getByTestId('director-editor-heading');
    this.nameInput = page.getByTestId('director-name-input');
    this.titleInput = page.getByTestId('director-title-input');
    this.photoInput = page.getByTestId('director-photo-input');
    this.editorErrors = page.getByTestId('director-editor-errors');
    this.nameError = page.getByTestId('director-name-error');
    this.titleError = page.getByTestId('director-title-error');
    this.editorFailed = page.getByTestId('director-editor-failed');
    this.cancelButton = page.getByTestId('director-editor-cancel');
    this.saveButton = page.getByTestId('director-editor-save');

    this.removeDialog = page.getByTestId('director-remove-dialog');
    this.removeHeading = page.getByTestId('director-remove-heading');
    this.removeCancelButton = page.getByTestId('director-remove-cancel');
    this.removeConfirmButton = page.getByTestId('director-remove-confirm');
  }

  async goto() {
    await this.page.goto('/board');
    await this.page.waitForLoadState('networkidle');
  }

  async expectPageLoaded() {
    await expect(this.title).toHaveText('Board of Directors');
    await expect(this.addButton).toBeVisible();
  }

  card(name: string): Locator {
    return this.cards.filter({
      has: this.page.getByTestId('director-card-name').getByText(name, { exact: true }),
    });
  }

  cardTitle(name: string): Locator {
    return this.card(name).getByTestId('director-card-title');
  }

  moveUpButton(name: string): Locator {
    return this.card(name).getByTestId('director-move-up');
  }

  moveDownButton(name: string): Locator {
    return this.card(name).getByTestId('director-move-down');
  }

  async openEditor() {
    await this.addButton.click();
    await expect(this.editor).toBeVisible();
  }

  async openEditorFor(name: string) {
    await this.card(name).getByTestId('director-edit').click();
    await expect(this.editor).toBeVisible();
  }

  async fillEditor(fields: { name?: string; title?: string; photo?: string }) {
    if (fields.name !== undefined) await this.nameInput.fill(fields.name);
    if (fields.title !== undefined) await this.titleInput.fill(fields.title);
    if (fields.photo !== undefined) await this.photoInput.fill(fields.photo);
  }

  async save() {
    await this.saveButton.click();
  }

  async openRemoveFor(name: string) {
    await this.card(name).getByTestId('director-remove').click();
    await expect(this.removeDialog).toBeVisible();
  }

  /** Opens the public home page in a new tab of the same browser context (same mock API). */
  async openPublicHomePage(): Promise<LandingPage> {
    const tab = await this.page.context().newPage();
    await tab.goto(PUBLIC_APP_URL);
    await tab.waitForLoadState('networkidle');
    return new LandingPage(tab);
  }

  /** True when the document is wider than the viewport, i.e. horizontal scrolling is possible. */
  async hasHorizontalScroll(): Promise<boolean> {
    return this.page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
  }
}
