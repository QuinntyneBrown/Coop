import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The text column of the linked summary: title, then the items or an empty sentence.
 * Design system: `docs/design-system/components/linked-summary.html`.
 *
 * Usage: `<div libLinkedSummaryText>…</div>`
 */
@Component({
  selector: 'div[libLinkedSummaryText]',
  standalone: true,
  templateUrl: './linked-summary-text.component.html',
  styleUrl: './linked-summary-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'linked-summary__text',
  },
})
export class LinkedSummaryTextComponent {}
