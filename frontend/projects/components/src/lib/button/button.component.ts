import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonVariant } from './button-variant';
import { ButtonSize } from './button-size';

/**
 * A button, or a link or file-input label drawn as one. The host keeps its native role, type,
 * disabled state and router link.
 * Design system: `docs/design-system/components/button.html`.
 *
 * Usage: `<button libButton variant="primary" type="submit">Save</button>`
 */
@Component({
  selector: 'button[libButton], a[libButton], label[libButton]',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'btn',
    '[class.btn--primary]': "variant() === 'primary'",
    '[class.btn--danger]': "variant() === 'danger'",
    '[class.btn--ghost]': "variant() === 'ghost'",
    '[class.btn--sm]': "size() === 'sm'",
    '[class.btn--lg]': "size() === 'lg'",
    '[class.btn--block]': 'block()',
    '[class.btn--icon]': 'iconOnly()',
  },
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('secondary');
  readonly size = input<ButtonSize>('md');
  readonly block = input(false, { transform: booleanAttribute });
  readonly iconOnly = input(false, { transform: booleanAttribute });
}
