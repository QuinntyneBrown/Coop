import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The heading that names the dialog through `aria-labelledby`.
 * Design system: `docs/design-system/components/dialog.html`.
 *
 * Usage: `<h2 libDialogTitle id="t">New page</h2>`
 */
@Component({
  selector: 'h2[libDialogTitle]',
  standalone: true,
  templateUrl: './dialog-title.component.html',
  styleUrl: './dialog-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dialog__title',
  },
})
export class DialogTitleComponent {}
