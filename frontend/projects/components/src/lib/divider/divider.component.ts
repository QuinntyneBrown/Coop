import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * An unlabelled rule between two parts of a panel.
 * Design system: `docs/design-system/components/divider.html`.
 *
 * Usage: `<hr libDivider />`
 */
@Component({
  selector: 'hr[libDivider]',
  standalone: true,
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'divider divider--rule',
  },
})
export class DividerComponent {}
