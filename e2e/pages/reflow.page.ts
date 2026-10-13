import { type Page, expect } from '@playwright/test';

/** Width of a 1280 CSS px window at 400% browser zoom (WCAG 1.4.10 Reflow). */
export const REFLOW_WIDTH = 320;

/** A control that sticks out past the left or right edge of the viewport. */
export interface ClippedControl {
  control: string;
  left: number;
  right: number;
}

/**
 * Checks any screen at 400% zoom: the document must be no wider than the
 * viewport, and every visible control must sit inside it so it can be read
 * and used without scrolling the page sideways. A data table may scroll
 * inside its own region that fits the viewport.
 */
export class ReflowPage {
  constructor(readonly page: Page) {}

  async open(path: string) {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  async documentOverflow(): Promise<number> {
    return this.page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
  }

  async clippedControls(): Promise<ClippedControl[]> {
    return this.page.evaluate(() => {
      const width = document.documentElement.clientWidth;
      const controls = document.querySelectorAll<HTMLElement>(
        'a[href], button, input:not([type="hidden"]), select, textarea, [role="button"], [role="tab"]',
      );
      const clipped: { control: string; left: number; right: number }[] = [];
      const inScrollRegion = (el: HTMLElement) => {
        for (let parent = el.parentElement; parent; parent = parent.parentElement) {
          const overflowX = getComputedStyle(parent).overflowX;
          if (overflowX === 'auto' || overflowX === 'scroll') {
            const region = parent.getBoundingClientRect();
            return region.left >= -1 && region.right <= width + 1;
          }
        }
        return false;
      };
      for (const el of Array.from(controls)) {
        const style = getComputedStyle(el);
        const box = el.getBoundingClientRect();
        if (style.visibility === 'hidden' || style.display === 'none' || box.width === 0 || box.height === 0) continue;
        // A file input is often stretched invisibly over its styled label.
        if (el instanceof HTMLInputElement && el.type === 'file' && style.opacity === '0') continue;
        // A wide data table may scroll inside its own region (allowed by 1.4.10).
        if (el.closest('table') && inScrollRegion(el)) continue;
        if (box.left < -1 || box.right > width + 1) {
          const name = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('placeholder') || '').trim();
          clipped.push({
            control: `${el.tagName.toLowerCase()} "${name.slice(0, 40)}"`,
            left: Math.round(box.left),
            right: Math.round(box.right),
          });
        }
      }
      return clipped;
    });
  }

  async expectReflows() {
    expect(await this.documentOverflow(), 'document is wider than the viewport').toBeLessThanOrEqual(0);
    expect(await this.clippedControls(), 'controls outside the viewport').toEqual([]);
  }
}
