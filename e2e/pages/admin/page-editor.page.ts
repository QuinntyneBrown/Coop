import { type Locator, type Page, expect } from "@playwright/test";
import { ContentPage } from "../public/content-page.page";
import { LandingPage } from "../public/landing.page";

/** The public app the Playwright config serves beside the admin app. */
const PUBLIC_APP_URL = "http://localhost:4201/";

/**
 * The admin page editor (`/website/home`, `/website/menu-and-footer`,
 * `/website/pages/{id}`), drawn in docs/mocks/pages/admin-page-editor/ with
 * the photo picker in dialogs/admin-photo-picker/. Owns every selector; tests
 * only state intent.
 */
export class PageEditorPage {
  readonly page: Page;

  readonly title: Locator;
  readonly loading: Locator;
  readonly error: Locator;
  readonly retryButton: Locator;
  readonly notice: Locator;
  readonly editor: Locator;

  readonly sectionsPane: Locator;
  readonly sectionItems: Locator;
  readonly sectionButtons: Locator;
  readonly hideButton: Locator;
  readonly moveUpButton: Locator;
  readonly moveDownButton: Locator;
  readonly toolsStatus: Locator;
  readonly toolsError: Locator;
  readonly removeBlockButton: Locator;

  readonly pageTitleInput: Locator;
  readonly pageAddress: Locator;
  readonly pageAddressNote: Locator;
  readonly pageUnpublished: Locator;
  readonly pagePublished: Locator;
  readonly pageHeroChoose: Locator;
  readonly pageHeroRemove: Locator;
  readonly pageHeroName: Locator;
  readonly pageHeroAlt: Locator;
  readonly removePageButton: Locator;
  readonly removeDialog: Locator;
  readonly removeConfirm: Locator;
  readonly removeCancel: Locator;
  readonly formPane: Locator;
  readonly previewPane: Locator;
  readonly sectionHeading: Locator;
  readonly placement: Locator;
  readonly formErrors: Locator;
  readonly formFailed: Locator;
  readonly saveButton: Locator;
  readonly undoButton: Locator;

  readonly linkedTitle: Locator;
  readonly linkedItems: Locator;
  readonly linkedEmpty: Locator;
  readonly linkedLink: Locator;

  readonly previewFrame: Locator;
  readonly previewOpenLink: Locator;

  readonly tabSections: Locator;
  readonly tabEdit: Locator;
  readonly tabPreview: Locator;

  readonly picker: Locator;
  readonly pickerOptions: Locator;
  readonly pickerEmpty: Locator;
  readonly pickerUpload: Locator;
  readonly pickerUploadError: Locator;
  readonly pickerCancel: Locator;

  constructor(page: Page) {
    this.page = page;

    this.title = page.getByTestId("editor-title");
    this.loading = page.getByTestId("editor-loading");
    this.error = page.getByTestId("editor-error");
    this.retryButton = page.getByTestId("editor-retry");
    this.notice = page.getByTestId("editor-notice");
    this.editor = page.getByTestId("page-editor");

    this.sectionsPane = page.getByTestId("editor-sections");
    this.sectionItems = page.getByTestId("section-item");
    this.sectionButtons = page.getByTestId("section-button");
    this.hideButton = page.getByTestId("section-hide");
    this.moveUpButton = page.getByTestId("section-move-up");
    this.moveDownButton = page.getByTestId("section-move-down");
    this.toolsStatus = page.getByTestId("section-tools-status");
    this.toolsError = page.getByTestId("section-tools-failed");
    this.removeBlockButton = page.getByTestId("section-remove");

    this.pageTitleInput = page.getByTestId("page-title-input");
    this.pageAddress = page.getByTestId("page-address");
    this.pageAddressNote = page.getByTestId("page-address-note");
    this.pageUnpublished = page.getByTestId("page-unpublished");
    this.pagePublished = page.getByTestId("page-published");
    this.pageHeroChoose = page.getByTestId("page-hero-choose");
    this.pageHeroRemove = page.getByTestId("page-hero-remove");
    this.pageHeroName = page.getByTestId("page-hero-name");
    this.pageHeroAlt = page.getByTestId("page-hero-alt-input");
    this.removePageButton = page.getByTestId("page-remove");
    this.removeDialog = page.getByTestId("page-remove-dialog");
    this.removeConfirm = page.getByTestId("page-remove-confirm");
    this.removeCancel = page.getByTestId("page-remove-cancel");
    this.formPane = page.getByTestId("editor-form");
    this.previewPane = page.getByTestId("editor-preview");
    this.sectionHeading = page.getByTestId("section-heading");
    this.placement = page.getByTestId("section-placement");
    this.formErrors = page.getByTestId("section-form-errors");
    this.formFailed = page.getByTestId("section-form-failed");
    this.saveButton = page.getByTestId("section-save");
    this.undoButton = page.getByTestId("section-undo");

    this.linkedTitle = page.getByTestId("linked-summary-title");
    this.linkedItems = page.getByTestId("linked-summary-items").locator("li");
    this.linkedEmpty = page.getByTestId("linked-summary-empty");
    this.linkedLink = page.getByTestId("linked-summary-link");

    this.previewFrame = this.previewPane.locator("iframe");
    this.previewOpenLink = this.previewPane.getByRole("link", {
      name: /Open in a new tab/,
    });

    this.tabSections = page.getByTestId("editor-tab-sections");
    this.tabEdit = page.getByTestId("editor-tab-edit");
    this.tabPreview = page.getByTestId("editor-tab-preview");

    this.picker = page.getByTestId("photo-picker");
    this.pickerOptions = this.picker.getByTestId("photo-option");
    this.pickerEmpty = this.picker.getByTestId("photo-picker-empty");
    this.pickerUpload = this.picker.getByLabel("Upload a new photo");
    this.pickerUploadError = this.picker.getByTestId(
      "photo-picker-upload-error",
    );
    this.pickerCancel = this.picker.getByTestId("photo-picker-cancel");
  }

