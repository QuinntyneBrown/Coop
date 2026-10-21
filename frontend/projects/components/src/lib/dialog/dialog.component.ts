import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A native modal `<dialog>`, opened with `showModal()`: a bottom sheet on phones and a centred
 * panel from 40rem.
 * Design system: `docs/design-system/components/dialog.html`.
 *
 * Usage: `<dialog libDialog #dialog aria-labelledby="t"><div libDialogPanel>…</div></dialog>`
 */
@Component({
  selector: 'dialog[libDialog]',
  standalone: true,
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dialog',
  },
})
export class DialogComponent {}
