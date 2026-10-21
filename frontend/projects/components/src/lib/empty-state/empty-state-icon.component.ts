import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The round icon of an empty state.
 * Design system: `docs/design-system/components/empty-state.html`.
 *
 * Usage: `<div libEmptyStateIcon aria-hidden="true"><svg libIcon="pages" size="lg"></svg></div>`
 */
@Component({
  selector: 'div[libEmptyStateIcon], span[libEmptyStateIcon]',
  standalone: true,
  templateUrl: './empty-state-icon.component.html',
  styleUrl: './empty-state-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'empty__icon',
  },
})
export class EmptyStateIconComponent {}
