// Acceptance Test
// Traces to: L2-REQ-123, L2-REQ-080, L2-REQ-097, L2-REQ-119
// Description: The office edits a website page on the page editor: the Page
// banner fixed first with the title, photo, address link and the "Show this
// page in the website menu" choice; body blocks added, moved and removed and
// named by kind and text; Save page sends the whole page and the public page
// follows; a new page starts out of the menu; the rules for the title, the
// photo description and each block; a duplicate title; a failed save; the
// Existing content block; the remove dialog; and the preview pane at the
// page's address.

import { test, expect } from "../../fixtures/admin/api.fixture";
import type { MockApi } from "../../fixtures/mock-api/mock-api";
import { PageEditorPage } from "../../pages/admin/page-editor.page";
import { WebsitePage } from "../../pages/admin/website.page";

function page(mockApi: MockApi, slug: string) {
  return mockApi.store.pages.find((p) => p.slug === slug)!;
}

test.describe("Website pages", () => {
  let editor: PageEditorPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    editor = new PageEditorPage(authenticatedPage);
  });

  test("opens a page from the site tree with the banner first and the blocks named by kind and text", async ({
    authenticatedPage,
    mockApi,
  }) => {
    const website = new WebsitePage(authenticatedPage);
    await website.goto();
    await website.treeLink("How to apply").click();

    await editor.expectLoaded("How to apply");
    await expect(authenticatedPage).toHaveTitle(
      "How to apply · OWN Housing Co-op Office",
    );
    expect(await editor.sectionNames()).toEqual([
      "Page banner",
      "Paragraph: Membership is open to women aged 55 and…",
      "Heading: Who can apply",
      "Bullet list",
      "Heading: What happens next",
      "Paragraph: Send the form to the office, then come…",
      "Photo",
      "Link button: Send us a note",
    ]);
    await expect(editor.sectionHeading).toHaveText("Page banner");
    await expect(editor.placement).toHaveText(
      "Appears at the top of the page: the title and the photo under it.",
    );
    await expect(editor.pageTitleInput).toHaveValue("How to apply");
    await expect(editor.pageAddress).toHaveText(/\/pages\/how-to-apply/);
    await expect(editor.pageAddress).toHaveAttribute(
      "href",
      "http://localhost:4201/pages/how-to-apply",
    );
    await expect(editor.pagePublished).toBeChecked();
    await expect(editor.pageUnpublished).toHaveCount(0);
    await expect(editor.hideButton).toHaveCount(0);
    await expect(editor.moveUpButton).toBeDisabled();
    await expect(editor.removeBlockButton).toBeDisabled();
    await expect(editor.previewFrame).toHaveAttribute(
      "src",
      /^http:\/\/localhost:4201\/pages\/how-to-apply\?preview=/,
    );
    expect(page(mockApi, "how-to-apply").published).toBe(true);
  });

  test("adds a heading and a paragraph, saves the page and the public page shows them in order", async ({
    mockApi,
  }) => {
    const { pageId, slug } = page(mockApi, "how-to-apply");
    await editor.gotoPage(pageId);
    await editor.expectLoaded("How to apply");

    await editor.addBlockButton("heading").click();
    await expect(editor.sectionHeading).toHaveText("Heading");
    await expect(editor.placement).toHaveText(
      "Appears in the page body, in this order.",
    );
    await editor.field("Heading").fill("Visiting us");
    await editor.addBlockButton("paragraph").click();
    await editor.field("Paragraph").fill("Ring the bell at the front door.");
    expect(await editor.sectionNames()).toContain("Heading: Visiting us");
    await editor.save();

    await expect(editor.notice).toHaveText(
      "“How to apply” is saved. Visitors can open it from the menu.",
    );
    const saved = page(mockApi, slug).sections;
    expect(saved.slice(-2)).toEqual([
      { kind: "heading", text: "Visiting us" },
      { kind: "paragraph", text: "Ring the bell at the front door." },
    ]);
    const publicPage = await editor.openPublicPage(slug);
    await expect(
      publicPage.body.getByRole("heading", { name: "Visiting us" }),
    ).toBeVisible();
    await expect(
      publicPage.body.getByText("Ring the bell at the front door."),
    ).toBeVisible();
  });

  test("moves and removes blocks in the page held by the editor until it is saved", async ({
    mockApi,
  }) => {
    const { pageId, slug } = page(mockApi, "how-to-apply");
    await editor.gotoPage(pageId);
    await editor.selectSection("Heading: Who can apply");

    await editor.moveUpButton.click();
    await expect(editor.toolsStatus).toHaveText(
      "“Heading: Who can apply” moved up to position 1.",
    );
    expect((await editor.sectionNames()).slice(0, 3)).toEqual([
      "Page banner",
      "Heading: Who can apply",
      "Paragraph: Membership is open to women aged 55 and…",
    ]);
    await expect(editor.moveUpButton).toBeDisabled();
    await expect(editor.moveUpButton).not.toBeFocused();
    await expect(editor.moveDownButton).toBeFocused();

    await editor.selectSection("Photo");
    await editor.removeBlockButton.click();
    await expect(editor.toolsStatus).toContainText(
      "“Photo” was removed from the page.",
    );
    expect(await editor.sectionNames()).not.toContain("Photo");
    expect(page(mockApi, slug).sections.some((s) => s.kind === "photo")).toBe(
      true,
    );

    await editor.save();
    await expect(editor.notice).toBeVisible();
    const kinds = page(mockApi, slug).sections.map((s) => s.kind);
    expect(kinds).toEqual([
      "heading",
      "paragraph",
      "bullets",
      "heading",
      "paragraph",
      "link",
    ]);
  });

  test("a new page needs a title, starts out of the menu and gets its address from the title", async ({
    authenticatedPage,
    mockApi,
  }) => {
    await editor.gotoNewPage();
    await editor.expectLoaded("Add a page");
    await expect(editor.pageAddressNote).toHaveText(
      "The page address comes from the title, for example /pages/our-history.",
    );
    await expect(editor.pagePublished).not.toBeChecked();
    await expect(editor.pageUnpublished).toContainText(
      "Not in the website menu yet.",
    );
    await expect(editor.saveButton).toHaveText("Create page");

    await editor.save();
    await expect(editor.formErrors).toContainText("Give the page a title");
    await expect(editor.formErrors).toBeFocused();

    await editor.pageTitleInput.fill("Our history");
    await editor.addBlockButton("bullets").click();
    await editor
      .field("Bullet list (one item per line)")
      .fill("Opened in 1997\nRun by members");
    await editor.save();

    await expect(editor.notice).toHaveText(
      "“Our history” is saved. It is not in the website menu yet.",
    );
    const created = page(mockApi, "our-history");
    expect(created.published).toBe(false);
    expect(created.sections).toEqual([
      { kind: "bullets", items: ["Opened in 1997", "Run by members"] },
    ]);
    await expect(authenticatedPage).toHaveURL(
      new RegExp(`/website/pages/${created.pageId}$`),
    );
    await expect(editor.pageAddress).toHaveText(/\/pages\/our-history/);
    await expect(editor.saveButton).toHaveText("Save page");

    const publicPage = await editor.openPublicPage("our-history");
    await expect(publicPage.notFound).toBeVisible();
    await expect(publicPage.navPageLink("Our history")).toHaveCount(0);
  });

  test("ticking Show this page in the website menu puts the page in the public menu", async ({
    mockApi,
  }) => {
    const draft = mockApi.createPage({
      title: "Our garden",
      sections: [{ kind: "paragraph", text: "Tomatoes in August." }],
      published: false,
    });
    await editor.gotoPage(draft.pageId);
    await expect(editor.pageUnpublished).toBeVisible();

    await editor.pagePublished.check();
    await editor.save();

    await expect(editor.notice).toContainText(
      "Visitors can open it from the menu.",
    );
    await expect(editor.pageUnpublished).toHaveCount(0);
    expect(page(mockApi, "our-garden").published).toBe(true);
    const publicPage = await editor.openPublicPage("our-garden");
    await publicPage.expectPage("Our garden");
    await expect(publicPage.navPageLink("Our garden")).toBeVisible();
  });

  test("names the empty blocks and the photo without a description before saving", async ({
    mockApi,
  }) => {
    const { pageId } = page(mockApi, "how-to-apply");
    await editor.gotoPage(pageId);
    await editor.addBlockButton("heading").click();
    await editor.selectSection("Page banner");
    await editor.pageHeroAlt.fill("");

    await editor.save();

    await expect(editor.formErrors).toContainText(
      "Describe this photo for people who cannot see it",
    );
    await expect(editor.formErrors).toContainText("Heading: Fill in “Heading”");
    expect(page(mockApi, "how-to-apply").heroImageAlt).not.toBe("");
  });

  test("refuses a title another page already has and explains a failed save", async ({
    mockApi,
  }) => {
    mockApi.createPage({ title: "Our garden", sections: [] });
    const { pageId } = page(mockApi, "how-to-apply");
    await editor.gotoPage(pageId);

    await editor.pageTitleInput.fill("Our garden");
    await editor.save();
    await expect(editor.formErrors).toContainText(
      "A page with this title already exists.",
    );

    mockApi.failing.add("PUT pages");
    await editor.pageTitleInput.fill("How to apply");
    await editor.save();
    await expect(editor.formFailed).toHaveText(
      "We couldn't save your changes. Try again.",
    );
    await expect(editor.pageTitleInput).toHaveValue("How to apply");
  });

  test("keeps the words of a page written before blocks as Existing content", async ({
    mockApi,
  }) => {
    const old = mockApi.createPage({
      title: "Written before",
      body: "<h2>Then</h2><p>Words.</p>",
    });
    await editor.gotoPage(old.pageId);

    await editor.selectSection("Existing content");

    await expect(editor.field("Existing content")).toHaveValue(
      "<h2>Then</h2><p>Words.</p>",
    );
    await expect(editor.formPane).toContainText(
      "This is the page as it was written before, as simple HTML. Replace it with headings, paragraphs and photos over time.",
    );
    await editor.field("Existing content").fill("<p>Rewritten words.</p>");
    await editor.save();
    await expect(editor.notice).toBeVisible();
    expect(page(mockApi, "written-before").sections).toEqual([
      { kind: "html", html: "<p>Rewritten words.</p>" },
    ]);
  });

  test("chooses and removes the banner photo", async ({ mockApi }) => {
    const asset = mockApi.createAsset({
      fileName: "lobby.png",
      contentType: "image/png",
      size: 68,
    });
    const plain = mockApi.createPage({ title: "Our lobby", sections: [] });
    await editor.gotoPage(plain.pageId);
    await expect(editor.pageHeroName).toHaveText("No photo chosen yet");
    await expect(editor.pageHeroRemove).toHaveCount(0);

    await editor.pageHeroChoose.click();
    await expect(editor.picker).toBeVisible();
    await editor.pickerOption("lobby.png").click();
    await expect(editor.pageHeroName).toHaveText(/Current photo/);
    await expect(editor.pageHeroAlt).toBeFocused();
    await editor.pageHeroAlt.fill("The front lobby.");
    await editor.save();
    await expect(editor.notice).toBeVisible();
    expect(page(mockApi, "our-lobby").heroImageUrl).toBe(
      `http://localhost:5000/api/digitalasset/serve/${asset.digitalAssetId}`,
    );

    await editor.pageHeroRemove.click();
    await expect(editor.pageHeroName).toHaveText("No photo chosen yet");
    await editor.save();
    await expect(editor.notice).toBeVisible();
    expect(page(mockApi, "our-lobby").heroImageUrl).toBeNull();
  });

  test("Remove page asks first, then returns to the Website area without the page", async ({
    authenticatedPage,
    mockApi,
  }) => {
    const { pageId } = page(mockApi, "how-to-apply");
    await editor.gotoPage(pageId);

    await editor.removePageButton.click();
    await expect(editor.removeDialog).toBeVisible();
    await expect(editor.removeDialog.getByRole("heading")).toHaveText(
      "Remove “How to apply”?",
    );
    await expect(editor.removeCancel).toBeFocused();
    await editor.removeCancel.click();
    await expect(editor.removeDialog).toBeHidden();
    expect(mockApi.store.pages).toHaveLength(1);

    await editor.removePageButton.click();
    await editor.removeConfirm.click();

    await expect(authenticatedPage).toHaveURL(/\/website$/);
    expect(mockApi.store.pages).toHaveLength(0);
    const website = new WebsitePage(authenticatedPage);
    await expect(website.pageLinks).toHaveCount(0);
  });

  test("fits a 320 px viewport as tabs", async ({
    authenticatedPage,
    mockApi,
  }) => {
    await authenticatedPage.setViewportSize({ width: 320, height: 800 });
    await editor.gotoPage(page(mockApi, "how-to-apply").pageId);
    await editor.expectLoaded("How to apply");
    expect(await editor.hasHorizontalScroll()).toBe(false);
    await expect(editor.tabEdit).toHaveAttribute("aria-selected", "true");
  });
});
