import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A plain list of rows.
 * Design system: `docs/design-system/components/list.html`.
 *
 * Usage: `<ul libList>…</ul>`
 */
@Component({
  selector: 'ul[libList], ol[libList]',
  standalone: true,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'list',
  },
})
export class ListComponent {}
