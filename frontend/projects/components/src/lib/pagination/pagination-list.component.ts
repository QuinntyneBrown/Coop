import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The list of page buttons.
 * Design system: `docs/design-system/components/pagination.html`.
 *
 * Usage: `<ul libPaginationList>…</ul>`
 */
@Component({
  selector: 'ul[libPaginationList]',
  standalone: true,
  templateUrl: './pagination-list.component.html',
  styleUrl: './pagination-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pagination__list',
  },
})
export class PaginationListComponent {}
