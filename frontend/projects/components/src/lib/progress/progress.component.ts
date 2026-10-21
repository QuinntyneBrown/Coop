import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A determinate progress bar. The host is the `progressbar`; the app gives it a name.
 * Design system: `docs/design-system/components/progress.html`.
 *
 * Usage: `<div libProgress [value]="42" aria-label="Upload progress"></div>`
 */
@Component({
  selector: 'div[libProgress]',
  standalone: true,
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'progress',
    role: 'progressbar',
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    '[attr.aria-valuenow]': 'value()',
  },
})
export class ProgressComponent {
  readonly value = input.required<number>();
}
