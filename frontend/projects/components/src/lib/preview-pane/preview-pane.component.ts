import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The page editor's preview of the public website rendering the draft, with a title, an Open in a new tab link, a
 * note and the frame.
 * Design system: `docs/design-system/components/preview-pane.html`.
 *
 * Usage: `<section libPreviewPane aria-labelledby="preview-title"><div libPreviewPaneHeader>…</div><p libPreviewPaneNote>…</p><iframe libPreviewPaneFrame [src]="url" title="…"></iframe></section>`
 */
@Component({
  selector: 'section[libPreviewPane]',
  standalone: true,
  templateUrl: './preview-pane.component.html',
  styleUrl: './preview-pane.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'preview-pane',
  },
})
export class PreviewPaneComponent {}
