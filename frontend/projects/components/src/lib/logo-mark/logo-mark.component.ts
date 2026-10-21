import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The co-op's app icon, drawn as its own rounded tile. It is decorative; the name beside it is
 * the text.
 * Design system: `docs/design-system/components/logo-mark.html`.
 *
 * Usage: `<span libLogoMark></span>`
 */
@Component({
  selector: 'span[libLogoMark]',
  standalone: true,
  templateUrl: './logo-mark.component.html',
  styleUrl: './logo-mark.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'logo-mark',
    'aria-hidden': 'true',
  },
})
export class LogoMarkComponent {}
