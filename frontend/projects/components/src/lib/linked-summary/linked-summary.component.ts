import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * What the visitor will see in a section whose items are kept on another screen, with a Manage link.
 * Design system: `docs/design-system/components/linked-summary.html`.
 *
 * Usage: `<div libLinkedSummary><div libLinkedSummaryText>…</div><a libButton href="/documents">Manage notices</a></div>`
 */
@Component({
  selector: 'div[libLinkedSummary]',
  standalone: true,
  templateUrl: './linked-summary.component.html',
  styleUrl: './linked-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'linked-summary',
  },
})
export class LinkedSummaryComponent {}
