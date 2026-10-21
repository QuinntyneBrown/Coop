import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The floating top bar of a screen outside the app shell.
 * Design system: `docs/design-system/components/top-bar.html`.
 *
 * Usage: `<header libTopBar>…</header>`
 */
@Component({
  selector: 'header[libTopBar]',
  standalone: true,
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'topbar',
  },
})
export class TopBarComponent {}
