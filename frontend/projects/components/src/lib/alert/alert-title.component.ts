import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The first, bold line of an alert.
 * Design system: `docs/design-system/components/alert.html`.
 *
 * Usage: `<p libAlertTitle>Something needs attention.</p>`
 */
@Component({
  selector: 'p[libAlertTitle]',
  standalone: true,
  templateUrl: './alert-title.component.html',
  styleUrl: './alert-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'alert__title',
  },
})
export class AlertTitleComponent {}
