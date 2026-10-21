import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The buttons of an empty state.
 * Design system: `docs/design-system/components/empty-state.html`.
 *
 * Usage: `<div libEmptyStateActions>…</div>`
 */
@Component({
  selector: 'div[libEmptyStateActions]',
  standalone: true,
  templateUrl: './empty-state-actions.component.html',
  styleUrl: './empty-state-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'empty__actions',
  },
})
export class EmptyStateActionsComponent {}
