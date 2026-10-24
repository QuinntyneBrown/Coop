// Acceptance Test
// Traces to: L2-REQ-119, L2-REQ-124, L2-REQ-095, L2-REQ-096, L2-REQ-097, L2-REQ-098
// Description: The office edits the home page and the menu and footer on the
// page editor screen: the sections in the order visitors see them, the
// selected section's form with a placement sentence, required fields,
// safe-link and photo checks, a failed save, Undo changes, edits kept when
// switching sections, list items added, moved and removed, photos chosen or
// uploaded, the linked What's on and Board sections with their counts and
// Manage links, the three panes as tabs at 320 px, and the public site
// showing what was saved once it is published.

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

/** A 1x1 PNG, the smallest real photo. */
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

const HOME_SECTIONS = [
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

test.describe("Page editor", () => {
  let editor: PageEditorPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    editor = new PageEditorPage(authenticatedPage);
  });

  test.describe("Sections", () => {
    test("lists the home page sections in the order visitors see them, with the first selected", async ({
      authenticatedPage,
    }) => {
      await editor.gotoHome();
      await editor.expectLoaded();
      await expect(authenticatedPage).toHaveTitle(
        "Home · OWN Housing Co-op Office",
      );
      await expect(editor.sectionButtons).toHaveText(HOME_SECTIONS);
      await expect(editor.sectionButton("Welcome banner")).toHaveAttribute(
        "aria-current",
        "true",
      );
      await expect(editor.sectionHeading).toHaveText("Welcome banner");
      await expect(editor.placement).toHaveText(
        "Appears first on the home page, under the menu.",
      );
      await expect(editor.field("Title")).toHaveValue(
        "A home of our own, in the heart of Toronto.",
      );
    });

    test("lists the menu and the footer on the Menu and footer editor", async () => {
      await editor.gotoMenu();
      await editor.expectLoaded("Menu and footer");
      await expect(editor.sectionButtons).toHaveText(["Menu", "Footer"]);
      await expect(editor.placement).toHaveText(
        "Appears at the top of every page: the site name and the menu links.",
      );
      await expect(editor.field("Site name")).toHaveValue("OWN Housing Co-op");
      await editor.selectSection("Footer");
      await expect(editor.placement).toHaveText(
        "Appears at the bottom of every page.",
      );
    });

    test("shows the chosen section with its placement and moves focus to its heading", async () => {
      await editor.gotoHome();
      await editor.selectSection("Visit or apply");
      await expect(editor.sectionButton("Visit or apply")).toHaveAttribute(
        "aria-current",
        "true",
      );
      await expect(editor.sectionHeading).toBeFocused();
      await expect(editor.placement).toHaveText(
        "Appears last on the home page, above the footer.",
      );
      await expect(editor.field("Title")).toHaveValue(
        "Come and see for yourself.",
      );
    });

    test("keeps unsaved edits when switching sections and Undo changes restores the saved values", async ({
      mockApi,
    }) => {
      await editor.gotoHome();
      await editor.field("Title").fill("Come home to the co-op.");
      await editor.selectSection("Who we are");
      await editor.selectSection("Welcome banner");
      await expect(editor.field("Title")).toHaveValue(
        "Come home to the co-op.",
      );
      expect(homeSection(draft(mockApi), "hero").title).toBe(
        "A home of our own, in the heart of Toronto.",
      );

      await editor.undoButton.click();
      await expect(editor.field("Title")).toHaveValue(
        "A home of our own, in the heart of Toronto.",
      );
    });

    test("offers Try again when the content cannot be loaded", async ({
      mockApi,
    }) => {
      mockApi.failing.add("GET site-content");
      await editor.gotoHome();
      await expect(editor.error).toContainText(
        "We couldn't load the website content. Check your connection and try again.",
      );
      mockApi.failing.clear();
      await editor.retryButton.click();
      await editor.expectLoaded();
      await expect(editor.error).toBeHidden();
    });
  });

  test.describe("Save a section", () => {
    test("saves a changed welcome banner and the public home page shows it", async ({
      mockApi,
      api,
    }) => {
      await editor.gotoHome();
      await editor.field("Title").fill("Come home to the co-op.");
      await editor.field("Label", "Main button").fill("Meet the board");
      await editor.field("Address", "Main button").fill("/#board");
      await editor.save();

      await expect(editor.notice).toHaveText(
        "Saved to your draft. Publish when you are ready for visitors to see it.",
      );
      expect(homeSection(draft(mockApi), "hero").title).toBe(
        "Come home to the co-op.",
      );

      await api.post("site-content/publish", {});
      const home = await editor.openPublicHomePage();
      await expect(home.heroTitle).toHaveText("Come home to the co-op.");
      await expect(home.heroCta).toHaveText("Meet the board");
      await expect(home.heroCta).toHaveAttribute("href", "/#board");
    });

    test("names the empty required fields in a summary and keeps the values", async ({
      mockApi,
    }) => {
      await editor.gotoHome();
      await editor.field("Title").fill("");
      await editor.field("Label", "Second button").fill("");
      await editor.save();

      await expect(editor.formErrors).toContainText(
        "Something needs attention before your changes can be saved.",
      );
      await expect(editor.formErrors).toBeFocused();
      await expect(editor.fieldError("Title")).toHaveText("Fill in “Title”");
      await expect(editor.fieldError("Label", "Second button")).toHaveText(
        "Fill in “Label”",
      );
      await expect(editor.field("Title")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
      expect(homeSection(draft(mockApi), "hero").title).toBe(
        "A home of our own, in the heart of Toronto.",
      );
    });

    test("refuses an unsafe link address", async ({ mockApi }) => {
      await editor.gotoHome();
      await editor.field("Address", "Main button").fill("javascript:alert(1)");
      await editor.save();

      await expect(editor.fieldError("Address", "Main button")).toHaveText(
        "Use a page on this site, a web address, an e-mail address or a phone number.",
      );
      expect(homeSection(draft(mockApi), "hero").primaryAction.href).toBe(
        "/#visit",
      );
    });

    test("keeps the entered values and explains when the save fails", async ({
      mockApi,
    }) => {
      mockApi.failing.add("PUT site-content");
      await editor.gotoHome();
      await editor.selectSection("Visit or apply");
      await editor.field("Title").fill("Drop in any weekday.");
      await editor.save();

      await expect(editor.formFailed).toHaveText(
        "We couldn't save your changes. Try again.",
      );
      await expect(editor.field("Title")).toHaveValue("Drop in any weekday.");
      await expect(editor.saveButton).toBeEnabled();

      mockApi.failing.clear();
      await editor.save();
      await expect(editor.notice).toBeVisible();
      expect(homeSection(draft(mockApi), "visit").title).toBe(
        "Drop in any weekday.",
      );
    });
  });

  test.describe("Lists", () => {
    test("adds, moves and removes menu links and the public header follows", async ({
      mockApi,
      api,
    }) => {
      await editor.gotoMenu();
      await expect(editor.itemButton("Move menu link 1 up")).toBeDisabled();
      await expect(editor.itemButton("Move menu link 5 down")).toBeDisabled();

      await editor.itemButton("Add menu link").click();
      await expect(editor.field("Label", "Menu link 6")).toBeFocused();
      await editor.field("Label", "Menu link 6").fill("Our garden");
      await editor.field("Address", "Menu link 6").fill("/pages/our-garden");
      await editor.itemButton("Move menu link 6 up").click();
      await expect(editor.field("Label", "Menu link 5")).toHaveValue(
        "Our garden",
      );
      await editor.itemButton("Remove menu link 2").click();
      await editor.save();

      await expect(editor.notice).toBeVisible();
      expect(draft(mockApi).header.menuLinks.map((l: any) => l.label)).toEqual([
        "Home",
        "Living here",
        "What's on",
        "Our garden",
        "Contact",
      ]);

      await api.post("site-content/publish", {});
      const home = await editor.openPublicHomePage();
      await home.page.setViewportSize({ width: 1280, height: 800 });
      await expect(home.navLink("Our garden")).toHaveAttribute(
        "href",
        "/pages/our-garden",
      );
      await expect(home.navLink("About us")).toHaveCount(0);
    });

    test("edits the checklist of a building row one item per line", async ({
      mockApi,
    }) => {
      await editor.gotoHome();
      await editor.selectSection("Our building and community");
      await editor
        .field("Checklist (one item per line)", "Row 1")
        .fill("Step-free entrance\n\nTwo lifts\n");
      await editor.save();

      await expect(editor.notice).toBeVisible();
      expect(homeSection(draft(mockApi), "features").rows[0].items).toEqual([
        "Step-free entrance",
        "Two lifts",
      ]);
    });
  });

  test.describe("Linked sections", () => {
    test("What's on shows the published notices and links to Manage notices", async ({
      authenticatedPage,
      mockApi,
    }) => {
      const notices = mockApi.store.documents.filter(
        (d) => d.documentType === "Notice" && d.status === "Published",
      );
      await editor.gotoHome();
      await editor.selectSection("What's on");
      await expect(editor.linkedTitle).toHaveText(
        `What visitors will see: ${notices.length} published notice${notices.length === 1 ? "" : "s"}, newest first`,
      );
      await expect(editor.linkedItems.first()).toContainText(notices[0].name);
      await expect(editor.linkedLink).toHaveText(/Manage notices/);
      await editor.linkedLink.click();
      await expect(authenticatedPage).toHaveURL(/\/documents$/);
    });

    test("What's on says when no notice is published", async ({ mockApi }) => {
      mockApi.store.documents = mockApi.store.documents.filter(
        (d) => d.documentType !== "Notice",
      );
      await editor.gotoHome();
      await editor.selectSection("What's on");
      await expect(editor.linkedTitle).toHaveText(
        "What visitors will see: no published notices",
      );
      await expect(editor.linkedEmpty).toHaveText(
        "Your message above shows instead. Publish a notice under Documents and it appears here.",
      );
    });

    test("Board of directors lists the directors in order and links to Manage directors", async ({
      authenticatedPage,
    }) => {
      await editor.gotoHome();
      await editor.selectSection("Board of directors");
      await expect(editor.linkedTitle).toHaveText(
        "What visitors will see: 3 directors, in this order",
      );
      await expect(editor.linkedItems).toHaveText([
        "Beatrice Hollis, President",
        "Rosalind Petrov, Treasurer",
        "Harriet Lindqvist, Secretary",
      ]);
      await editor.linkedLink.click();
      await expect(authenticatedPage).toHaveURL(/\/website\/board$/);
    });

    test("says when the count cannot be loaded and the link still works", async ({
      mockApi,
    }) => {
      mockApi.failing.add("GET board-of-directors");
      await editor.gotoHome();
      await editor.selectSection("Board of directors");
      await expect(editor.linkedTitle).toHaveText("What visitors will see:");
      await expect(editor.linkedEmpty).toHaveText(
        "We couldn't count them right now.",
      );
      await expect(editor.linkedLink).toBeVisible();
    });
  });

  test.describe("Photos", () => {
    test("chooses a photo from the library and asks for a new description", async ({
      mockApi,
    }) => {
      const asset = mockApi.createAsset({
        fileName: "garden-party.png",
        contentType: "image/png",
        size: 68,
      });
      mockApi.createAsset({
        fileName: "minutes.pdf",
        contentType: "application/pdf",
        size: 68,
      });
      await editor.gotoHome();
      await editor.openPicker();
      await expect(editor.pickerOption("garden-party.png")).toBeVisible();
      await expect(
        editor.pickerOptions.filter({ hasText: "minutes.pdf" }),
      ).toHaveCount(0);

      await editor.pickerOption("garden-party.png").click();
      await expect(editor.picker).toBeHidden();
      await expect(editor.field("Photo description")).toHaveValue("");
      await expect(editor.field("Photo description")).toBeFocused();
      await editor.save();
      await expect(editor.fieldError("Photo description")).toHaveText(
        "Describe this photo for people who cannot see it",
      );

      await editor
        .field("Photo description")
        .fill("Neighbours at the garden party.");
      await editor.save();
      await expect(editor.notice).toBeVisible();
      const photo = homeSection(draft(mockApi), "hero").photo;
      expect(photo.src).toBe(
        `http://localhost:5000/api/digitalasset/serve/${asset.digitalAssetId}`,
      );
      expect(photo.alt).toBe("Neighbours at the garden party.");
      expect(photo.width).toBeGreaterThan(0);
      expect(photo.height).toBeGreaterThan(0);
    });

    test("says when the library has no photos, and Cancel keeps the current photo", async ({
      mockApi,
    }) => {
      mockApi.store.assets = [];
      await editor.gotoHome();
      await editor.selectSection("A word from a member");
      await editor.openPicker();
      await expect(editor.pickerEmpty).toHaveText(
        "No photos in the library yet. Upload one below.",
      );
      await editor.pickerCancel.click();
      await expect(editor.picker).toBeHidden();
      await expect(editor.field("Photo description")).toHaveValue(/^Beatrix/);
    });

    test("uploads a new photo into the library and uses it", async ({
      mockApi,
    }) => {
      await editor.gotoHome();
      await editor.selectSection("A word from a member");
      await editor.openPicker();
      await editor.uploadPhoto("beatrix.png", PNG);
      await expect(editor.picker).toBeHidden();
      await editor.field("Photo description").fill("Beatrix in her garden.");
      await editor.save();

      await expect(editor.notice).toBeVisible();
      const uploaded = mockApi.store.assets.find(
        (a) => a.name === "beatrix.png",
      )!;
      expect(homeSection(draft(mockApi), "quote").photo.src).toBe(
        `http://localhost:5000/api/digitalasset/serve/${uploaded.digitalAssetId}`,
      );
    });

    test("refuses a file that is not a photo and explains a failed upload", async ({
      mockApi,
    }) => {
      const before = mockApi.store.assets.length;
      await editor.gotoHome();
      await editor.selectSection("A word from a member");
      await editor.openPicker();
      await editor.uploadPhoto("notes.txt", Buffer.from("notes"), "text/plain");
      await expect(editor.pickerUploadError).toHaveText(
        "Choose a JPEG, PNG or WebP photo.",
      );
      expect(mockApi.store.assets).toHaveLength(before);

      mockApi.failing.add("POST digitalasset/upload");
      await editor.uploadPhoto("beatrix.png", PNG);
      await expect(editor.pickerUploadError).toHaveText(
        "We couldn't upload the photo. Try again.",
      );
      await expect(editor.picker).toBeVisible();
    });
  });

  test.describe("At 400% zoom", () => {
    test("shows the panes as tabs at 320 px and choosing a section moves to Edit", async ({
      authenticatedPage,
    }) => {
      await authenticatedPage.setViewportSize({ width: 320, height: 640 });
      await editor.gotoHome();
      await editor.expectLoaded();
      expect(await editor.hasHorizontalScroll()).toBe(false);
      await expect(editor.tabEdit).toHaveAttribute("aria-selected", "true");
      await expect(editor.formPane).toBeVisible();
      await expect(editor.sectionsPane).toBeHidden();

      await editor.tabSections.click();
      await expect(editor.sectionsPane).toBeVisible();
      await expect(editor.formPane).toBeHidden();
      await editor.sectionButton("Who we are").click();
      await expect(editor.tabEdit).toHaveAttribute("aria-selected", "true");
      await expect(editor.sectionHeading).toHaveText("Who we are");
      expect(await editor.hasHorizontalScroll()).toBe(false);
    });

    test("shows all three panes side by side on a desktop", async ({
      authenticatedPage,
    }) => {
      await authenticatedPage.setViewportSize({ width: 1280, height: 900 });
      await editor.gotoHome();
      await expect(editor.tabSections).toBeHidden();
      await expect(editor.sectionsPane).toBeVisible();
      await expect(editor.formPane).toBeVisible();
    });
  });
});
