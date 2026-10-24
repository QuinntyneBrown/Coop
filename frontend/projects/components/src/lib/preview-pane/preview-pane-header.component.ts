import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The title row of the preview pane.
 * Design system: `docs/design-system/components/preview-pane.html`.
 *
 * Usage: `<div libPreviewPaneHeader><h2 libPreviewPaneTitle>…</h2><a libButton size="sm" target="_blank">Open in a new tab</a></div>`
 */
@Component({
  selector: 'div[libPreviewPaneHeader]',
  standalone: true,
  templateUrl: './preview-pane-header.component.html',
  styleUrl: './preview-pane-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'preview-pane__header',
  },
})
export class PreviewPaneHeaderComponent {}
