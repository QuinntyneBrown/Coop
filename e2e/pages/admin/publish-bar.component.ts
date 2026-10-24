import { type Locator, type Page, expect } from "@playwright/test";

/**
 * The publish bar on the Website screens and its two dialogs, drawn in
 * docs/mocks/pages/admin-website/ and docs/mocks/dialogs/admin-publish-confirm/
 * and admin-discard-confirm/. Owns every selector; tests only state intent.
 */
export class PublishBarComponent {
  readonly page: Page;

  readonly bar: Locator;
  readonly text: Locator;
  readonly previewLink: Locator;
  readonly publishButton: Locator;
  readonly discardButton: Locator;
  readonly notice: Locator;

  readonly publishDialog: Locator;
  readonly publishConfirm: Locator;
  readonly publishCancel: Locator;
  readonly publishError: Locator;

  readonly discardDialog: Locator;
  readonly discardConfirm: Locator;
  readonly discardCancel: Locator;
  readonly discardError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bar = page.getByTestId("publish-bar");
    this.text = this.bar.getByTestId("publish-bar-text");
    this.previewLink = this.bar.getByRole("link", { name: /Preview site/ });
    this.publishButton = this.bar.getByRole("button", { name: /Publish/ });
    this.discardButton = this.bar.getByRole("button", {
      name: "Discard changes",
    });
    this.notice = page.getByTestId("publish-notice");

    this.publishDialog = page.getByTestId("publish-dialog");
    this.publishConfirm = this.publishDialog.getByRole("button", {
      name: /Publish/,
    });
    this.publishCancel = this.publishDialog.getByRole("button", {
      name: "Cancel",
    });
    this.publishError = this.publishDialog.getByRole("alert");

    this.discardDialog = page.getByTestId("discard-dialog");
    this.discardConfirm = this.discardDialog.getByRole("button", {
      name: /Discard changes/,
    });
    this.discardCancel = this.discardDialog.getByRole("button", {
      name: "Cancel",
    });
    this.discardError = this.discardDialog.getByRole("alert");
  }

  async expectPublished() {
    await expect(this.text).toHaveText(
      "Everything is published. Visitors see what you see.",
    );
    await expect(this.publishButton).toBeDisabled();
    await expect(this.discardButton).toBeDisabled();
  }

  async expectChanges() {
    await expect(this.text).toHaveText(
      "You have unpublished changes. Visitors still see the published website.",
    );
    await expect(this.publishButton).toBeEnabled();
    await expect(this.discardButton).toBeEnabled();
  }

  async openPublish() {
    await this.publishButton.click();
    await expect(this.publishDialog).toBeVisible();
  }

  async openDiscard() {
    await this.discardButton.click();
    await expect(this.discardDialog).toBeVisible();
  }
}
