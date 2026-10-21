import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A surface that groups related content.
 * Design system: `docs/design-system/components/card.html`.
 *
 * Usage: `<section libCard flush>…</section>`
 */
@Component({
  selector: 'div[libCard], section[libCard], article[libCard], form[libCard], fieldset[libCard]',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'card',
    '[class.card--flush]': 'flush()',
  },
})
export class CardComponent {
  readonly flush = input(false, { transform: booleanAttribute });
}
