import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The text of an alert.
 * Design system: `docs/design-system/components/alert.html`.
 *
 * Usage: `<div libAlertBody>Saved.</div>`
 */
@Component({
  selector: 'div[libAlertBody]',
  standalone: true,
  templateUrl: './alert-body.component.html',
  styleUrl: './alert-body.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'alert__body',
  },
})
export class AlertBodyComponent {}
