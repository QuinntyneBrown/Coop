// Acceptance Test
// Traces to: L2-REQ-121, L2-REQ-125, L2-REQ-128
// Description: The publish bar on the Website screens says whether there are
// unpublished changes; a save in the page editor writes the draft and leaves
// the public website unchanged until the office publishes through the
// "Publish your changes?" dialog; "Discard changes" drops the draft and the
// editor reloads the published content; failures keep the draft and say so;
// the preview pane and "Preview site" open the public site with a preview
// token at the section being edited.

import { test, expect } from "../../fixtures/admin/api.fixture";
import { PageEditorPage } from "../../pages/admin/page-editor.page";
import { PublishBarComponent } from "../../pages/admin/publish-bar.component";
import { WebsitePage } from "../../pages/admin/website.page";
import { homeSection } from "../../fixtures/mock-api/home-section";

const PUBLISHED_TITLE = "A home of our own, in the heart of Toronto.";
const PREVIEW_ADDRESS = /^http:\/\/localhost:4201\/\?preview=[^#]+/;

test.describe("Publish bar", () => {
  let editor: PageEditorPage;
  let bar: PublishBarComponent;

  test.beforeEach(async ({ authenticatedPage }) => {
    editor = new PageEditorPage(authenticatedPage);
    bar = new PublishBarComponent(authenticatedPage);
  });

  test("says everything is published when there is no draft, with Preview site opening the public site", async ({
    authenticatedPage,
  }) => {
    const website = new WebsitePage(authenticatedPage);
    await website.goto();
    await website.expectPageLoaded();
    await bar.expectPublished();
    await expect(bar.bar).toHaveAttribute("role", "status");
    await expect(bar.previewLink).toHaveAttribute("href", PREVIEW_ADDRESS);
    await expect(bar.previewLink).toHaveAttribute("target", "_blank");
  });

  test("a save goes to the draft: the bar changes, visitors still see the published title", async () => {
    await editor.gotoHome();
    await editor.expectLoaded();
    await bar.expectPublished();

    await editor.field("Title").fill("Come home to the co-op.");
    await editor.save();

    await expect(editor.notice).toHaveText(
      "Saved to your draft. Publish when you are ready for visitors to see it.",
    );
    await bar.expectChanges();
    const publicSite = await editor.openPublicHomePage();
    await expect(publicSite.heroTitle).toHaveText(PUBLISHED_TITLE);
  });

  test("the office edits the draft when one exists", async ({ mockApi }) => {
    mockApi.saveDraft((content) => {
      homeSection(content, "hero").title = "Only in the draft.";
    });
    await editor.gotoHome();
    await editor.expectLoaded();
    await bar.expectChanges();
    await expect(editor.field("Title")).toHaveValue("Only in the draft.");
  });

  test("Publish asks first, then puts the draft on the website", async () => {
    await editor.gotoHome();
    await editor.field("Title").fill("Come home to the co-op.");
    await editor.save();
    await bar.expectChanges();

    await bar.openPublish();
    await expect(bar.publishDialog).toHaveAttribute("role", "alertdialog");
    await expect(bar.publishDialog.getByRole("heading")).toHaveText(
      "Publish your changes?",
    );
    await expect(bar.publishCancel).toBeFocused();
    await bar.publishConfirm.click();

    await expect(bar.publishDialog).toBeHidden();
    await expect(bar.notice).toHaveText("Your changes are now on the website.");
    await bar.expectPublished();
    const publicSite = await editor.openPublicHomePage();
    await expect(publicSite.heroTitle).toHaveText("Come home to the co-op.");
  });

  test("a failed publish keeps the draft and says so in the dialog", async ({
    mockApi,
  }) => {
    await editor.gotoHome();
    await editor.field("Title").fill("Come home to the co-op.");
    await editor.save();
    mockApi.failing.add("POST site-content/publish");

    await bar.openPublish();
    await bar.publishConfirm.click();

    await expect(bar.publishError).toHaveText(
      "We couldn't publish your changes. Your draft is safe. Try again.",
    );
    await expect(bar.publishDialog).toBeVisible();
    await bar.publishCancel.click();
    await bar.expectChanges();
    await expect(editor.field("Title")).toHaveValue("Come home to the co-op.");
  });

  test("Discard changes asks first, then the editor shows the published content again", async () => {
    await editor.gotoHome();
    await editor.field("Title").fill("Come home to the co-op.");
    await editor.save();
    await bar.expectChanges();

    await bar.openDiscard();
    await expect(bar.discardDialog.getByRole("heading")).toHaveText(
      "Discard your unpublished changes?",
    );
    await expect(bar.discardCancel).toBeFocused();
    await bar.discardConfirm.click();

    await expect(bar.discardDialog).toBeHidden();
    await expect(bar.notice).toHaveText(
      "Your unpublished changes were discarded. The website is unchanged.",
    );
    await bar.expectPublished();
    await expect(editor.field("Title")).toHaveValue(PUBLISHED_TITLE);
  });

  test("a failed discard keeps the draft and says so in the dialog", async ({
    mockApi,
  }) => {
    await editor.gotoHome();
    await editor.field("Title").fill("Come home to the co-op.");
    await editor.save();
    mockApi.failing.add("DELETE site-content/draft");

    await bar.openDiscard();
    await bar.discardConfirm.click();

    await expect(bar.discardError).toHaveText(
      "We couldn't discard your changes. Try again.",
    );
    await bar.discardCancel.click();
    await bar.expectChanges();
  });

  test.describe("Preview pane", () => {
    test("shows the public site with a preview token at the section being edited", async ({
      authenticatedPage,
    }) => {
      await authenticatedPage.setViewportSize({ width: 1280, height: 900 });
      await editor.gotoHome();
      await editor.expectLoaded();

      await expect(editor.previewFrame).toHaveAttribute("src", PREVIEW_ADDRESS);
      await expect(editor.previewFrame).toHaveAttribute("src", /#top$/);
      await expect(editor.previewOpenLink).toHaveAttribute("href", /#top$/);
      await expect(editor.previewOpenLink).toHaveAttribute("target", "_blank");

      await editor.selectSection("Who we are");
      await expect(editor.previewFrame).toHaveAttribute("src", /#about$/);
      await expect(editor.previewOpenLink).toHaveAttribute("href", /#about$/);
      await expect(bar.previewLink).toHaveAttribute("href", PREVIEW_ADDRESS);
    });

    test("the frame renders the draft with the preview banner", async ({
      authenticatedPage,
    }) => {
      await authenticatedPage.setViewportSize({ width: 1280, height: 900 });
      await editor.gotoHome();
      await editor.field("Title").fill("Come home to the co-op.");
      await editor.save();

      const frame = authenticatedPage.frameLocator(
        '[data-testid="editor-preview"] iframe',
      );
      await expect(frame.getByTestId("landing-hero-title")).toHaveText(
        "Come home to the co-op.",
      );
      await expect(frame.getByTestId("preview-banner")).toContainText(
        "Preview.",
      );
    });
  });
});
