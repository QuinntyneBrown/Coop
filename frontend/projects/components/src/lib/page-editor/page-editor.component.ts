import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The page editor's three panes side by side from 64rem; tabs below.
 * Design system: `docs/design-system/components/section-list.html`.
 *
 * Usage: `<div libPageEditor><div libPageEditorTabs>…</div><section libPageEditorPane pane="sections">…</section>…</div>`
 */
@Component({
  selector: 'div[libPageEditor]',
  standalone: true,
  templateUrl: './page-editor.component.html',
  styleUrl: './page-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'page-editor',
  },
})
export class PageEditorComponent {}
