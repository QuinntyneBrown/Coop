import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * One row of a list.
 * Design system: `docs/design-system/components/list.html`.
 *
 * Usage: `<li libListItem>…</li>`
 */
@Component({
  selector: 'li[libListItem], button[libListItem]',
  standalone: true,
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'list__item',
  },
})
export class ListItemComponent {}
