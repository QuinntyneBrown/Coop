import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The buttons of a dialog, kept in view at the bottom.
 * Design system: `docs/design-system/components/dialog.html`.
 *
 * Usage: `<div libDialogFooter><button libButton type="button">Cancel</button></div>`
 */
@Component({
  selector: 'div[libDialogFooter]',
  standalone: true,
  templateUrl: './dialog-footer.component.html',
  styleUrl: './dialog-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dialog__footer',
  },
})
export class DialogFooterComponent {}
