import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A dashboard count with its icon, built on the card surface.
 * Design system: `docs/design-system/components/metric-card.html`.
 *
 * Usage: `<div libMetricCard><span libMetricCardIcon tone="info">…</span><span libStat>…</span></div>`
 */
@Component({
  selector: 'div[libMetricCard]',
  standalone: true,
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'card metric-card',
  },
})
export class MetricCardComponent {}
