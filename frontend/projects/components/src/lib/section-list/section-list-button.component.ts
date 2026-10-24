import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The section's name as a button; `aria-current="true"` marks the selected section.
 * Design system: `docs/design-system/components/section-list.html`.
 *
 * Usage: `<button libSectionListButton type="button" aria-current="true">Welcome banner</button>`
 */
@Component({
  selector: 'button[libSectionListButton]',
  standalone: true,
  templateUrl: './section-list-button.component.html',
  styleUrl: './section-list-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'section-list__button',
  },
})
export class SectionListButtonComponent {}
