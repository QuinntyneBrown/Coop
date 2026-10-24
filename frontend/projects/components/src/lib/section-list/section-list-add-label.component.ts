import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The caption of the add row.
 * Design system: `docs/design-system/components/section-list.html`.
 *
 * Usage: `<span libSectionListAddLabel>Add to the page</span>`
 */
@Component({
  selector: 'span[libSectionListAddLabel]',
  standalone: true,
  templateUrl: './section-list-add-label.component.html',
  styleUrl: './section-list-add-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'section-list__add-label',
  },
})
export class SectionListAddLabelComponent {}
