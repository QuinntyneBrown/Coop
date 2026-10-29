import { type Locator, type Page, expect } from "@playwright/test";

/**
 * The public home page (`/`), drawn in docs/mocks/pages/public-landing/.
 * Owns every selector; tests only state intent.
 */
export class LandingPage {
  readonly page: Page;

  // Header and phone menu
  readonly header: Locator;
  readonly brand: Locator;
  readonly nav: Locator;
  readonly signInLink: Locator;
  readonly menuButton: Locator;
  readonly menu: Locator;
  readonly menuLinks: Locator;
  readonly menuSignInLink: Locator;
  readonly menuVisitLink: Locator;
  readonly navPageLinks: Locator;
  readonly menuPageLinks: Locator;
  readonly skipLink: Locator;
  readonly languageButton: Locator;
  readonly languageStatus: Locator;

  // Hero
  readonly hero: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly heroCta: Locator;
  readonly heroSecondaryCta: Locator;
  readonly heroPhoto: Locator;
  readonly heroEyebrow: Locator;
  readonly heroBadge: Locator;

  // Body blocks
  readonly stats: Locator;
  readonly about: Locator;
  readonly gallery: Locator;
  readonly galleryPhotos: Locator;
  readonly galleryCaptions: Locator;
  readonly features: Locator;
  readonly quote: Locator;
  readonly visit: Locator;
  readonly visitPhone: Locator;
  readonly visitAction: Locator;

  // Notices ("What's on")
  readonly noticesSection: Locator;
  readonly noticeCards: Locator;
  readonly noticesEmpty: Locator;

  // Board
  readonly boardSection: Locator;
  readonly boardMembers: Locator;

  // Footer
  readonly previewBanner: Locator;
  /** The home page sections, in the order they render. */
  readonly sections: Locator;

  readonly footer: Locator;
  readonly footerPhone: Locator;
  readonly footerEmail: Locator;
  readonly footerCopyright: Locator;

  constructor(page: Page) {
    this.page = page;

    // The header and footer are shared with the website pages (site-header, site-footer).
    this.header = page.getByTestId("site-header");
    this.brand = page.getByTestId("site-brand");
    this.nav = page.getByTestId("site-nav");
    this.signInLink = page.getByTestId("site-signin-link");
    this.menuButton = page.getByTestId("site-menu-button");
    this.menu = page.getByTestId("site-menu");
    this.menuLinks = this.menu.getByTestId("site-menu-link");
    this.menuSignInLink = page.getByTestId("site-menu-signin-link");
    this.menuVisitLink = page.getByTestId("site-menu-visit-link");
    this.navPageLinks = this.nav.getByTestId("site-nav-page-link");
    this.menuPageLinks = this.menu.getByTestId("site-menu-page-link");
    this.skipLink = page.locator(".own-skip");
    this.languageButton = page.getByTestId("site-language-button");
    this.languageStatus = page.getByTestId("site-language-status");

    this.hero = page.getByTestId("landing-hero");
    this.heroTitle = page.getByTestId("landing-hero-title");
    this.heroSubtitle = page.getByTestId("landing-hero-subtitle");
    this.heroCta = page.getByTestId("landing-hero-cta");
    this.heroSecondaryCta = page.getByTestId("landing-hero-secondary-cta");
    this.heroPhoto = page.getByTestId("landing-hero-photo");
    this.heroEyebrow = page.getByTestId("landing-hero-eyebrow");
    this.heroBadge = page.getByTestId("landing-hero-badge");

    this.stats = page.getByTestId("landing-stats");
    this.about = page.getByTestId("landing-about");
    this.gallery = page.getByTestId("landing-gallery");
    this.galleryPhotos = this.gallery.getByRole("img");
    this.galleryCaptions = this.gallery.locator("figcaption");
    this.features = page.getByTestId("landing-features");
    this.quote = page.getByTestId("landing-quote");
    this.visit = page.getByTestId("landing-visit");
    this.visitPhone = page.getByTestId("landing-visit-phone");
    this.visitAction = page.getByTestId("landing-visit-action");

    this.noticesSection = page.getByTestId("landing-notices-section");
    this.noticeCards = page.getByTestId("landing-notice-card");
    this.noticesEmpty = page.getByTestId("landing-notices-empty");

    this.boardSection = page.getByTestId("landing-board-section");
    this.boardMembers = page.getByTestId("landing-board-member");

    this.previewBanner = page.getByTestId("preview-banner");
    this.sections = page.locator("main > section");

    this.footer = page.getByTestId("site-footer");
    this.footerPhone = page.getByTestId("site-footer-phone");
    this.footerEmail = page.getByTestId("site-footer-email");
    this.footerCopyright = page.getByTestId("site-footer-copyright");
  }

  async goto(search = "") {
    await this.page.goto(`/${search}`);
    // CMS content renders after the mocked API responds; wait for requests to settle.
    await this.page.waitForLoadState("networkidle");
  }

  /** The ids of the rendered sections, in order; "" for one without an id. */
  async sectionIds(): Promise<string[]> {
    return this.sections.evaluateAll((sections) => sections.map((s) => s.id));
  }

  async expectLoaded() {
    await expect(this.hero).toBeVisible();
    await expect(this.heroTitle).toBeVisible();
  }

  async expectBoardSectionVisible() {
    await expect(this.boardSection).toBeVisible();
    await expect(this.boardMembers.first()).toBeVisible();
  }

  async expectNoticesVisible() {
    await expect(this.noticesSection).toBeVisible();
  }

  /** A link anywhere in the header by its visible name. */
  navLink(name: string): Locator {
    return this.nav.getByRole("link", { name, exact: true });
  }

  footerLink(name: string): Locator {
    return this.footer.getByRole("link", { name, exact: true });
  }

  footerHeading(name: string): Locator {
    return this.footer.getByRole("heading", { name, exact: true });
  }

  /** Counts the requests the page makes for the site content while it loads. */
  countSiteContentRequests(): () => number {
    let count = 0;
    this.page.on("request", (request) => {
      if (new URL(request.url()).pathname === "/api/site-content") count++;
    });
    return () => count;
  }

  boardMember(name: string): Locator {
    return this.boardMembers.filter({ hasText: name });
  }

  noticeCard(title: string): Locator {
    return this.noticeCards.filter({ hasText: title });
  }

  /** Moves keyboard focus with Tab, as a visitor would, until the link has it. */
  async tabTo(link: Locator, maxPresses = 40) {
    for (let i = 0; i < maxPresses; i++) {
      await this.page.keyboard.press("Tab");
      if (await link.evaluate((el) => el === document.activeElement)) return;
    }
    throw new Error(
      `Could not reach the link with Tab in ${maxPresses} presses`,
    );
  }

  /** The outline style the focused element draws, e.g. "solid" for the focus ring. */
  async focusOutline(link: Locator): Promise<string> {
    return link.evaluate((el) => getComputedStyle(el).outlineStyle);
  }

  /** The language the page says it is in, from `<html lang>`. */
  htmlLang(): Promise<string | null> {
    return this.page.locator("html").getAttribute("lang");
  }

  async openMenu() {
    await this.menuButton.click();
    await expect(this.menu).toBeVisible();
  }

  async closeMenuWithEscape() {
    await this.page.keyboard.press("Escape");
  }

  /** True when the document is wider than the viewport, i.e. horizontal scrolling is possible. */
  async hasHorizontalScroll(): Promise<boolean> {
    return this.page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
  }
}
