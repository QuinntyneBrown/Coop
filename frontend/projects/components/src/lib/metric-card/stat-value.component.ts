import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The number of a stat.
 * Design system: `docs/design-system/components/metric-card.html`.
 *
 * Usage: `<span libStatValue>12</span>`
 */
@Component({
  selector: 'span[libStatValue]',
  standalone: true,
  templateUrl: './stat-value.component.html',
  styleUrl: './stat-value.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'stat__value',
  },
})
export class StatValueComponent {}
