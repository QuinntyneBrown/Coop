import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A one-line text input. Angular forms bind to the host input as usual.
 * Design system: `docs/design-system/components/text-field.html`.
 *
 * Usage: `<input libTextField id="x" type="text" formControlName="name" />`
 */
@Component({
  selector: 'input[libTextField]',
  standalone: true,
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'input',
  },
})
export class TextFieldComponent {}
