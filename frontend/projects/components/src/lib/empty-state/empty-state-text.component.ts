import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The explanation of an empty state.
 * Design system: `docs/design-system/components/empty-state.html`.
 *
 * Usage: `<p libEmptyStateText>…</p>`
 */
@Component({
  selector: 'p[libEmptyStateText]',
  standalone: true,
  templateUrl: './empty-state-text.component.html',
  styleUrl: './empty-state-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'empty__text',
  },
})
export class EmptyStateTextComponent {}
