import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A label around a native checkbox and its text; the checkbox is drawn by the label's styles.
 * Design system: `docs/design-system/components/checkbox.html`.
 *
 * Usage: `<label libCheckbox><input type="checkbox" formControlName="ok" /><span libCheckboxText>I agree</span></label>`
 */
@Component({
  selector: 'label[libCheckbox]',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'checkbox',
  },
})
export class CheckboxComponent {}
