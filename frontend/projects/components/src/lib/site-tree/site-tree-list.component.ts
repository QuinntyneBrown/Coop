import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A list of site tree items; `nested` indents the pages under their group.
 * Design system: `docs/design-system/components/site-tree.html`.
 *
 * Usage: `<ul libSiteTreeList nested>…</ul>`
 */
@Component({
  selector: 'ul[libSiteTreeList]',
  standalone: true,
  templateUrl: './site-tree-list.component.html',
  styleUrl: './site-tree-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'site-tree__list',
    '[class.site-tree__list--nested]': 'nested()',
  },
})
export class SiteTreeListComponent {
  readonly nested = input(false, { transform: booleanAttribute });
}
