// Acceptance Test
// Traces to: L2-REQ-125, L2-REQ-121
// Description: Opened with ?preview={token}, the public home page shows the
// site content draft and a preview banner; with an expired token it shows the
// published content and says the preview link has expired; without a token
// nothing changes and no token is sent.

import { test, expect } from "../../fixtures/mock-api/mock-api.fixture";
import { LandingPage } from "../../pages/public/landing.page";
import { REFLOW_WIDTH, ReflowPage } from "../../pages/reflow.page";
import { homeSection } from "../../fixtures/mock-api/home-section";

const PUBLISHED_TITLE = "A home of our own, in the heart of Toronto.";

test.describe("Preview mode", () => {
  let landing: LandingPage;

  test.beforeEach(async ({ page, mockApi }) => {
    landing = new LandingPage(page);
    mockApi.saveDraft((content) => {
      homeSection(content, "hero").title = "Only in the draft.";
    });
  });

  test("shows the draft and the preview banner with a valid token", async ({
    mockApi,
  }) => {
    await landing.goto(
      `?preview=${encodeURIComponent(mockApi.previewToken())}`,
    );

    await expect(landing.heroTitle).toHaveText("Only in the draft.");
    await expect(landing.previewBanner).toHaveText(
      "Preview. You are looking at unpublished changes. Visitors see the published website.",
    );
    await expect(landing.previewBanner).toHaveAttribute("role", "status");
  });

  test("shows the published content and says the link has expired with an expired token", async ({
    mockApi,
  }) => {
    await landing.goto(
      `?preview=${encodeURIComponent(mockApi.previewToken(-5))}`,
    );

    await expect(landing.heroTitle).toHaveText(PUBLISHED_TITLE);
    await expect(landing.previewBanner).toHaveText(
      "This preview link has expired. You are looking at the published website. Open the preview again from the admin Website area.",
    );
  });

  test("shows no banner and sends no token without one", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));

    await landing.goto();

    await expect(landing.heroTitle).toHaveText(PUBLISHED_TITLE);
    await expect(landing.previewBanner).toHaveCount(0);
    expect(requests.filter((url) => url.includes("preview="))).toEqual([]);
  });

  test("the banner reflows at 320 px", async ({ page, mockApi }) => {
    await page.setViewportSize({ width: REFLOW_WIDTH, height: 800 });
    const reflow = new ReflowPage(page);
    await reflow.open(
      `/?preview=${encodeURIComponent(mockApi.previewToken())}`,
    );
    await expect(landing.previewBanner).toBeVisible();
    await reflow.expectReflows();
  });
});
