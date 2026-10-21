import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A muted second line of a list row.
 * Design system: `docs/design-system/components/list.html`.
 *
 * Usage: `<div libListMeta>Oct 20, 2026</div>`
 */
@Component({
  selector: 'div[libListMeta], span[libListMeta], p[libListMeta]',
  standalone: true,
  templateUrl: './list-meta.component.html',
  styleUrl: './list-meta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'list__meta',
  },
})
export class ListMetaComponent {}
