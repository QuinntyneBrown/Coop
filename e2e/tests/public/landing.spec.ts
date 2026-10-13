// Acceptance Test
// Traces to: L2-REQ-066, L2-REQ-068, L2-REQ-069, L2-REQ-078
// Description: The public home page renders the OWN design: header with sign in,
// CMS-driven hero with its actions and photograph, and the contact footer.

import { test, expect } from "../../fixtures/public/auth.fixture";
import { LandingPage } from "../../pages/public/landing.page";

const DEFAULT_HERO_TITLE = "A home of our own, in the heart of Toronto.";

test.describe("Home page", () => {
  let landing: LandingPage;

  test.beforeEach(async ({ page }) => {
    landing = new LandingPage(page);
  });

  test.describe("Header", () => {
    test("shows the Co-op name and a Member sign in link without signing in", async () => {
      await landing.goto();
      await expect(landing.header).toBeVisible();
      await expect(landing.brand).toContainText("OWN Housing Co-op");
      await expect(landing.signInLink).toBeVisible();
    });

    test("opens the login page from Member sign in", async () => {
      await landing.goto();
      await landing.navigateToLogin();
      await expect(landing.page).toHaveURL(/\/login/);
    });
  });

  test.describe("Hero", () => {
    test("renders the title and lead from the Hero CMS content", async ({
      mockApi,
    }) => {
      const hero = mockApi.store.jsonContents.find((j) => j.name === "Hero")!;
      await landing.goto();
      await expect(landing.heroTitle).toHaveText(String(hero.content["title"]));
      await expect(landing.heroSubtitle).toHaveText(
        String(hero.content["subtitle"]),
      );
    });

    test("falls back to the default copy when the CMS has no Hero", async ({
      mockApi,
    }) => {
      mockApi.store.jsonContents = [];
      await landing.goto();
      await expect(landing.heroTitle).toHaveText(DEFAULT_HERO_TITLE);
    });

    test("offers Book a visit and How to apply", async () => {
      await landing.goto();
      await expect(landing.heroCta).toHaveText(/Book a visit/);
      await expect(landing.heroSecondaryCta).toHaveText("How to apply");
    });

    test("shows the hero photograph with a description", async () => {
      await landing.goto();
      await expect(landing.heroPhoto).toBeVisible();
      await expect(landing.heroPhoto).toHaveAttribute("alt", /\S+/);
    });

    test("stacks the hero in one column on a phone", async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      await landing.goto();
      const text = await landing.heroTitle.boundingBox();
      const photo = await landing.heroPhoto.boundingBox();
      expect(text && photo && photo.y >= text.y + text.height).toBeTruthy();
    });
  });

  test.describe("Footer", () => {
    test("shows how to visit or write, with the phone as a tel link", async () => {
      await landing.goto();
      await expect(landing.footer).toBeVisible();
      await expect(landing.footer).toContainText("Visit or write");
      await expect(landing.footerPhone).toHaveAttribute("href", /^tel:/);
    });
  });
});
