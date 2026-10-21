import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconName } from './icon-name';
import { IconSize } from './icon-size';

/**
 * A decorative 2px-stroke icon from the design system's icon sheet. The visible text beside it,
 * or the button's aria-label, is the name.
 * Design system: `docs/design-system/foundations/iconography.html`.
 *
 * Usage: `<svg libIcon="add"></svg>`
 */
@Component({
  selector: 'svg[libIcon]',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'icon',
    'aria-hidden': 'true',
    focusable: 'false',
    viewBox: '0 0 24 24',
    '[class.icon--sm]': "size() === 'sm'",
    '[class.icon--lg]': "size() === 'lg'",
  },
})
export class IconComponent {
  readonly libIcon = input.required<IconName>();
  readonly size = input<IconSize>('md');
}
