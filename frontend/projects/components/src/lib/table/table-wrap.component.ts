import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The box a table scrolls in when it is wider than the screen; `flush` drops its border inside a
 * card.
 * Design system: `docs/design-system/components/table.html`.
 *
 * Usage: `<div libTableWrap flush>…</div>`
 */
@Component({
  selector: 'div[libTableWrap]',
  standalone: true,
  templateUrl: './table-wrap.component.html',
  styleUrl: './table-wrap.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'table-wrap',
    '[class.table-wrap--flush]': 'flush()',
  },
})
export class TableWrapComponent {
  readonly flush = input(false, { transform: booleanAttribute });
}
