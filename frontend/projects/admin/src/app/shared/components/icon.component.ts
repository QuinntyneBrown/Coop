import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconName } from './icon-name';

/**
 * A decorative 2px-stroke icon from the design system's icon sheet
 * (docs/design-system/foundations/iconography.html). The visible text beside
 * it, or the button's aria-label, is the name.
 *
 * Usage: `<svg appIcon="add"></svg>`
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector -- the host must be the <svg> element itself
  selector: 'svg[appIcon]',
  standalone: true,
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    class: 'icon',
    'aria-hidden': 'true',
    focusable: 'false',
    viewBox: '0 0 24 24',
  },
})
export class IconComponent {
  readonly appIcon = input.required<IconName>();
}
