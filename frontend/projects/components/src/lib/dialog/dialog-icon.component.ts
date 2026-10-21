import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The decorative danger icon of a confirmation dialog.
 * Design system: `docs/design-system/components/dialog.html`.
 *
 * Usage: `<div libDialogIcon><svg libIcon="delete"></svg></div>`
 */
@Component({
  selector: 'div[libDialogIcon]',
  standalone: true,
  templateUrl: './dialog-icon.component.html',
  styleUrl: './dialog-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dialog__icon dialog__icon--danger',
    'aria-hidden': 'true',
  },
})
export class DialogIconComponent {}
