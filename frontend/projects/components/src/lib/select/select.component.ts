import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A native select with the system's chevron. Angular forms bind to the host select as usual.
 * Design system: `docs/design-system/components/select.html`.
 *
 * Usage: `<select libSelect id="x" formControlName="role">…</select>`
 */
@Component({
  selector: 'select[libSelect]',
  standalone: true,
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'select',
  },
})
export class SelectComponent {}
