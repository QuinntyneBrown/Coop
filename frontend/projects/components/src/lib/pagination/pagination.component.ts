import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The row under a table that says which rows show and moves between pages.
 * Design system: `docs/design-system/components/pagination.html`.
 *
 * Usage: `<nav libPagination aria-label="Pages of users">…</nav>`
 */
@Component({
  selector: 'nav[libPagination]',
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pagination',
  },
})
export class PaginationComponent {}
