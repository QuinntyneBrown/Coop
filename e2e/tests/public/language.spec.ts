// Acceptance Test
// Traces to: L2-REQ-131, L2-REQ-129
// Description: Visitors switch the public site between English and French
// from the language bar above the header, at every width: the published French text shows, the
// English shows wherever the French is missing, the fixed labels come in
// French, the choice is remembered, `?lang=` opens a language, and the
// switcher reflows at 320 CSS px.

import { test, expect } from "../../fixtures/mock-api/mock-api.fixture";
import type { MockApi } from "../../fixtures/mock-api/mock-api";
import { ContentPage } from "../../pages/public/content-page.page";
import { LandingPage } from "../../pages/public/landing.page";

/** The published site content in the mock store, changed in place to publish. */
function published(mockApi: MockApi): Record<string, any> {
  return mockApi.store.jsonContents.find((j) => j.name === "SiteContent")!
    .content;
}

function hero(mockApi: MockApi): Record<string, any> {
  return published(mockApi).home.sections.find((s: any) => s.kind === "hero");
}

test.describe("Language", () => {
  let landing: LandingPage;

  test.beforeEach(async ({ page, mockApi }) => {
    landing = new LandingPage(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    const content = published(mockApi);
    content.header.menuLinks[0].fr = { label: "Accueil" };
    content.header.signInLink.fr = { label: "Connexion des membres" };
    hero(mockApi).fr = { title: "Un chez-soi bien à nous.", lead: "" };
    hero(mockApi).photo.fr = { alt: "Des membres dans le jardin." };
  });

  test("opens in English with a button that offers French in French", async () => {
    await landing.goto();

    await expect(landing.languageButton).toHaveText("Français");
    await expect(landing.languageButton).toHaveAttribute("lang", "fr");
    expect(await landing.htmlLang()).toBe("en");
    await expect(landing.navLink("Home")).toBeVisible();
  });

  test("shows the French text and the English where the French is missing", async ({
    mockApi,
  }) => {
    const englishLead = hero(mockApi).lead;
    await landing.goto();

    await landing.languageButton.click();

    await expect(landing.heroTitle).toHaveText("Un chez-soi bien à nous.");
    await expect(landing.heroSubtitle).toHaveText(englishLead);
    await expect(landing.navLink("Accueil")).toBeVisible();
    await expect(landing.navLink("About us")).toBeVisible();
    await expect(landing.signInLink).toHaveText("Connexion des membres");
    await expect(landing.heroPhoto).toHaveAttribute(
      "alt",
      "Des membres dans le jardin.",
    );
    expect(await landing.htmlLang()).toBe("fr");
    await expect(landing.languageButton).toHaveText("English");
    await expect(landing.languageButton).toHaveAttribute("lang", "en");
    await expect(landing.languageButton).toBeFocused();
    await expect(landing.languageStatus).toHaveText(
      "Le site est maintenant en français.",
    );
    await expect(landing.skipLink).toHaveText("Aller au contenu");

    await landing.languageButton.click();

    await expect(landing.heroTitle).not.toHaveText("Un chez-soi bien à nous.");
    await expect(landing.navLink("Home")).toBeVisible();
    await expect(landing.languageStatus).toHaveText(
      "The site is now in English.",
    );
  });

  test("remembers the choice on the next visit", async ({ page }) => {
    await landing.goto();
    await landing.languageButton.click();

    await page.reload();
    await page.waitForLoadState("networkidle");

    await expect(landing.heroTitle).toHaveText("Un chez-soi bien à nous.");
    expect(await landing.htmlLang()).toBe("fr");
  });

  test("opens in the language the address asks for", async () => {
    await landing.goto("?lang=fr");

    await expect(landing.heroTitle).toHaveText("Un chez-soi bien à nous.");
    await expect(landing.languageButton).toHaveText("English");
  });

  test("shows the built-in English when nothing is published", async ({
    mockApi,
  }) => {
    mockApi.store.jsonContents = mockApi.store.jsonContents.filter(
      (j) => j.name !== "SiteContent",
    );
    await landing.goto("?lang=fr");

    await expect(landing.heroTitle).not.toBeEmpty();
    await expect(landing.languageButton).toHaveText("English");
  });

  test("switches on a phone without opening the menu and reflows at 320 CSS px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await landing.goto();

    await landing.languageButton.click();

    await expect(landing.heroTitle).toHaveText("Un chez-soi bien à nous.");
    await expect(landing.menuButton).toContainText("Menu");
    const box = await landing.languageButton.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(await landing.hasHorizontalScroll()).toBe(false);
    await landing.openMenu();
    await expect(landing.menuButton).toContainText("Fermer");
  });

  test("shows a website page in French", async ({ page, mockApi }) => {
    mockApi.createPage({
      title: "Joining us",
      fr: { title: "Nous rejoindre" },
      sections: [
        {
          kind: "heading",
          text: "Who can apply",
          fr: { text: "Qui peut faire une demande" },
        },
        { kind: "paragraph", text: "Send the form to the office." },
      ],
    });
    const content = new ContentPage(page);
    await content.goto("joining-us");

    await content.languageButton.click();

    await expect(content.title).toHaveText("Nous rejoindre");
    await expect(content.body).toContainText("Qui peut faire une demande");
    await expect(content.body).toContainText("Send the form to the office.");
    await expect(content.navPageLink("Nous rejoindre")).toBeVisible();
    await expect(page).toHaveTitle(/^Nous rejoindre · /);
  });

  test("shows the fixed labels of a missing page in French", async ({
    page,
  }) => {
    const content = new ContentPage(page);
    await page.goto("/pages/nowhere?lang=fr");
    await page.waitForLoadState("networkidle");

    await expect(content.title).toHaveText("Page introuvable");
    await expect(content.goHomeLink).toHaveText("Retour à l'accueil");
  });
});
