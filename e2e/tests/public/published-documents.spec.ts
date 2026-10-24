// Acceptance Test
// Traces to: L2-REQ-126, L2-REQ-124
// Description: The public Documents page reads the published notices, by-laws
// and reports from their own endpoints, keeps the documents of the requests
// that answered, says so with Try again when none did, and the public app
// sends no request to the removed routes: json-content, board-members,
// boardmembers and documents.

import { test, expect } from "../../fixtures/public/api.fixture";
import { DocumentsPage } from "../../pages/public/documents.page";
import { LandingPage } from "../../pages/public/landing.page";

const DEAD_ROUTES =
  /\/api\/(json-content|jsoncontent|board-members|boardmembers|documents)(\/|\?|$)/;

test.describe("Published documents", () => {
  let documents: DocumentsPage;

  test.beforeEach(async ({ page }) => {
    documents = new DocumentsPage(page);
  });

  test("lists the published notices, by-laws and reports newest first and nothing else", async ({
    api,
    mockApi,
    page,
  }) => {
    await api.createDocument({
      title: "Older by-law",
      type: "bylaws",
      published: true,
    });
    await api.createDocument({
      title: "Draft report",
      type: "reports",
      published: false,
    });
    await api.createDocument({
      title: "Newest report",
      type: "reports",
      published: true,
    });
    const requests: string[] = [];
    page.on("request", (request) =>
      requests.push(new URL(request.url()).pathname),
    );

    await documents.goto();
    await documents.expectLoaded();

    const titles = await documents.documentTitle.allInnerTexts();
    expect(titles).toContain("Older by-law");
    const newest = mockApi.store.documents
      .filter((d) => d.status === "Published")
      .sort((a, b) => b.createdOn.localeCompare(a.createdOn))[0];
    expect(titles[0]).toBe(newest.name);
    expect(titles).not.toContain("Draft report");
    for (const path of [
      "/api/notice/published",
      "/api/bylaw/published",
      "/api/report/published",
    ]) {
      expect(requests).toContain(path);
    }
  });

  test("keeps the documents of the requests that answered", async ({
    api,
    mockApi,
  }) => {
    await api.createDocument({
      title: "A notice that loads",
      type: "notices",
      published: true,
    });
    await api.createDocument({
      title: "A by-law that does not",
      type: "bylaws",
      published: true,
    });
    mockApi.failing.add("GET bylaw/published");

    await documents.goto();
    await documents.expectLoaded();

    await expect(
      documents.documentTitle.filter({ hasText: "A notice that loads" }),
    ).toBeVisible();
    await expect(
      documents.documentTitle.filter({ hasText: "A by-law that does not" }),
    ).toHaveCount(0);
    await expect(documents.error).toHaveCount(0);
  });

  test("says when nothing could be loaded and Try again loads the documents", async ({
    api,
    mockApi,
  }) => {
    await api.createDocument({
      title: "Back after a retry",
      type: "notices",
      published: true,
    });
    for (const route of [
      "GET notice/published",
      "GET bylaw/published",
      "GET report/published",
    ]) {
      mockApi.failing.add(route);
    }

    await documents.goto();

    await expect(documents.error).toContainText(
      "We couldn't load the documents right now.",
    );
    await expect(documents.emptyState).toHaveCount(0);
    mockApi.failing.clear();
    await documents.retryButton.click();
    await expect(
      documents.documentTitle.filter({ hasText: "Back after a retry" }),
    ).toBeVisible();
    await expect(documents.error).toHaveCount(0);
  });

  test("sends no request to a removed route from the home page, a website page or Documents", async ({
    page,
    mockApi,
  }) => {
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));

    const landing = new LandingPage(page);
    await landing.goto();
    await landing.expectBoardSectionVisible();
    await page.goto(`/pages/${mockApi.store.pages[0].slug}`);
    await page.waitForLoadState("networkidle");
    await documents.goto();
    await documents.expectLoaded();

    expect(requests.filter((url) => DEAD_ROUTES.test(url))).toEqual([]);
    expect(
      requests.some((url) => url.endsWith("/api/board-of-directors")),
    ).toBe(true);
  });
});
