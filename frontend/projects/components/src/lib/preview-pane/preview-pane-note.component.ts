import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The note under the preview pane's title.
 * Design system: `docs/design-system/components/preview-pane.html`.
 *
 * Usage: `<p libPreviewPaneNote>Shows your draft, scrolled to the section you are editing. Visitors see the published website.</p>`
 */
@Component({
  selector: 'p[libPreviewPaneNote]',
  standalone: true,
  templateUrl: './preview-pane-note.component.html',
  styleUrl: './preview-pane-note.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'preview-pane__note',
  },
})
export class PreviewPaneNoteComponent {}
