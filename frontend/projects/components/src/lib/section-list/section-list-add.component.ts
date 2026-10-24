import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The "Add to the page" row of block kinds under a page's section list.
 * Design system: `docs/design-system/components/section-list.html`.
 *
 * Usage: `<div libSectionListAdd role="group" aria-label="Add to the page"><span libSectionListAddLabel>Add to the page</span>…</div>`
 */
@Component({
  selector: 'div[libSectionListAdd]',
  standalone: true,
  templateUrl: './section-list-add.component.html',
  styleUrl: './section-list-add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'section-list__add',
  },
})
export class SectionListAddComponent {}
