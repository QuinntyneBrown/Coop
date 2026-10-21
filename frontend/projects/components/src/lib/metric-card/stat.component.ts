import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A label over a large number.
 * Design system: `docs/design-system/components/metric-card.html`.
 *
 * Usage: `<span libStat><span libStatLabel>Documents</span><span libStatValue>12</span></span>`
 */
@Component({
  selector: 'span[libStat]',
  standalone: true,
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'stat',
  },
})
export class StatComponent {}
