import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The start of a block's text in its card.
 * Design system: `docs/design-system/components/block-card.html`.
 *
 * Usage: `<p libBlockCardPreview>Send the form to the office…</p>`
 */
@Component({
  selector: 'p[libBlockCardPreview]',
  standalone: true,
  templateUrl: './block-card-preview.component.html',
  styleUrl: './block-card-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block-card__preview',
  },
})
export class BlockCardPreviewComponent {}
