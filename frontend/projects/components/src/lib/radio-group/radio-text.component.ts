import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The text of a radio option.
 * Design system: `docs/design-system/components/radio-group.html`.
 *
 * Usage: `<span libRadioText>Unit 1</span>`
 */
@Component({
  selector: 'span[libRadioText]',
  standalone: true,
  templateUrl: './radio-text.component.html',
  styleUrl: './radio-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'choice__text',
  },
})
export class RadioTextComponent {}
