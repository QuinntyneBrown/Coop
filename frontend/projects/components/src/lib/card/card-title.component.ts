import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The heading of a card.
 * Design system: `docs/design-system/components/card.html`.
 *
 * Usage: `<h2 libCardTitle>Quick Actions</h2>`
 */
@Component({
  selector: 'h2[libCardTitle], h3[libCardTitle]',
  standalone: true,
  templateUrl: './card-title.component.html',
  styleUrl: './card-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'card__title',
  },
})
export class CardTitleComponent {}
