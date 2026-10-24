import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The "Pages" label over the nested list of pages; a label, not a link.
 * Design system: `docs/design-system/components/site-tree.html`.
 *
 * Usage: `<span libSiteTreeGroup><svg libIcon="pages"></svg>Pages</span>`
 */
@Component({
  selector: 'span[libSiteTreeGroup]',
  standalone: true,
  templateUrl: './site-tree-group.component.html',
  styleUrl: './site-tree-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'site-tree__group',
  },
})
export class SiteTreeGroupComponent {}
