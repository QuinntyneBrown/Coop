import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The row of tools that act on the selected section: Hide or Show, Move up, Move down, Remove.
 * Design system: `docs/design-system/components/section-list.html`.
 *
 * Usage: `<div libSectionListTools role="group" aria-label="Selected section">…</div>`
 */
@Component({
  selector: 'div[libSectionListTools]',
  standalone: true,
  templateUrl: './section-list-tools.component.html',
  styleUrl: './section-list-tools.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'section-list__tools',
  },
})
export class SectionListToolsComponent {}
