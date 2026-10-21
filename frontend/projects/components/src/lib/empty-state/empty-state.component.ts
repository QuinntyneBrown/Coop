import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * What to show when a list has nothing in it.
 * Design system: `docs/design-system/components/empty-state.html`.
 *
 * Usage: `<div libEmptyState>…</div>`
 */
@Component({
  selector: 'div[libEmptyState]',
  standalone: true,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'empty',
  },
})
export class EmptyStateComponent {}
