import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The content of a dialog.
 * Design system: `docs/design-system/components/dialog.html`.
 *
 * Usage: `<div libDialogBody class="stack">…</div>`
 */
@Component({
  selector: 'div[libDialogBody]',
  standalone: true,
  templateUrl: './dialog-body.component.html',
  styleUrl: './dialog-body.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dialog__body',
  },
})
export class DialogBodyComponent {}
