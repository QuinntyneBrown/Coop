import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The panel inside a dialog; a form when the dialog submits.
 * Design system: `docs/design-system/components/dialog.html`.
 *
 * Usage: `<form libDialogPanel (ngSubmit)="save()">…</form>`
 */
@Component({
  selector: 'div[libDialogPanel], form[libDialogPanel]',
  standalone: true,
  templateUrl: './dialog-panel.component.html',
  styleUrl: './dialog-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dialog__panel',
  },
})
export class DialogPanelComponent {}
