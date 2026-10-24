// Acceptance Test
// Traces to: L2-REQ-120, L2-REQ-122
// Description: From the Home editor's section list the office moves a section
// up or down and hides or shows it; each change is saved to the draft at
// once and announced, the list follows the saved order with a Hidden badge,
// a failed save leaves the list as it was and says so, the Menu and footer
// editor has no such tools, and the public home page follows once the draft
// is published.

import { test, expect } from "../../fixtures/admin/api.fixture";
import type { MockApi } from "../../fixtures/mock-api/mock-api";
import { PageEditorPage } from "../../pages/admin/page-editor.page";

const DEFAULT_ORDER = [
  "Welcome banner",
  "Numbers at a glance",
  "Who we are",
  "A look around",
  "Our building and community",
  "What's on",
  "Board of directors",
  "A word from a member",
  "Visit or apply",
];

/** The kinds of the home sections in the draft, in order. */
function draftKinds(mockApi: MockApi): string[] {
  const draft = mockApi.store.jsonContents.find(
    (j) => j.name === "SiteContentDraft",
  );
  return (draft?.content as any).home.sections.map((s: any) => s.kind);
}

test.describe("Section order and visibility", () => {
  let editor: PageEditorPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    editor = new PageEditorPage(authenticatedPage);
    await editor.gotoHome();
    await editor.expectLoaded();
  });

  test("offers Hide, Move up and Move down for the selected section, within the list's ends", async () => {
    expect(await editor.sectionNames()).toEqual(DEFAULT_ORDER);
    await expect(editor.hideButton).toHaveText(/Hide section/);
    await expect(editor.moveUpButton).toBeDisabled();
    await expect(editor.moveDownButton).toBeEnabled();

    await editor.selectSection("Visit or apply");
    await expect(editor.moveUpButton).toBeEnabled();
    await expect(editor.moveDownButton).toBeDisabled();
  });

  test("Move down swaps the section with its neighbour, saves the draft and keeps focus on the button", async ({
    mockApi,
  }) => {
    await editor.selectSection("Numbers at a glance");

    await editor.moveDownButton.click();

    await expect(editor.toolsStatus).toHaveText(
      "“Numbers at a glance” moved down to position 3.",
    );
    expect(await editor.sectionNames()).toEqual([
      "Welcome banner",
      "Who we are",
      "Numbers at a glance",
      ...DEFAULT_ORDER.slice(3),
    ]);
    expect(draftKinds(mockApi).slice(0, 3)).toEqual([
      "hero",
      "about",
      "glance",
    ]);
    await expect(editor.moveDownButton).toBeFocused();

    await editor.moveUpButton.click();
    await expect(editor.toolsStatus).toHaveText(
      "“Numbers at a glance” moved up to position 2.",
    );
    expect(await editor.sectionNames()).toEqual(DEFAULT_ORDER);
  });

  test("moving the last section to the end moves focus to the other button", async () => {
    await editor.selectSection("A word from a member");
    await editor.moveDownButton.click();
    await expect(editor.toolsStatus).toHaveText(
      "“A word from a member” moved down to position 9.",
    );
    await expect(editor.moveDownButton).toBeDisabled();
    await expect(editor.moveUpButton).toBeFocused();
  });

  test("Hide section keeps the section in the list with a Hidden badge and saves hidden to the draft", async ({
    mockApi,
  }) => {
    await editor.selectSection("A look around");

    await editor.hideButton.click();

    await expect(editor.toolsStatus).toHaveText(
      "“A look around” is hidden in your draft. Its photos and captions are kept.",
    );
    await expect(
      editor.sectionItem("A look around").getByText("Hidden"),
    ).toBeVisible();
    await expect(editor.hideButton).toHaveText(/Show section/);
    const draft = mockApi.store.jsonContents.find(
      (j) => j.name === "SiteContentDraft",
    )!;
    const gallery = (draft.content as any).home.sections.find(
      (s: any) => s.kind === "gallery",
    );
    expect(gallery.hidden).toBe(true);
    expect(gallery.photos.length).toBeGreaterThan(0);

    await editor.hideButton.click();
    await expect(editor.toolsStatus).toHaveText(
      "“A look around” is shown again in your draft.",
    );
    await expect(
      editor.sectionItem("A look around").getByText("Hidden"),
    ).toHaveCount(0);
    await expect(editor.hideButton).toHaveText(/Hide section/);
  });

  test("a failed save leaves the list as it was and says so", async ({
    mockApi,
  }) => {
    mockApi.failing.add("PUT site-content");
    await editor.selectSection("Numbers at a glance");

    await editor.moveDownButton.click();

    await expect(editor.toolsError).toHaveText(
      "We couldn't save your changes. Try again.",
    );
    expect(await editor.sectionNames()).toEqual(DEFAULT_ORDER);
    await expect(editor.toolsStatus).toHaveCount(0);
  });

  test("the Menu and footer editor has no move or hide tools", async () => {
    await editor.gotoMenu();
    await editor.expectLoaded("Menu and footer");
    await expect(editor.hideButton).toHaveCount(0);
    await expect(editor.moveUpButton).toHaveCount(0);
  });

  test("once published, the public home page shows the new order without the hidden section", async ({
    api,
  }) => {
    await editor.selectSection("A word from a member");
    await editor.hideButton.click();
    await expect(editor.toolsStatus).toBeVisible();
    await editor.selectSection("Numbers at a glance");
    await editor.moveDownButton.click();
    await expect(editor.toolsStatus).toBeVisible();

    const before = await editor.openPublicHomePage();
    expect(await before.sectionIds()).toEqual([
      "top",
      "glance",
      "about",
      "life",
      "features",
      "events",
      "board",
      "quote",
      "visit",
    ]);
    await before.page.close();

    await api.post("site-content/publish", {});
    const after = await editor.openPublicHomePage();
    expect(await after.sectionIds()).toEqual([
      "top",
      "about",
      "glance",
      "life",
      "features",
      "events",
      "board",
      "visit",
    ]);
  });
});
