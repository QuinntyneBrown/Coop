import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The `tabpanel` a tab controls.
 * Design system: `docs/design-system/components/tabs.html`.
 *
 * Usage: `<div libTabPanel id="panel" aria-labelledby="tab">…</div>`
 */
@Component({
  selector: 'div[libTabPanel]',
  standalone: true,
  templateUrl: './tab-panel.component.html',
  styleUrl: './tab-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tabs__panel',
    role: 'tabpanel',
  },
})
export class TabPanelComponent {}
