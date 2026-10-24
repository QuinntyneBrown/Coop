// Acceptance Test
// Traces to: L2-REQ-122, L2-REQ-070
// Description: The public home page renders home.sections in the published
// order by kind, each with its section id, leaves hidden and unknown sections
// out while the menu stays the same, and falls back to the default sections
// in the default order when the list is missing.

import { test, expect } from "../../fixtures/mock-api/mock-api.fixture";
import type { MockApi } from "../../fixtures/mock-api/mock-api";
import { homeSection } from "../../fixtures/mock-api/home-section";
import { LandingPage } from "../../pages/public/landing.page";

const DEFAULT_IDS = [
  "top",
  "glance",
  "about",
  "life",
  "features",
  "events",
  "board",
  "quote",
  "visit",
];

function published(mockApi: MockApi): Record<string, any> {
  return mockApi.store.jsonContents.find((j) => j.name === "SiteContent")!
    .content;
}

test.describe("Home page sections", () => {
  let landing: LandingPage;

  test.beforeEach(async ({ page }) => {
    landing = new LandingPage(page);
  });

  test("renders the default sections in the default order, each with its id", async () => {
    await landing.goto();
    expect(await landing.sectionIds()).toEqual(DEFAULT_IDS);
  });

  test("follows the published order", async ({ mockApi }) => {
    const sections: any[] = published(mockApi).home.sections;
    const quote = sections.find((s) => s.kind === "quote");
    published(mockApi).home.sections = [
      quote,
      ...sections.filter((s) => s !== quote),
    ];

    await landing.goto();

    expect(await landing.sectionIds()).toEqual([
      "quote",
      ...DEFAULT_IDS.filter((id) => id !== "quote"),
    ]);
    await expect(landing.quote).toContainText(quote.text);
  });

  test("leaves a hidden section out and keeps the menu and the other sections", async ({
    mockApi,
  }) => {
    homeSection(published(mockApi), "gallery").hidden = true;
    const menuLabels = published(mockApi).header.menuLinks.map(
      (l: any) => l.label,
    );

    await landing.goto();

    expect(await landing.sectionIds()).toEqual(
      DEFAULT_IDS.filter((id) => id !== "life"),
    );
    await expect(landing.gallery).toHaveCount(0);
    await landing.page.setViewportSize({ width: 1280, height: 800 });
    for (const label of menuLabels) await expect(landing.navLink(label)).toBeVisible();
  });

  test("leaves out a section of an unknown kind and fills a missing value with its default", async ({
    mockApi,
  }) => {
    published(mockApi).home.sections.push({
      kind: "carousel",
      title: "Photos",
    });
    delete homeSection(published(mockApi), "visit").hours;

    await landing.goto();

    expect(await landing.sectionIds()).toEqual(DEFAULT_IDS);
    await expect(landing.visit).toContainText("Monday to Friday, 9 am to 4 pm");
  });

  test("shows the default sections when the list is missing or not a list", async ({
    mockApi,
  }) => {
    published(mockApi).home = { sections: "none" };
    await landing.goto();
    expect(await landing.sectionIds()).toEqual(DEFAULT_IDS);
    await expect(landing.heroTitle).toHaveText(
      "A home of our own, in the heart of Toronto.",
    );
  });
});
