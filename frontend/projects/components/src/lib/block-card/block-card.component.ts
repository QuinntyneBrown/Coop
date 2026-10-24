import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A card that shows one block of a page body in the editor: its kind and the start of its text.
 * Design system: `docs/design-system/components/block-card.html`.
 *
 * Usage: `<article libBlockCard><span libBlockCardKind>…Paragraph</span><p libBlockCardPreview>…</p></article>`
 */
@Component({
  selector: 'article[libBlockCard]',
  standalone: true,
  templateUrl: './block-card.component.html',
  styleUrl: './block-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'card block-card',
  },
})
export class BlockCardComponent {}
