import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * One item of the site tree; `aria-current="page"` marks the current one and `add` draws the
 * "Add a page" item in the accent colour.
 * Design system: `docs/design-system/components/site-tree.html`.
 *
 * Usage: `<a libSiteTreeLink routerLink="/website/home"><svg libIcon="home"></svg>Home</a>`
 */
@Component({
  selector: 'a[libSiteTreeLink]',
  standalone: true,
  templateUrl: './site-tree-link.component.html',
  styleUrl: './site-tree-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'site-tree__link',
    '[class.site-tree__link--add]': 'add()',
  },
})
export class SiteTreeLinkComponent {
  readonly add = input(false, { transform: booleanAttribute });
}
