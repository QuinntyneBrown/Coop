import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The kind of a block in its card, with its icon.
 * Design system: `docs/design-system/components/block-card.html`.
 *
 * Usage: `<span libBlockCardKind><svg libIcon="paragraph" size="sm"></svg>Paragraph</span>`
 */
@Component({
  selector: 'span[libBlockCardKind]',
  standalone: true,
  templateUrl: './block-card-kind.component.html',
  styleUrl: './block-card-kind.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block-card__kind',
  },
})
export class BlockCardKindComponent {}
