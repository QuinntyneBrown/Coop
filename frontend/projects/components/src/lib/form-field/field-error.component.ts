import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The error of a field, after a warning sign; the control names it in `aria-describedby`.
 * Design system: `docs/design-system/components/form-field.html`.
 *
 * Usage: `<p libFieldError id="x-error">Name is required</p>`
 */
@Component({
  selector: 'p[libFieldError]',
  standalone: true,
  templateUrl: './field-error.component.html',
  styleUrl: './field-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'field__error',
  },
})
export class FieldErrorComponent {}
