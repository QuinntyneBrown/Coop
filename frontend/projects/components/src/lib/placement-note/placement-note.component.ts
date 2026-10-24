import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * One plain sentence under a section heading that says where the section appears on the public page.
 * Design system: `docs/design-system/components/placement-note.html`.
 *
 * Usage: `<p libPlacementNote><svg libIcon="place" size="sm"></svg><span>Appears first on the home page, under the menu.</span></p>`
 */
@Component({
  selector: 'p[libPlacementNote]',
  standalone: true,
  templateUrl: './placement-note.component.html',
  styleUrl: './placement-note.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'placement-note',
  },
})
export class PlacementNoteComponent {}
