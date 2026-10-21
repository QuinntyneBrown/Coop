import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A short muted status beside the thing it is about, such as "Uploading…".
 * Design system: `docs/design-system/components/inline-message.html`.
 *
 * Usage: `<p libInlineStatus role="status"><span libSpinner size="sm"></span>Uploading…</p>`
 */
@Component({
  selector: 'p[libInlineStatus]',
  standalone: true,
  templateUrl: './inline-status.component.html',
  styleUrl: './inline-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-status',
  },
})
export class InlineStatusComponent {}
