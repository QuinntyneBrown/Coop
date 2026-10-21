import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A `tablist` of tabs; `pill` draws them as a row of filter pills.
 * Design system: `docs/design-system/components/tabs.html`.
 *
 * Usage: `<div libTabs pill aria-label="Filter documents">…</div>`
 */
@Component({
  selector: 'div[libTabs]',
  standalone: true,
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tabs',
    role: 'tablist',
    '[class.tabs--pill]': 'pill()',
  },
})
export class TabsComponent {
  readonly pill = input(false, { transform: booleanAttribute });
}
