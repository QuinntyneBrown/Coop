import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The Website area's navigation in the shape of the public site: Home, Pages, Menu and footer,
 * Board of directors, Photos, Look. `cards` draws taller rows for the Website landing.
 * Design system: `docs/design-system/components/site-tree.html`.
 *
 * Usage: `<nav libSiteTree aria-label="Website"><ul libSiteTreeList>…</ul></nav>`
 */
@Component({
  selector: 'nav[libSiteTree]',
  standalone: true,
  templateUrl: './site-tree.component.html',
  styleUrl: './site-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'site-tree',
    '[class.site-tree--cards]': 'cards()',
  },
})
export class SiteTreeComponent {
  readonly cards = input(false, { transform: booleanAttribute });
}
