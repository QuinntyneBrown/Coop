import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The heading of an empty state.
 * Design system: `docs/design-system/components/empty-state.html`.
 *
 * Usage: `<h2 libEmptyStateTitle>No pages yet</h2>`
 */
@Component({
  selector: 'h2[libEmptyStateTitle]',
  standalone: true,
  templateUrl: './empty-state-title.component.html',
  styleUrl: './empty-state-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'empty__title',
  },
})
export class EmptyStateTitleComponent {}
