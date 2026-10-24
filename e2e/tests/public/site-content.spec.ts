// Acceptance Test
// Traces to: L2-REQ-094, L2-REQ-095, L2-REQ-096, L2-REQ-097, L2-REQ-098, L2-REQ-099, L2-REQ-100
// Description: The public site draws its header, footer and home page from the
// published SiteContent entry: changed text, links and photos appear without a
// code change, empty lists leave their block out, links to other websites are
// safe, a missing photo is replaced, one request serves the whole page, and the
// built-in defaults fill in when the content or a value is missing.

import { test, expect } from "../../fixtures/mock-api/mock-api.fixture";
import type { MockApi } from "../../fixtures/mock-api/mock-api";
import { ContentPage } from "../../pages/public/content-page.page";
import { homeSection } from "../../fixtures/mock-api/home-section";
import { LandingPage } from "../../pages/public/landing.page";

/** The published site content in the mock store, changed in place to publish. */
function published(mockApi: MockApi): Record<string, any> {
  return mockApi.store.jsonContents.find((j) => j.name === "SiteContent")!
    .content;
}

test.describe("Site content", () => {
  let landing: LandingPage;

  test.beforeEach(async ({ page }) => {
    landing = new LandingPage(page);
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  test("shows the published header and footer", async ({ mockApi }) => {
    const content = published(mockApi);
    content.header.siteName = "Maple Court Co-op";
    content.header.menuLinks = [
      { label: "Home", href: "/" },
      { label: "How we apply", href: "/pages/how-to-apply" },
    ];
    content.header.signInLink = {
      label: "Members, sign in here",
      href: "/login",
    };
    content.footer.contactHeading = "Come and see us";
    content.footer.phone = "416 555 0199";
    content.footer.email = "hello@maplecourt.example";
    content.footer.memberLinks = [
      { label: "Your repairs", href: "/maintenance" },
    ];
    content.footer.copyright = "© 2026 Maple Court Co-op.";

    await landing.goto();

    await expect(landing.brand).toContainText("Maple Court Co-op");
    await expect(landing.navLink("How we apply")).toHaveAttribute(
      "href",
      "/pages/how-to-apply",
    );
    await expect(landing.navLink("Living here")).toHaveCount(0);
    await expect(landing.signInLink).toHaveText("Members, sign in here");
    await expect(landing.footerHeading("Come and see us")).toBeVisible();
    await expect(landing.footerPhone).toHaveText("416 555 0199");
    await expect(landing.footerPhone).toHaveAttribute("href", "tel:4165550199");
    await expect(landing.footerEmail).toHaveAttribute(
      "href",
      "mailto:hello@maplecourt.example",
    );
    await expect(landing.footerLink("Your repairs")).toHaveAttribute(
      "href",
      "/maintenance",
    );
    await expect(landing.footerCopyright).toHaveText(
      "© 2026 Maple Court Co-op.",
    );
  });

  test("shows the published home page text, links and photos", async ({
    mockApi,
  }) => {
    const content = published(mockApi);
    const hero = homeSection(content, "hero");
    hero.eyebrow = "Since 1997";
    hero.title = "Come home to the co-op.";
    hero.lead = "Affordable homes for women over 55.";
    hero.badge = "Open house every Saturday";
    hero.primaryAction = { label: "Meet the board", href: "/#board" };
    hero.photo = {
      src: "/own/garden.svg",
      alt: "Neighbours planting tomatoes in the rooftop garden.",
      width: 800,
      height: 600,
    };
    homeSection(content, "glance").figures[0] = {
      value: "150",
      label: "homes in two buildings",
    };
    homeSection(content, "gallery").photos[0].caption =
      "Tea and cake on Tuesdays";
    homeSection(content, "quote").text = "The best move I ever made.";
    homeSection(content, "visit").action = {
      label: "Write to the office",
      href: "mailto:office@ownhousing.example",
    };

    await landing.goto();

    await expect(landing.heroEyebrow).toHaveText("Since 1997");
    await expect(landing.heroTitle).toHaveText("Come home to the co-op.");
    await expect(landing.heroSubtitle).toHaveText(
      "Affordable homes for women over 55.",
    );
    await expect(landing.heroBadge).toHaveText("Open house every Saturday");
    await expect(landing.heroCta).toHaveText("Meet the board");
    await expect(landing.heroCta).toHaveAttribute("href", "/#board");
    await expect(landing.heroPhoto).toHaveAttribute("src", "/own/garden.svg");
    await expect(landing.heroPhoto).toHaveAttribute(
      "alt",
      "Neighbours planting tomatoes in the rooftop garden.",
    );
    await expect(landing.heroPhoto).toHaveAttribute("width", "800");
    await expect(landing.heroPhoto).toHaveAttribute("height", "600");
    await expect(landing.stats).toContainText("150");
    await expect(landing.stats).toContainText("homes in two buildings");
    await expect(landing.galleryCaptions.first()).toHaveText(
      "Tea and cake on Tuesdays",
    );
    await expect(landing.quote).toContainText("The best move I ever made.");
    await expect(landing.visitAction).toHaveText("Write to the office");
    await expect(landing.visitAction).toHaveAttribute(
      "href",
      "mailto:office@ownhousing.example",
    );
  });

  test("leaves out a block whose list is empty but keeps the notices message", async ({
    mockApi,
  }) => {
    const content = published(mockApi);
    homeSection(content, "glance").figures = [];
    homeSection(content, "gallery").photos = [];
    homeSection(content, "notices").emptyMessage = "Nothing on this week.";
    mockApi.store.documents = [];

    await landing.goto();

    await expect(landing.hero).toBeVisible();
    await expect(landing.stats).toHaveCount(0);
    await expect(landing.gallery).toHaveCount(0);
    await expect(landing.noticesEmpty).toHaveText("Nothing on this week.");
  });

  test("opens links to other websites safely in the same tab", async ({
    mockApi,
  }) => {
    published(mockApi).header.menuLinks.push({
      label: "City services",
      href: "https://example.test/services",
    });

    await landing.goto();

    const link = landing.navLink("City services");
    await expect(link).toHaveAttribute("href", "https://example.test/services");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await expect(link).not.toHaveAttribute("target", /.*/);
  });

  test("replaces a photo that cannot be loaded", async ({ mockApi }) => {
    homeSection(published(mockApi), "hero").photo = {
      src: "http://localhost:5000/api/digitalasset/serve/no-such-photo",
      alt: "A photo that was deleted.",
      width: 800,
      height: 600,
    };

    await landing.goto();

    await expect(landing.heroPhoto).toHaveAttribute(
      "src",
      /own\/photo-unavailable\.svg$/,
    );
    await expect(landing.heroPhoto).toHaveAttribute(
      "alt",
      "Photo not available",
    );
  });

  test("asks for the site content once for the whole page", async () => {
    const requests = landing.countSiteContentRequests();

    await landing.goto();
    await landing.expectLoaded();

    expect(requests()).toBe(1);
  });

  test("shows the built-in defaults when the site content cannot be loaded", async ({
    mockApi,
  }) => {
    mockApi.failing.add("GET site-content");

    await landing.goto();

    await expect(landing.brand).toContainText("OWN Housing Co-op");
    await expect(landing.heroTitle).toHaveText(
      "A home of our own, in the heart of Toronto.",
    );
    await expect(landing.heroPhoto).toHaveAttribute("src", /own\/hero\.svg$/);
    await expect(landing.footerPhone).toHaveAttribute("href", "tel:4165550142");
  });

  test("fills a value the published content lacks with its default", async ({
    mockApi,
  }) => {
    const hero = homeSection(published(mockApi), "hero");
    delete hero.badge;
    hero.title = "Come home to the co-op.";

    await landing.goto();

    await expect(landing.heroTitle).toHaveText("Come home to the co-op.");
    await expect(landing.heroBadge).toHaveText("Welcoming members since 1997");
  });

  test("shows the published header and footer on a website page", async ({
    mockApi,
    page,
  }) => {
    published(mockApi).header.siteName = "Maple Court Co-op";
    published(mockApi).footer.copyright = "© 2026 Maple Court Co-op.";
    const content = new ContentPage(page);

    await content.goto(mockApi.store.pages[0].slug);

    await expect(content.header).toContainText("Maple Court Co-op");
    await expect(content.footer).toContainText("© 2026 Maple Court Co-op.");
  });
});