  async gotoHome() {
    await this.page.goto("/website/home");
    await this.page.waitForLoadState("networkidle");
  }

  async gotoMenu() {
    await this.page.goto("/website/menu-and-footer");
    await this.page.waitForLoadState("networkidle");
  }

  async gotoPage(pageId: string) {
    await this.page.goto(`/website/pages/${pageId}`);
    await this.page.waitForLoadState("networkidle");
  }

  async gotoNewPage() {
    await this.page.goto("/website/pages/new");
    await this.page.waitForLoadState("networkidle");
  }

  /** One of the "Add to the page" buttons. */
  addBlockButton(
    kind: "heading" | "paragraph" | "bullets" | "photo" | "link",
  ): Locator {
    return this.page.getByTestId(`section-add-${kind}`);
  }

  async openPublicPage(slug: string): Promise<ContentPage> {
    const tab = await this.page.context().newPage();
    await tab.goto(`${PUBLIC_APP_URL}pages/${slug}`);
    await tab.waitForLoadState("networkidle");
    return new ContentPage(tab);
  }

  async expectLoaded(title = "Home") {
    await expect(this.title).toHaveText(title);
    await expect(this.editor).toBeVisible();
  }

  sectionButton(name: string): Locator {
    return this.sectionButtons.filter({ hasText: name });
  }

  /** The list row of a section, with its name and any Hidden badge. */
  sectionItem(name: string): Locator {
    return this.sectionItems.filter({ has: this.sectionButton(name) });
  }

  /** The section names in the order the list shows them. */
  async sectionNames(): Promise<string[]> {
    return this.sectionButtons.allInnerTexts();
  }

  async selectSection(name: string) {
    await this.sectionButton(name).click();
    await expect(this.sectionHeading).toHaveText(name);
  }

  /** A field in the form by its label; inside a list item or fieldset when given. */
  field(label: string, within?: string): Locator {
    const scope = within
      ? this.formPane.getByRole("group", { name: within, exact: true })
      : this.formPane;
    // The form itself is labelled by the section heading, so only controls count.
    return scope
      .getByLabel(label, { exact: true })
      .and(scope.locator("input, textarea, select"));
  }

  /** The inline error under a field. */
  fieldError(label: string, within?: string): Locator {
    return this.field(label, within)
      .locator(
        'xpath=ancestor::div[contains(concat(" ", @class, " ")," field ")][1]',
      )
      .getByTestId("field-error");
  }

  itemButton(name: string): Locator {
    return this.formPane.getByRole("button", { name, exact: true });
  }

  async save() {
    await this.saveButton.click();
  }

  async openPicker(photoGroup = "Photo") {
    await this.formPane
      .getByRole("group", { name: photoGroup, exact: true })
      .getByRole("button", { name: "Choose photo" })
      .click();
    await expect(this.picker).toBeVisible();
  }

  pickerOption(name: string): Locator {
    return this.pickerOptions.filter({ hasText: name });
  }

  async uploadPhoto(name: string, contents: Buffer, mimeType = "image/png") {
    await this.pickerUpload.setInputFiles({ name, mimeType, buffer: contents });
  }

  async openPublicHomePage(): Promise<LandingPage> {
    const tab = await this.page.context().newPage();
    await tab.goto(PUBLIC_APP_URL);
    await tab.waitForLoadState("networkidle");
    return new LandingPage(tab);
  }

  /** True when the document is wider than the viewport, i.e. horizontal scrolling is possible. */
  async hasHorizontalScroll(): Promise<boolean> {
    return this.page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
  }
}
