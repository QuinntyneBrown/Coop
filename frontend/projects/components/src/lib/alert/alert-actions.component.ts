import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The buttons or links of an alert.
 * Design system: `docs/design-system/components/alert.html`.
 *
 * Usage: `<div libAlertActions><button libButton size="sm">Try again</button></div>`
 */
@Component({
  selector: 'div[libAlertActions]',
  standalone: true,
  templateUrl: './alert-actions.component.html',
  styleUrl: './alert-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'alert__actions',
  },
})
export class AlertActionsComponent {}
