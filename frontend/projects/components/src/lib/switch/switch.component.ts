import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A label around a native `role="switch"` checkbox drawn as a toggle.
 * Design system: `docs/design-system/components/switch.html`.
 *
 * Usage: `<label libSwitch><input type="checkbox" role="switch" /></label>`
 */
@Component({
  selector: 'label[libSwitch]',
  standalone: true,
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'switch',
  },
})
export class SwitchComponent {}
