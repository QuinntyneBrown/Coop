import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The title of the preview pane, with its icon.
 * Design system: `docs/design-system/components/preview-pane.html`.
 *
 * Usage: `<h2 libPreviewPaneTitle id="preview-title"><svg libIcon="show"></svg>Preview</h2>`
 */
@Component({
  selector: 'h2[libPreviewPaneTitle]',
  standalone: true,
  templateUrl: './preview-pane-title.component.html',
  styleUrl: './preview-pane-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'preview-pane__title',
  },
})
export class PreviewPaneTitleComponent {}
