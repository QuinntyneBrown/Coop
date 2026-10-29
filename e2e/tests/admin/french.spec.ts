// Acceptance Test
// Traces to: L2-REQ-130, L2-REQ-129
// Description: The office writes the French text of the public site in the
// page editor: an optional French field below each text, a note that says
// what it does, the French saved in the `fr` object of its own section,
// item or block, empty French left out, French that moves with its item,
// a new photo's French description cleared, a too-long French text refused
// beside its field, and the page banner's French title and description.

import { test, expect } from "../../fixtures/admin/api.fixture";
import type { MockApi } from "../../fixtures/mock-api/mock-api";
import { homeSection } from "../../fixtures/mock-api/home-section";
import { PageEditorPage } from "../../pages/admin/page-editor.page";

/** The site content the office edits: the draft when a save wrote one, else the published copy (L2-REQ-121). */
function draft(mockApi: MockApi): Record<string, any> {
  const entries = mockApi.store.jsonContents;
  return (
    entries.find((j) => j.name === "SiteContentDraft") ??
    entries.find((j) => j.name === "SiteContent")!
  ).content;
}

test.describe("French text", () => {
  let editor: PageEditorPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    editor = new PageEditorPage(authenticatedPage);
  });

  test("shows a French field below each text and saves it with the section", async ({
    mockApi,
  }) => {
    await editor.gotoHome();
    await editor.expectLoaded();

    await expect(editor.frenchNote).toHaveText(
      "Each text has an optional French version. Visitors who choose Français see it; where it is empty they see the English.",
    );
    await expect(editor.field("Title in French")).toHaveAttribute("lang", "fr");
    await expect(editor.field("Label in French", "Main button")).toBeVisible();
    await expect(editor.field("Photo description in French")).toBeVisible();
    await expect(editor.field("Address in French", "Main button")).toHaveCount(0);

    await editor.field("Title in French").fill("  Un chez-soi bien à nous.  ");
    await editor.field("Label in French", "Main button").fill("Réservez une visite");
    await editor.save();

    await expect(editor.notice).toBeVisible();
    const hero = homeSection(draft(mockApi), "hero");
    expect(hero.fr).toEqual({ title: "Un chez-soi bien à nous." });
    expect(hero.primaryAction.fr).toEqual({ label: "Réservez une visite" });
    expect(hero.secondaryAction.fr).toBeUndefined();
    expect(hero.photo.fr).toBeUndefined();

    await editor.gotoHome();
    await expect(editor.field("Title in French")).toHaveValue(
      "Un chez-soi bien à nous.",
    );
  });

  test("keeps each menu link's French with it when the link moves", async ({
    mockApi,
  }) => {
    await editor.gotoMenu();
    await editor.expectLoaded("Menu and footer");

    await editor.field("Label in French", "Menu link 1").fill("Accueil");
    await editor.itemButton("Move menu link 1 down").click();
    await editor.save();

    await expect(editor.notice).toBeVisible();
    const links = draft(mockApi).header.menuLinks;
    expect(links[1]).toMatchObject({ label: "Home", fr: { label: "Accueil" } });
    expect(links[0].fr).toBeUndefined();
  });

  test("clears the French photo description with the English one when a new photo is chosen", async ({
    mockApi,
  }) => {
    mockApi.createAsset({
      fileName: "garden-party.png",
      contentType: "image/png",
      size: 68,
    });
    await editor.gotoHome();
    await editor
      .field("Photo description in French")
      .fill("Des membres dans le jardin.");

    await editor.openPicker();
    await editor.pickerOption("garden-party.png").click();

    await expect(editor.field("Photo description")).toHaveValue("");
    await expect(editor.field("Photo description in French")).toHaveValue("");
  });

  test("refuses a French text longer than its field allows, beside the French field", async ({
    mockApi,
  }) => {
    await editor.gotoHome();

    await editor
      .field("Label in French", "Main button")
      .fill("a".repeat(101));
    await editor.save();

    await expect(
      editor.fieldError("Label in French", "Main button"),
    ).toHaveText("Keep “Label in French” under 100 characters");
    await expect(editor.formErrors).toBeFocused();
    expect(
      mockApi.store.jsonContents.some((j) => j.name === "SiteContentDraft"),
    ).toBe(false);
  });

  test("saves a website page's French title, photo description and block text", async ({
    mockApi,
  }) => {
    const created = mockApi.createPage({
      title: "Our garden",
      heroImageUrl: "/own/garden.svg",
      heroImageAlt: "The rooftop garden.",
      sections: [{ kind: "heading", text: "Tomatoes in August" }],
    });
    await editor.gotoPage(created.pageId);
    await editor.expectLoaded("Our garden");

    await editor.field("Page title in French").fill("Notre jardin");
    await editor
      .field("Photo description in French")
      .fill("Le jardin sur le toit.");
    await editor.selectSection("Heading: Tomatoes in August");
    await editor.field("Heading in French").fill("Des tomates en août");
    await editor.save();

    await expect(editor.notice).toHaveText(
      "“Our garden” is saved. Visitors can open it from the menu.",
    );
    const page = mockApi.store.pages.find((p) => p.pageId === created.pageId)!;
    expect(page.slug).toBe("our-garden");
    expect(page.fr).toEqual({
      title: "Notre jardin",
      heroImageAlt: "Le jardin sur le toit.",
    });
    expect(page.sections[0]).toEqual({
      kind: "heading",
      text: "Tomatoes in August",
      fr: { text: "Des tomates en août" },
    });
  });
});
