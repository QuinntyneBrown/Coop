import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The label of a stat.
 * Design system: `docs/design-system/components/metric-card.html`.
 *
 * Usage: `<span libStatLabel>Documents</span>`
 */
@Component({
  selector: 'span[libStatLabel]',
  standalone: true,
  templateUrl: './stat-label.component.html',
  styleUrl: './stat-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'stat__label',
  },
})
export class StatLabelComponent {}
