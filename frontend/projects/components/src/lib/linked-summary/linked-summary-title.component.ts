import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * "What visitors will see:" and the count.
 * Design system: `docs/design-system/components/linked-summary.html`.
 *
 * Usage: `<span libLinkedSummaryTitle>What visitors will see: 3 published notices, newest first</span>`
 */
@Component({
  selector: 'span[libLinkedSummaryTitle]',
  standalone: true,
  templateUrl: './linked-summary-title.component.html',
  styleUrl: './linked-summary-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'linked-summary__title',
  },
})
export class LinkedSummaryTitleComponent {}
