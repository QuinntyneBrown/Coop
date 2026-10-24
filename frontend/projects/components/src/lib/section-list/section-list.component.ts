import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The page editor's sections in the order visitors see them, numbered.
 * Design system: `docs/design-system/components/section-list.html`.
 *
 * Usage: `<ol libSectionList aria-label="Sections in the order visitors see them">…</ol>`
 */
@Component({
  selector: 'ol[libSectionList]',
  standalone: true,
  templateUrl: './section-list.component.html',
  styleUrl: './section-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'section-list',
  },
})
export class SectionListComponent {}
