import { Locator } from '@playwright/test';

/**
 * WCAG contrast ratio of an element's text against the first opaque
 * background behind it, taking colour alpha and element opacity into account.
 */
export async function textContrast(text: Locator): Promise<number> {
  return text.evaluate((el) => {
    const parse = (c: string) => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return [0, 0, 0, 0];
      const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
      return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
    };
    let bg: number[] = [255, 255, 255];
    for (let n: Element | null = el; n; n = n.parentElement) {
      const b = parse(getComputedStyle(n).backgroundColor);
      if (b[3] >= 1) {
        bg = b.slice(0, 3);
        break;
      }
    }
    let alpha = 1;
    for (let n: Element | null = el; n; n = n.parentElement) alpha *= Number(getComputedStyle(n).opacity);
    const fg = parse(getComputedStyle(el).color);
    alpha *= fg[3];
    const mixed = fg.slice(0, 3).map((v, i) => v * alpha + bg[i] * (1 - alpha));
    const lum = (rgb: number[]) => {
      const [r, g, b] = rgb.map((v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const [hi, lo] = [lum(mixed), lum(bg)].sort((a, b) => b - a);
    return (hi + 0.05) / (lo + 0.05);
  });
}
