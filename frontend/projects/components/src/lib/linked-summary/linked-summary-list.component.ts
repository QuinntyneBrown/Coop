import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The first items as the public page orders them.
 * Design system: `docs/design-system/components/linked-summary.html`.
 *
 * Usage: `<ul libLinkedSummaryList><li>Courtyard gathering · 18 October 2026</li></ul>`
 */
@Component({
  selector: 'ul[libLinkedSummaryList]',
  standalone: true,
  templateUrl: './linked-summary-list.component.html',
  styleUrl: './linked-summary-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'linked-summary__list',
  },
})
export class LinkedSummaryListComponent {}
