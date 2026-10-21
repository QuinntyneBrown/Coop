import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The logo and name in the top bar.
 * Design system: `docs/design-system/components/top-bar.html`.
 *
 * Usage: `<span libTopBarBrand><span libLogoMark></span>OWN Housing Co-op</span>`
 */
@Component({
  selector: 'span[libTopBarBrand]',
  standalone: true,
  templateUrl: './top-bar-brand.component.html',
  styleUrl: './top-bar-brand.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'topbar__brand',
  },
})
export class TopBarBrandComponent {}
