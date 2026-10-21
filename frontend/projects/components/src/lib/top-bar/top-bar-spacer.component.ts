import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Pushes the rest of the top bar to the end.
 * Design system: `docs/design-system/components/top-bar.html`.
 *
 * Usage: `<span libTopBarSpacer></span>`
 */
@Component({
  selector: 'span[libTopBarSpacer]',
  standalone: true,
  templateUrl: './top-bar-spacer.component.html',
  styleUrl: './top-bar-spacer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'topbar__spacer',
  },
})
export class TopBarSpacerComponent {}
