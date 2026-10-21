import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SpinnerSize } from './spinner-size';

/**
 * A decorative spinning ring; the text beside it says what is loading.
 * Design system: `docs/design-system/components/spinner.html`.
 *
 * Usage: `<span libSpinner></span>Loading pages…`
 */
@Component({
  selector: 'span[libSpinner]',
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'spinner',
    'aria-hidden': 'true',
    '[class.spinner--sm]': "size() === 'sm'",
  },
})
export class SpinnerComponent {
  readonly size = input<SpinnerSize>('md');
}
