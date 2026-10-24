import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PageEditorPaneKind } from './page-editor-pane-kind';

/**
 * One pane of the page editor: `sections`, `form` or `preview`. Below 64rem the app hides the
 * panes that are not the chosen tab with `hidden`; from 64rem all three show and the sections and
 * preview stick while the form scrolls.
 * Design system: `docs/design-system/components/section-list.html`.
 *
 * Usage: `<section libPageEditorPane pane="sections" role="tabpanel" [hidden]="tab() !== 'sections'">…</section>`
 */
@Component({
  selector: 'section[libPageEditorPane], div[libPageEditorPane]',
  standalone: true,
  templateUrl: './page-editor-pane.component.html',
  styleUrl: './page-editor-pane.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'page-editor__pane',
    '[class.page-editor__pane--sections]': "pane() === 'sections'",
    '[class.page-editor__pane--form]': "pane() === 'form'",
    '[class.page-editor__pane--preview]': "pane() === 'preview'",
  },
})
export class PageEditorPaneComponent {
  readonly pane = input.required<PageEditorPaneKind>();
}
