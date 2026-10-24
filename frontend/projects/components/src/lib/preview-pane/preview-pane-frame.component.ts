import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The frame that shows the public website.
 * Design system: `docs/design-system/components/preview-pane.html`.
 *
 * Usage: `<iframe libPreviewPaneFrame [src]="url" title="Preview of the public website with your draft"></iframe>`
 */
@Component({
  selector: 'iframe[libPreviewPaneFrame]',
  standalone: true,
  templateUrl: './preview-pane-frame.component.html',
  styleUrl: './preview-pane-frame.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'preview-pane__frame',
  },
})
export class PreviewPaneFrameComponent {}
