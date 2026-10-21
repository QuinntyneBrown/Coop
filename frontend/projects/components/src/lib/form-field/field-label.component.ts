import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The label of a field; an `<span class="optional">` inside it is muted.
 * Design system: `docs/design-system/components/form-field.html`.
 *
 * Usage: `<label libFieldLabel for="x">Name</label>`
 */
@Component({
  selector: 'label[libFieldLabel], legend[libFieldLabel]',
  standalone: true,
  templateUrl: './field-label.component.html',
  styleUrl: './field-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'field__label',
  },
})
export class FieldLabelComponent {}
