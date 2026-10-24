import { type Locator, type Page } from '@playwright/test';

/** Where an element sits on the page, in CSS px. */
export interface Box {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * The admin app's landing page (`/`), drawn in docs/mocks/pages/admin-landing/.
 * Owns every selector; tests only state intent.
 */
export class AdminLandingPage {
  readonly page: Page;

  readonly brand: Locator;
  readonly siteName: Locator;
  readonly signInLink: Locator;
  readonly registerLink: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly boardMembers: Locator;
  readonly boardMemberNames: Locator;
  readonly noticeDates: Locator;

  constructor(page: Page) {
    this.page = page;
    this.brand = page.getByTestId('landing-navbar');
    this.siteName = this.brand.locator('.topbar__brand');
    this.signInLink = page.getByTestId('landing-login-link');
    this.registerLink = page.getByTestId('landing-register-link');
    this.heroTitle = page.getByTestId('landing-hero-title');
    this.heroSubtitle = page.getByTestId('landing-hero-subtitle');
    this.boardMembers = page.getByTestId('landing-board-member');
    this.boardMemberNames = this.boardMembers.getByRole('heading');
    this.noticeDates = page.getByTestId('landing-notice-date');
  }

  async goto() {
    await this.page.goto('/');
  }

  /** The boxes of the header, its site name, "Sign In" and "Register". */
  async headerBoxes(): Promise<Record<'header' | 'siteName' | 'signIn' | 'register', Box>> {
    const box = async (locator: Locator): Promise<Box> => {
      const b = await locator.boundingBox();
      if (!b) throw new Error('not rendered');
      return { top: b.y, bottom: b.y + b.height, left: b.x, right: b.x + b.width };
    };
    return {
      header: await box(this.brand),
      siteName: await box(this.siteName),
      signIn: await box(this.signInLink),
      register: await box(this.registerLink),
    };
  }

  boardMember(name: string): Locator {
    return this.boardMembers.filter({ has: this.page.getByRole('heading', { name }) });
  }
}
