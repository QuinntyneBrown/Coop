import { Page, Locator, expect } from '@playwright/test';

/** The member app's phone bottom tab bar, fixed to the foot of the viewport. */
export class BottomTabBar {
  readonly page: Page;
  readonly bar: Locator;
  readonly documentsTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bar = page.locator('[data-testid="bottom-tab-bar"]');
    this.documentsTab = page.locator('[data-testid="tab-docs"]');
  }

  /** Taps the Documents tab where it shows; fails if anything is drawn over it. */
  async openDocuments() {
    await this.documentsTab.click({ timeout: 5000 });
    await this.page.waitForURL('**/documents');
  }

  /** Scrolls the page and its scrolling main region to the very end. */
  async scrollToEnd() {
    await this.page.evaluate(() => {
      for (const el of [document.scrollingElement, document.querySelector('main')]) {
        if (el) el.scrollTop = el.scrollHeight;
      }
    });
  }

  /** Expects the control to sit fully above the bar once the page is scrolled to its end. */
  async expectNotCovering(control: Locator) {
    await this.scrollToEnd();
    const barBox = await this.bar.boundingBox();
    const box = await control.boundingBox();
    expect(barBox, 'bottom tab bar is shown').not.toBeNull();
    expect(box, 'control is shown').not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(barBox!.y);
  }
}
