import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * One page button; `aria-current="page"` marks the page shown.
 * Design system: `docs/design-system/components/pagination.html`.
 *
 * Usage: `<button libPaginationLink type="button" aria-label="Page 2">2</button>`
 */
@Component({
  selector: 'button[libPaginationLink]',
  standalone: true,
  templateUrl: './pagination-link.component.html',
  styleUrl: './pagination-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pagination__link',
  },
})
export class PaginationLinkComponent {}
