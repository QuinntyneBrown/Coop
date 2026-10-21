import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The first link on a screen, shown on focus, that jumps to the main content.
 * Design system: `docs/design-system/components/skip-link.html`.
 *
 * Usage: `<a libSkipLink href="#main">Skip to content</a>`
 */
@Component({
  selector: 'a[libSkipLink]',
  standalone: true,
  templateUrl: './skip-link.component.html',
  styleUrl: './skip-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'skip-link',
  },
})
export class SkipLinkComponent {}
