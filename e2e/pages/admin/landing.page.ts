import { type Locator, type Page } from '@playwright/test';

/**
 * The admin app's landing page (`/`), drawn in docs/mocks/pages/admin-landing/.
 * Owns every selector; tests only state intent.
 */
export class AdminLandingPage {
  readonly page: Page;

  readonly boardMembers: Locator;
  readonly boardMemberNames: Locator;
  readonly noticeDates: Locator;

  constructor(page: Page) {
    this.page = page;
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
