import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A label around a native radio button and its text, one option of a fieldset.
 * Design system: `docs/design-system/components/radio-group.html`.
 *
 * Usage: `<label libRadio><input type="radio" name="unit" /><span libRadioText>Unit 1</span></label>`
 */
@Component({
  selector: 'label[libRadio]',
  standalone: true,
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'choice',
  },
})
export class RadioComponent {}
