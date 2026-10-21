import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MetricCardTone } from './metric-card-tone';

/**
 * The round, decorative icon of a metric card.
 * Design system: `docs/design-system/components/metric-card.html`.
 *
 * Usage: `<span libMetricCardIcon tone="warning"><svg libIcon="maintenance"></svg></span>`
 */
@Component({
  selector: 'span[libMetricCardIcon]',
  standalone: true,
  templateUrl: './metric-card-icon.component.html',
  styleUrl: './metric-card-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'metric-card__icon',
    'aria-hidden': 'true',
    '[class.metric-card__icon--warning]': "tone() === 'warning'",
    '[class.metric-card__icon--success]': "tone() === 'success'",
    '[class.metric-card__icon--info]': "tone() === 'info'",
  },
})
export class MetricCardIconComponent {
  readonly tone = input<MetricCardTone>('accent');
}
