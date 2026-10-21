import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A toggle button drawn as a pill; `aria-pressed` shows the choice.
 * Design system: `docs/design-system/components/chip.html`.
 *
 * Usage: `<button libChip type="button" [attr.aria-pressed]="selected">Member</button>`
 */
@Component({
  selector: 'button[libChip]',
  standalone: true,
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'chip',
  },
})
export class ChipComponent {}
