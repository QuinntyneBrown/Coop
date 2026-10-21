import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The text column of a list row.
 * Design system: `docs/design-system/components/list.html`.
 *
 * Usage: `<div libListBody>…</div>`
 */
@Component({
  selector: 'div[libListBody], span[libListBody]',
  standalone: true,
  templateUrl: './list-body.component.html',
  styleUrl: './list-body.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'list__body',
  },
})
export class ListBodyComponent {}
