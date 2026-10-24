import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The Sections, Edit and Preview tabs shown below 64rem (and at 400% zoom); holds the tablist.
 * Design system: `docs/design-system/components/section-list.html`.
 *
 * Usage: `<div libPageEditorTabs><div libTabs aria-label="Editor panes">…</div></div>`
 */
@Component({
  selector: 'div[libPageEditorTabs]',
  standalone: true,
  templateUrl: './page-editor-tabs.component.html',
  styleUrl: './page-editor-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'page-editor__tabs',
  },
})
export class PageEditorTabsComponent {}
