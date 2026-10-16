import { type Locator, type Page } from '@playwright/test';

/**
 * The admin app's landing page (`/`), drawn in docs/mocks/pages/admin-landing/.
 * Owns every selector; tests only state intent.
 */
export class AdminLandingPage {
  readonly page: Page;

  readonly brand: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly boardMembers: Locator;
  readonly boardMemberNames: Locator;
  readonly noticeDates: Locator;

  constructor(page: Page) {
    this.page = page;
    this.brand = page.getByTestId('landing-navbar');
    this.heroTitle = page.getByTestId('landing-hero-title');
    this.heroSubtitle = page.getByTestId('landing-hero-subtitle');
    this.boardMembers = page.getByTestId('landing-board-member');
    this.boardMemberNames = this.boardMembers.getByRole('heading');
    this.noticeDates = page.getByTestId('landing-notice-card').locator('.notice-date');
  }

  async goto() {
    await this.page.goto('/');
  }

  boardMember(name: string): Locator {
    return this.boardMembers.filter({ has: this.page.getByRole('heading', { name }) });
  }
}
