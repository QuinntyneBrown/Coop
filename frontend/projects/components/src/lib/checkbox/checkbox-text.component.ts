import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The text of a checkbox.
 * Design system: `docs/design-system/components/checkbox.html`.
 *
 * Usage: `<span libCheckboxText>Remember me</span>`
 */
@Component({
  selector: 'span[libCheckboxText]',
  standalone: true,
  templateUrl: './checkbox-text.component.html',
  styleUrl: './checkbox-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'checkbox__text',
  },
})
export class CheckboxTextComponent {}
