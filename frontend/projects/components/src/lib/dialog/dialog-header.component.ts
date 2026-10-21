import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The title row of a dialog.
 * Design system: `docs/design-system/components/dialog.html`.
 *
 * Usage: `<div libDialogHeader><h2 libDialogTitle id="t">New page</h2></div>`
 */
@Component({
  selector: 'div[libDialogHeader]',
  standalone: true,
  templateUrl: './dialog-header.component.html',
  styleUrl: './dialog-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dialog__header',
  },
})
export class DialogHeaderComponent {}
