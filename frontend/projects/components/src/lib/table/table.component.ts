import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A data table; the app writes its caption, header cells and rows.
 * Design system: `docs/design-system/components/table.html`.
 *
 * Usage: `<table libTable><caption class="visually-hidden">Users</caption>…</table>`
 */
@Component({
  selector: 'table[libTable]',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'table',
  },
})
export class TableComponent {}
