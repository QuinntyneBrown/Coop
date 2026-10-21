import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * One `tab`; the app sets `aria-selected` and `aria-controls`.
 * Design system: `docs/design-system/components/tabs.html`.
 *
 * Usage: `<button libTab type="button" [attr.aria-selected]="active">Details</button>`
 */
@Component({
  selector: 'button[libTab]',
  standalone: true,
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tabs__tab',
    role: 'tab',
  },
})
export class TabComponent {}
