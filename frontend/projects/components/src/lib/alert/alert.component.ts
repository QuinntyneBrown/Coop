import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AlertTone } from './alert-tone';

/**
 * A message in the page about what just happened or what needs attention. The app sets
 * `role="alert"` or puts it in a live region.
 * Design system: `docs/design-system/components/alert.html`.
 *
 * Usage: `<div libAlert tone="danger" role="alert"><svg libIcon="error"></svg><div libAlertBody>…</div></div>`
 */
@Component({
  selector: 'div[libAlert]',
  standalone: true,
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'alert',
    '[class.alert--success]': "tone() === 'success'",
    '[class.alert--danger]': "tone() === 'danger'",
  },
})
export class AlertComponent {
  readonly tone = input.required<AlertTone>();
}
