import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A label, its control, help and error, stacked.
 * Design system: `docs/design-system/components/form-field.html`.
 *
 * Usage: `<div libFormField><label libFieldLabel for="x">Name</label><input libTextField id="x" /></div>`
 */
@Component({
  selector: 'div[libFormField]',
  standalone: true,
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'field',
  },
})
export class FormFieldComponent {}
