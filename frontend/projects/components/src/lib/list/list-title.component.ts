import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The main line of a list row.
 * Design system: `docs/design-system/components/list.html`.
 *
 * Usage: `<div libListTitle>Leaky tap</div>`
 */
@Component({
  selector:
    'div[libListTitle], span[libListTitle], p[libListTitle], h3[libListTitle], button[libListTitle]',
  standalone: true,
  templateUrl: './list-title.component.html',
  styleUrl: './list-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'list__title',
  },
})
export class ListTitleComponent {}
