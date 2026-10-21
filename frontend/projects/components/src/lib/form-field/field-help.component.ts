import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Help text for a field; the control names it in `aria-describedby`.
 * Design system: `docs/design-system/components/form-field.html`.
 *
 * Usage: `<p libFieldHelp id="x-help">…</p>`
 */
@Component({
  selector: 'p[libFieldHelp]',
  standalone: true,
  templateUrl: './field-help.component.html',
  styleUrl: './field-help.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'field__help',
  },
})
export class FieldHelpComponent {}
