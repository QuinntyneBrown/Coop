import { type Locator, type Page, expect } from '@playwright/test';
import { LandingPage } from '../public/landing.page';

/** The public app the Playwright config serves beside the admin app. */
const PUBLIC_APP_URL = 'http://localhost:4201/';

/**
 * The admin "Website" screen (`/website`), drawn in
 * docs/mocks/pages/admin-website/ with the block editor in
 * dialogs/admin-content-editor/ and the photo picker in
 * dialogs/admin-photo-picker/. Owns every selector; tests only state intent.
 */
export class WebsitePage {
  readonly page: Page;

  readonly title: Locator;
  readonly blocks: Locator;
  readonly loading: Locator;
  readonly error: Locator;
  readonly retryButton: Locator;
  readonly notice: Locator;

  readonly editor: Locator;
  readonly editorHeading: Locator;
  readonly editorErrors: Locator;
  readonly editorFailed: Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator;

  readonly picker: Locator;
  readonly pickerOptions: Locator;
  readonly pickerEmpty: Locator;
  readonly pickerUpload: Locator;
  readonly pickerUploadError: Locator;
  readonly pickerCancel: Locator;

  constructor(page: Page) {
    this.page = page;

    this.title = page.getByTestId('website-title');
    this.blocks = page.getByTestId('website-block');
    this.loading = page.getByTestId('website-loading');
    this.error = page.getByTestId('website-error');
    this.retryButton = page.getByTestId('website-retry');
    this.notice = page.getByTestId('website-notice');

    this.editor = page.getByTestId('content-editor');
    this.editorHeading = page.getByTestId('content-editor-heading');
    this.editorErrors = page.getByTestId('content-editor-errors');
    this.editorFailed = page.getByTestId('content-editor-failed');
    this.cancelButton = page.getByTestId('content-editor-cancel');
    this.saveButton = page.getByTestId('content-editor-save');

    this.picker = page.getByTestId('photo-picker');
    this.pickerOptions = this.picker.getByTestId('photo-option');
    this.pickerEmpty = this.picker.getByTestId('photo-picker-empty');
    this.pickerUpload = this.picker.getByLabel('Upload a new photo');
    this.pickerUploadError = this.picker.getByTestId('photo-picker-upload-error');
    this.pickerCancel = this.picker.getByTestId('photo-picker-cancel');
  }

  async goto() {
    await this.page.goto('/website');
    await this.page.waitForLoadState('networkidle');
  }

  async expectPageLoaded() {
    await expect(this.title).toHaveText('Website');
    await expect(this.blocks.first()).toBeVisible();
  }

  block(name: string): Locator {
    return this.blocks.filter({ has: this.page.getByRole('heading', { name, exact: true }) });
  }

  group(name: string): Locator {
    return this.page.getByRole('region', { name });
  }

  editButton(block: string): Locator {
    return this.page.getByRole('button', { name: `Edit ${block}`, exact: true });
  }

  async openEditor(block: string) {
    await this.editButton(block).click();
    await expect(this.editor).toBeVisible();
  }

  /** A field in the open editor by its label; inside a list item or fieldset when given. */
  field(label: string, within?: string): Locator {
    const scope = within
      ? this.editor.getByRole('group', { name: within, exact: true })
      : this.editor;
    return scope.getByLabel(label, { exact: true });
  }

  /** The inline error under a field in the open editor. */
  fieldError(label: string, within?: string): Locator {
    return this.field(label, within)
      .locator('xpath=ancestor::div[contains(@class,"form-group")][1]')
      .getByTestId('field-error');
  }

  itemButton(name: string): Locator {
    return this.editor.getByRole('button', { name, exact: true });
  }

  async save() {
    await this.saveButton.click();
  }

  async openPicker(photoGroup = 'Photo') {
    await this.editor
      .getByRole('group', { name: photoGroup, exact: true })
      .getByRole('button', { name: 'Choose photo' })
      .click();
    await expect(this.picker).toBeVisible();
  }

  pickerOption(name: string): Locator {
    return this.pickerOptions.filter({ hasText: name });
  }

  async uploadPhoto(name: string, contents: Buffer, mimeType = 'image/png') {
    await this.pickerUpload.setInputFiles({ name, mimeType, buffer: contents });
  }

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
