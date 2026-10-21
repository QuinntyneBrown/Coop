import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A caption under a thumbnail.
 * Design system: `docs/design-system/components/picture-list.html`.
 *
 * Usage: `<span libPictureListNote>Loading photo…</span>`
 */
@Component({
  selector: 'span[libPictureListNote]',
  standalone: true,
  templateUrl: './picture-list-note.component.html',
  styleUrl: './picture-list-note.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'picture-list__note',
  },
})
export class PictureListNoteComponent {}
